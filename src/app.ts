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
var GitHubStrategy = require("passport-github").Strategy;

export default async function createApp() {
  const provider = new Web3.providers.HttpProvider(process.env.ETHEREUM_HTTP);
  const web3 = new Web3(provider);

  const watcher = new BlockWatcher(web3);

  async function closeTweetVoting() {
    // TODO: calling functions on
    const abi: any[] = [];
    const CONTRACT_ADDRESS = "0x0";
    const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
    contract;

    // TODO: post tweet
  }

  async function handleTweetProposed({
    uuid,
    stake,
    timestamp
  }: {
    uuid: string;
    stake: BigNumber;
    timestamp: Date;
  }) {
    await Tweet.updateOne(
      { uuid },
      { status: "proposed", stake: stake.toString() }
    );
    // Set timeout for scheduling 😎
    const remainingTime = timestamp.getTime() - Date.now() + 1000;
    setTimeout(closeTweetVoting, remainingTime);
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
  app.use(require("body-parser").urlencoded({ extended: true }));
  app.use(passport.initialize());
  app.use(session({ secret: "secret" }));

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
  const schema = getSchema();
  app.use(
    "/graphql",
    graphQLHttp(req => ({
      schema,
      graphiql: true,
      context: { req, watcher },
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

        // TODO: actually send the mint transaction here
        try {
          const airdrop = await Airdrop.create({
            githubUsername: profile.username,
            address: req.session.address
          });
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
    passport.authenticate("github"),
    (_req, _res) => {}
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

  app.get("*", (req, res) => {
    return handle(req, res);
  });

  await mongoose.connect(process.env.MONGODB_URL);
  // Make sure there is at least one tweeter
  const tweeterCount = await Tweeter.countDocuments({});
  if (tweeterCount <= 0) {
    await Tweeter.create({ handle: "example" });
  }

  const server = createServer(app);

  return { server, watcher, web3 };
}
