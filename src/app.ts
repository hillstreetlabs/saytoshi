import express = require("express");
import { Request } from "express";
import cors = require("cors");
import { createServer } from "http";
import compression = require("compression");
import session = require("express-session");
import getSchema from "./graphql";
import graphQLHttp = require("express-graphql");
import mongoose = require("mongoose");
import { Tweeter, Tweet, Airdrop } from "./models";
import BlockWatcher from "./BlockWatcher";
import { BigNumber } from "bignumber.js";
import Web3 = require("web3");
import next = require("next");
import passport = require("passport");
import airdropTokens from "./mutations/airdropTokens";
import closeTweetVoting from "./mutations/closeTweetVoting";
import closeProposedTweets from "./mutations/closeProposedTweets";
import postTopTweet from "./mutations/postTopTweet";
import bodyParser = require("body-parser");
var GitHubStrategy = require("passport-github").Strategy;
var TwitterStrategy = require("passport-twitter").Strategy;
var HDWalletProvider = require("truffle-hdwallet-provider");

export default async function createApp() {
  const provider = new HDWalletProvider(
    process.env.MNEMONIC,
    process.env.ETHEREUM_HTTP
  );
  const web3 = new Web3(provider);

  const watcher = new BlockWatcher(web3);

  // Hacky "scheduled jobs" -- would ideally be done with cron
  setInterval(() => closeProposedTweets(web3), 20000); // TODO: Every ten minutes

  // This is a super hacky way of predictably scheduling things with setInterval
  const timeBetweenTweets = 120000;
  let nextTweetTime = Date.now() + timeBetweenTweets;
  const getQueuedTweetTime = (queuePosition: number) =>
    new Date(nextTweetTime + timeBetweenTweets * queuePosition);
  setInterval(() => {
    postTopTweet();
    nextTweetTime = Date.now() + timeBetweenTweets;
  }, timeBetweenTweets);

  async function handleTweetProposed({
    uuid,
    stake,
    timestamp
  }: {
    uuid: string;
    stake: BigNumber;
    timestamp: Date;
  }) {
    console.log(arguments);
    const tweet = await Tweet.updateOne(
      { uuid },
      { status: "proposed", stake: stake.toString(), proposedAt: timestamp }
    );

    console.log(tweet);
    // Set timeout for scheduling 😎
    const expirationTime = timestamp.getTime() + 10 * 1000 * 60;
    const remainingTime = expirationTime - Date.now() + 5000; // 5 seconds extra
    console.log("Tweet proposed, will close voting in 10 minutes");
    setTimeout(() => closeTweetVoting(web3, uuid), remainingTime);
  }

  async function handleVoteAdded({
    uuid,
    isYes,
    stake,
    timestamp,
    voter
  }: {
    uuid: string;
    isYes: boolean;
    stake: BigNumber;
    timestamp: Date;
    voter: string;
  }) {
    const newVote = {
      timestamp,
      isYes,
      stake: stake.toString(),
      voter
    };
    await Tweet.update({ uuid }, { $push: { votes: newVote } });
  }

  watcher.on("tweetProposed", handleTweetProposed);
  watcher.on("voteAdded", handleVoteAdded);

  const app = express();
  app.use(cors());
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(session({ secret: "secret" }));
  app.use(passport.initialize());

  const dev = process.env.NODE_ENV !== "production";
  const nextApp = next({ dev });
  const handle = nextApp.getRequestHandler();
  await nextApp.prepare();

  const formatError = (error: any) => {
    return {
      message: error.message,
      stack:
        process.env.NODE_ENV !== "production" ? error.stack.split("\n") : null
    };
  };
  app.use("/graphql", (req, _res, next) => {
    try {
      console.log("Request", {
        query: req.body.query.match(/[\s]*(query|mutation) ([\w]+)/)[2],
        keys: req.body.variables && Object.keys(req.body.variables)
      });
    } catch (e) {}
    next();
  });
  const schema = getSchema();
  app.use(
    "/graphql",
    graphQLHttp(req => ({
      schema,
      graphiql: true,
      context: { req, watcher, getQueuedTweetTime },
      formatError
    }))
  );

  // Github OAuth

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.URL}/auth/github/callback`,
        passReqToCallback: true
      },
      async function(
        req: Request,
        _accessToken: any,
        _refreshToken: any,
        profile: any,
        cb: any
      ) {
        const currentAirdrop = await Airdrop.findOne({
          githubUsername: profile.username
        });
        console.log(currentAirdrop);
        if (currentAirdrop) return cb(null, { claimed: true });
        try {
          const airdrop = await airdropTokens(
            web3,
            profile.username,
            req.session.address
          );
          cb(null, airdrop);
        } catch (e) {
          console.error(e);
          cb(null, false);
        }
      }
    )
  );
  app.get(
    "/airdrop/to/:address",
    async (req, _res, next) => {
      const address = req.params.address.toLowerCase();
      req.session.address = address;
      next();
    },
    passport.authenticate("github")
  );
  app.get(
    "/auth/github/callback",
    passport.authenticate("github", {
      failureRedirect: "/airdrop?failure",
      session: false
    }),
    function(req, res) {
      if (req.user.claimed) res.redirect(`/airdrop?failure=claimed`);
      else
        // Successful authentication, redirect home.
        res.redirect(`/airdrop?airdropId=${req.user._id}`);
    }
  );

  // Twitter oauth
  passport.serializeUser(function(user, done) {
    console.log("Serializing", user);
    done(null, user);
  });
  passport.deserializeUser(function(user, done) {
    console.log("Deserializing", user);
    done(null, user);
  });
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: `${process.env.URL}/auth/twitter/callback`,
        passReqToCallback: true
      },
      async function(
        req: Request,
        token: any,
        tokenSecret: any,
        profile: any,
        cb: any
      ) {
        console.log(profile);
        const currentTweeter = await Tweeter.findOne({
          handle: profile.username
        });
        const photo = ((profile.photos || [{}])[0].value || "").replace(
          /_normal/,
          "_200x200"
        );
        if (currentTweeter) {
          await Tweeter.update(
            { _id: currentTweeter._id },
            {
              token,
              tokenSecret,
              photo,
              handle: profile.username,
              address: req.session.address,
              followerCount: profile._json.followers_count
            }
          );
          cb(null, currentTweeter);
        } else {
          const tweeter = await Tweeter.create({
            token,
            tokenSecret,
            handle: profile.username,
            address: req.session.address,
            photo,
            followerCount: profile._json.followers_count
          });
          cb(null, tweeter);
        }
      }
    )
  );
  app.get(
    "/auth/twitter/:address",
    (req, _res, next) => {
      const address = req.params.address.toLowerCase();
      req.session.address = address;
      next();
    },
    passport.authenticate("twitter")
  );
  app.get(
    "/auth/twitter/callback",
    passport.authenticate("twitter", {
      failureRedirect: "/connect"
    }),
    function(_req, res) {
      // Successful authentication, redirect home.
      res.redirect("/?createdTweeter");
    }
  );

  // Custom next routes
  app.get("/airdrop", (req, res) => {
    return handle(req, res);
  });

  app.get("/connect", (req, res) => {
    return handle(req, res);
  });

  app.get("/revoke", (req, res) => {
    return handle(req, res);
  });

  app.get("/t/:uuid", (req, res) => {
    const actualPage = "/viewTweet";
    const queryParams = { uuid: req.params.uuid };
    nextApp.render(req, res, actualPage, queryParams);
  });

  // Custom routes
  app.get("/:username", (req, res) => {
    const actualPage = "/tweet";
    const queryParams = { username: req.params.username };
    nextApp.render(req, res, actualPage, queryParams);
  });

  app.get("/:username/queue", (req, res) => {
    const actualPage = "/queue";
    const queryParams = { username: req.params.username };
    nextApp.render(req, res, actualPage, queryParams);
  });

  app.get("/:username/vote", (req, res) => {
    const actualPage = "/vote";
    const queryParams = { username: req.params.username };
    nextApp.render(req, res, actualPage, queryParams);
  });

  app.get("*", (req, res) => {
    return handle(req, res);
  });

  await mongoose.connect(process.env.MONGODB_URL);
  const server = createServer(app);

  return { server, watcher, web3 };
}
