import Web3 = require("web3");
import { Tweet, Tweeter } from "../models";
const TweEthVoter = require("../../abis/TweEthVoter");
import { utils } from "ethers";
import { BigNumber } from "bignumber.js";

export default async function closeTweetVoting(web3: Web3, uuid: string) {
  let tweet = await Tweet.findOne({ uuid });
  let tweeter = await Tweeter.findById(tweet.tweeterId);
  if (tweet.status !== "proposed") return tweet; // already closed
  console.log("Closing voting for " + tweet.uuid);

  const contract = new web3.eth.Contract(
    TweEthVoter,
    process.env.VOTER_ADDRESS
  );
  const proposal = await contract.methods.uuidToProposals("0x" + uuid).call();
  console.log(proposal);
  const yesStake = parseFloat(utils.formatEther(proposal.yesTotal));
  const totalStakeBn = new BigNumber(proposal.yesTotal).plus(
    new BigNumber(proposal.noTotal)
  );
  const totalStake = parseFloat(utils.formatEther(totalStakeBn.toString()));
  const shouldTweet = await contract.methods.tweetThisID("0x" + uuid).call();
  console.log(shouldTweet);

  // Close tweeting to let people get paid
  const ourAddress = (await web3.eth.getAccounts())[0];
  let tweeterAddress = tweeter ? tweeter.address : null;
  await contract.methods.close("0x" + uuid, tweeterAddress || ourAddress).send({
    from: ourAddress,
    gasPrice: 10000000000
  });

  if (shouldTweet) {
    // We're a-tweeting!
    tweet = await Tweet.updateOne(
      { uuid },
      { status: "accepted", yesStake, totalStake }
    );
  } else {
    tweet = await Tweet.updateOne(
      { uuid },
      { status: "rejected", yesStake, totalStake }
    );
  }

  return tweet;
}
