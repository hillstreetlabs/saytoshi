import Web3 = require("web3");
import EventEmitter = require("events");
// import Ethstream from "ethstream";
// import { Block } from "ethstream/dist/EthStream";

export default class BlockWatcher extends EventEmitter {
  web3: Web3;

  constructor() {
    super();
    const provider = new Web3.providers.HttpProvider(process.env.ETHEREUM_HTTP);
    this.web3 = new Web3(provider);
  }

  async start() {
    // const currentBlock = await this.web3.eth.getBlockNumber();
    // TODO
  }

  async __test_proposal(uuid: string) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    this.emit("tweetProposed", { uuid });
  }
}
