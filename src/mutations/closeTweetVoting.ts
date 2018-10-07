import Web3 = require("web3");
import { Tweet } from "../models";
const TweEthVoter = require("../../abis/TweEthVoter");

export default async function closeTweetVoting(web3: Web3, uuid: string) {
  let tweet = await Tweet.findOne({ uuid });
  if (tweet.status !== "proposed") return tweet; // already closed
  console.log("Closing voting for " + tweet.uuid);

  // TODO: send mint transaction
  const contract = new web3.eth.Contract(
    TweEthVoter,
    process.env.VOTER_ADDRESS
  );
  const proposal = await contract.methods.uuidToProposals("0x" + uuid).call();
  console.log(proposal);

  // TODO: check vote result
  const voteResult: boolean = true;
  if (voteResult) {
    // We're a-tweeting!
    tweet = await Tweet.updateOne({ uuid }, { status: "accepted" });
  } else {
    tweet = await Tweet.updateOne({ uuid }, { status: "rejected" });
  }

  return tweet;
}
