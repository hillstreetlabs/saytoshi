import mongoose = require("mongoose");

export type TweeterModel = mongoose.Document & {
  handle: string;
  token: string;
  tokenSecret: string;
  photo: string;
  followerCount: number;
  address: string;
};

const tweeterSchema = new mongoose.Schema({
  handle: String,
  token: String,
  tokenSecret: String,
  address: String,
  photo: String,
  followerCount: Number
});

const Tweeter = mongoose.model<TweeterModel>("Tweeter", tweeterSchema);
export default Tweeter;
