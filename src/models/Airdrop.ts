import mongoose = require("mongoose");

export type AirdropModel = mongoose.Document & {
  githubUsername: string;
  transaction: string;
  status: "pending" | "completed";
};

const tweeterSchema = new mongoose.Schema({
  githubUsername: { type: String, unique: true, index: true },
  transaction: String,
  status: String
});

const Airdrop = mongoose.model<AirdropModel>("Airdrop", tweeterSchema);
export default Airdrop;
