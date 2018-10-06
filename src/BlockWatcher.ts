import Web3 = require("web3");
import EventEmitter = require("events");
import { BigNumber } from "bignumber.js";
// import Ethstream from "ethstream";
// import { Block } from "ethstream/dist/EthStream";

export default class BlockWatcher extends EventEmitter {
  constructor(public web3: Web3) {
    super();
  }

  async start() {
    // const currentBlock = await this.web3.eth.getBlockNumber();
    // TODO
  }

  async __test_proposal(uuid: string) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    this.emit("tweetProposed", {
      uuid,
      stake: new BigNumber("1000000000000000000"),
      timestamp: new Date()
    });
  }

  async __test_vote(uuid: string, vote: "yes" | "no") {
    this.emit("voteAdded", {
      uuid,
      vote,
      stake: new BigNumber("1000000000000000000"),
      timestamp: new Date()
    });
  }
}
