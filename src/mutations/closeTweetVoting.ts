import Web3 = require("web3");
import { Airdrop } from "../models";

export default async function closeTweetVoting(web3: Web3, uuid: string) {
  // TODO: send mint transaction
  const abi: any[] = [];
  const CONTRACT_ADDRESS = "0x0";
  const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
  contract;

  // TODO: check vote result
  const voteResult: boolean = true;
  let airdrop;

  if (voteResult) {
    // We're a-tweeting!
    airdrop = await Airdrop.updateOne({ uuid }, { status: "approved" });

    // Queue tweet for tweeting?
  } else {
    airdrop = await Airdrop.updateOne({ uuid }, { status: "rejected" });
  }

  return airdrop;
}
