import { Tweet } from "../models";
import Web3 = require("web3");
import closeTweetVoting from "./closeTweetVoting";

// Should be run every little while, cleans up proposed tweets
export default async function closeProposedTweets(web3: Web3) {
  const expiredProposedTweets = await Tweet.find({
    status: "proposed",
    proposedAt: { $lt: new Date(Date.now() - (global as any).VOTING_TIME) }
  });

  for (let tweet of expiredProposedTweets) {
    await closeTweetVoting(web3, tweet.uuid);
  }

  return expiredProposedTweets;
}
