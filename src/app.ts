import express = require("express");
import cors = require("cors");
import { createServer } from "http";
import compression = require("compression");
import getSchema from "./graphql";
import graphQLHttp = require("express-graphql");
import mongoose = require("mongoose");
import { Tweeter, Tweet } from "./models";
import BlockWatcher from "./BlockWatcher";

export default async function createApp() {
  const app = express();

  app.use(cors());
  app.use(compression());

  app.get("/", async (_req, res) => {
    // Health check
    res.json({
      ready: true
    });
  });

  const formatError = (error: any) => {
    return {
      message: error.message,
      stack:
        process.env.NODE_ENV !== "production" ? error.stack.split("\n") : null
    };
  };

  const watcher = new BlockWatcher();
  watcher.on("tweetProposed", async ({ uuid }) => {
    await Tweet.updateOne({ uuid }, { status: "proposed" });
  });

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

  await mongoose.connect(process.env.MONGODB_URL);

  // Make sure there is at least one tweeter
  const tweeterCount = await Tweeter.countDocuments({});
  if (tweeterCount <= 0) {
    await Tweeter.create({ handle: "example" });
  }

  return createServer(app);
}
