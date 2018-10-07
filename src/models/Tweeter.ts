import mongoose = require("mongoose");

export type TweeterModel = mongoose.Document & {
  handle: string;
  token: string;
  tokenSecret: string;
};

const tweeterSchema = new mongoose.Schema({
  handle: String,
  token: String,
  tokenSecret: String,
  address: String
});

const Tweeter = mongoose.model<TweeterModel>("Tweeter", tweeterSchema);
export default Tweeter;
