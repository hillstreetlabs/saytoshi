import mongoose = require("mongoose");
import crypto = require("crypto");

export type VoteModel = {
  voter: string;
  timestamp: Date;
  isYes: boolean;
  stake: string;
};

export type TweetModel = mongoose.Document & {
  uuid: string;
  text: string;
  status:
    | "pending"
    | "proposed"
    | "expired"
    | "rejected"
    | "accepted"
    | "tweeted";
  stake: string;
  votes: VoteModel[];
  tweeterId: string;
  tweetId: string;
  yesStake: number;
};

const tweetSchema = new mongoose.Schema(
  {
    uuid: { type: String, unique: true, index: true },
    text: String,
    proposedAt: Date,
    tweeterId: mongoose.SchemaTypes.ObjectId,
    status: String,
    stake: String,
    tweetId: String,
    votes: [{ voter: String, timestamp: Date, isYes: Boolean, stake: String }],
    yesStake: Number
  },
  { timestamps: true }
);

tweetSchema.pre<TweetModel>("save", function() {
  if (!this.uuid) this.uuid = crypto.randomBytes(32).toString("hex");
});

const Tweet = mongoose.model<TweetModel>("Tweet", tweetSchema);
export default Tweet;
