import { Tweet, Tweeter } from "../models";
const Twitter = require("twitter");

export default async function sendTweet(uuid: string) {
  const tweet = await Tweet.findOne({ uuid });

  const tweeter = await Tweeter.findById(tweet.tweeterId);
  try {
    var twitter = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: tweeter.token,
      access_token_secret: tweeter.tokenSecret
    });

    const tweetObj: any = await new Promise((resolve, reject) =>
      twitter.post(
        "statuses/update",
        { status: tweet.text + " – 📝 by @SayToshiBot" },
        (err: Error, tweet: any) => {
          if (err) reject(err);
          resolve(tweet);
        }
      )
    );

    console.log("Sent tweet", tweetObj);

    await Tweet.updateOne(
      { uuid },
      { status: "tweeted", tweetId: tweetObj.id_str }
    );
  } catch (e) {
    console.error(e);
    await Tweet.updateOne({ uuid }, { status: "error" });
    throw e;
  }
}
