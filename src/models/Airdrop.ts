import mongoose = require("mongoose");

export type AirdropModel = mongoose.Document & {
  address: string;
  githubUsername: string;
  transaction: string;
  status: "pending" | "completed";
};

const tweeterSchema = new mongoose.Schema({
  address: String,
  githubUsername: { type: String, unique: true, index: true },
  transaction: String,
  status: String
});

const Airdrop = mongoose.model<AirdropModel>("Airdrop", tweeterSchema);
export default Airdrop;
