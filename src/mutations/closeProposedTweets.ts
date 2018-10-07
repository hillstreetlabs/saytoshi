import { Tweet } from "../models";
import Web3 = require("web3");
import closeTweetVoting from "./closeTweetVoting";

const proposalTimeMs = 10 * 60 * 1000;

// Should be run every little while, cleans up proposed tweets
export default async function closeProposedTweets(web3: Web3) {
  const expiredProposedTweets = await Tweet.find({
    status: "proposed",
    proposedAt: { $lt: new Date(Date.now() - proposalTimeMs) }
  });

  for (let tweet of expiredProposedTweets) {
    await closeTweetVoting(web3, tweet.uuid);
  }

  return expiredProposedTweets;
}
