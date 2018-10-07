import { Tweet } from "../models";
// import sendTweet from "./sendTweet";

export default async function postTopTweet() {
  const acceptedTweets = await Tweet.find({ status: "accepted" });
  acceptedTweets.sort((a, b) => b.yesStake - a.yesStake);

  const topTweet = acceptedTweets[0];

  if (!topTweet) return;

  // await sendTweet(topTweet.uuid);
}
