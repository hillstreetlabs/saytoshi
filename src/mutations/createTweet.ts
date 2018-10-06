import { Tweet, Tweeter } from "../models";

export default async function createTweet(input: {
  text: string;
  tweeterId: string;
}) {
  const tweeter = await Tweeter.findById(input.tweeterId);
  if (!tweeter) throw new Error("Tweeter not found");
  const tweet = await Tweet.create({
    text: input.text,
    status: "pending",
    tweeterId: tweeter._id
  });

  return tweet;
}
