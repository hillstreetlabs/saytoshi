import Web3 = require("web3");
import Contract from "web3/eth/contract";
import EventEmitter = require("events");
import { BigNumber } from "bignumber.js";
import Ethstream from "ethstream";
import { Block } from "ethstream/dist/EthStream";
import { Log } from "./models";
const TweEthVoter = require("../abis/TweEthVoter");

export default class BlockWatcher extends EventEmitter {
  contract: Contract;
  stream: Ethstream;

  constructor(public web3: Web3) {
    super();
    this.contract = new web3.eth.Contract(
      TweEthVoter,
      process.env.VOTER_ADDRESS
    );
  }

  async start() {
    const currentBlock = await this.web3.eth.getBlockNumber();
    const startBlock = currentBlock - 30;
    this.stream = new Ethstream(this.web3.currentProvider, {
      fromBlockNumber: startBlock,
      onAddBlock: async block => {
        console.log("Got block", block.number);
        while (true) {
          try {
            await this.checkBlockForLogs(block);
            break;
          } catch (e) {
            console.log("Error during logs check, trying again soon");
            console.error(e);
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
        }
      }
    });

    this.stream.start();
  }

  async checkBlockForLogs(block: Block) {
    // Don't get ahead of yourself
    await new Promise(resolve => setTimeout(resolve, 4000));
    const events = await this.contract.getPastEvents("allEvents", {
      fromBlock: block.number,
      toBlock: block.number
    });
    if (events.length <= 0) return;

    const { timestamp } = await this.web3.eth.getBlock(block.number);
    for (let event of events) {
      const logId = event.blockHash + ":" + event.logIndex;
      const existingLog = await Log.findOne({ logId });
      if (existingLog) return;
      await Log.create({ logId });
      if (event.event === "ProposalCreated") {
        const proposal = await this.contract.methods
          .uuidToProposals(event.returnValues.id)
          .call();
        const bonus = proposal[5]; // hacky
        this.emit("tweetProposed", {
          uuid: event.returnValues.id.substring(2),
          timestamp: new Date(timestamp * 1000),
          stake: new BigNumber(bonus.toString())
        });
      }
      if (event.event === "VoteLogged") {
        this.emit("voteAdded", {
          uuid: event.returnValues.id.substring(2),
          isYes: event.returnValues.yes,
          voter: event.returnValues.voter,
          timestamp: new Date(timestamp * 1000),
          stake: new BigNumber(event.returnValues.amount.toString())
        });
      }
    }
  }
}
