import express = require("express");
import cors = require("cors");
import { createServer } from "http";
import compression = require("compression");
import getSchema from "./graphql";
import graphQLHttp = require("express-graphql");
import mongoose = require("mongoose");
import { Tweeter } from "./models";

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

  const schema = getSchema();
  app.use(
    "/graphql",
    graphQLHttp({
      schema,
      graphiql: true,
      formatError
    })
  );

  await mongoose.connect(process.env.MONGODB_URL);
  mongoose.Types.ObjectId.prototype.valueOf = function() {
    return this.toString();
  };

  // Make sure there is at least one tweeter
  const tweeterCount = await Tweeter.count({});
  if (tweeterCount <= 0) {
    await Tweeter.create({ handle: "example" });
  }

  return createServer(app);
}
