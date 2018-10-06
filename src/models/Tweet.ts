import mongoose = require("mongoose");

export type TweetModel = mongoose.Document & {
  text: string;
  status:
    | "pending"
    | "proposed"
    | "expired"
    | "rejected"
    | "accepted"
    | "tweeted";
};

const tweetSchema = new mongoose.Schema(
  {
    text: String,
    tweeterId: mongoose.SchemaTypes.ObjectId,
    status: String
  },
  { timestamps: true }
);

const Tweet = mongoose.model<TweetModel>("Tweet", tweetSchema);
export default Tweet;
