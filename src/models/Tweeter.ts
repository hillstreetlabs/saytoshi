import mongoose = require("mongoose");

export type TweeterModel = mongoose.Document & {
  handle: string;
};

const tweeterSchema = new mongoose.Schema({
  handle: String
});

const Tweeter = mongoose.model<TweeterModel>("Tweeter", tweeterSchema);
export default Tweeter;
