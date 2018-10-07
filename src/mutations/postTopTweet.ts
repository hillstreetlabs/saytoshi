import { Tweet, Tweeter } from "../models";
import sendTweet from "./sendTweet";

export default async function postTopTweet(handle: string) {
  const tweeter = await Tweeter.findOne({ handle });

  const acceptedTweets = await Tweet.find({ status: "accepted", tweeterId: tweeter._id });
  acceptedTweets.sort((a, b) => b.yesStake - a.yesStake);

  const topTweet = acceptedTweets[0];

  console.log("Top tweet", topTweet);

  if (!topTweet) return;

  await sendTweet(topTweet.uuid);
}
