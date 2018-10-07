import { observable } from "mobx";
import { providers, Contract } from "ethers";
import { BigNumber } from "bignumber.js";
const TweEthVoter = require("../abis/TweEthVoter");
const ERC20Mintable = require("../abis/ERC20Mintable");

export default class Store {
  @observable currentAddress = undefined;
  @observable hasErrorEnabling = false;
  @observable isUnlocked = undefined;
  @observable tokenBalance = undefined;
  @observable quorum = undefined;

  async start() {
    let web3 = null;
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        web3 = window.ethereum;
      } catch (e) {
        this.hasErrorEnabling = true;
        return;
      }
    } else if (window.web3) {
      web3 = window.web3.currentProvider;
    }
    if (!web3) return null;
    this.provider = new providers.Web3Provider(web3);
    this.voterContract = new Contract(
      process.env.VOTER_ADDRESS,
      TweEthVoter,
      this.provider.getSigner()
    );
    this.tokenContract = new Contract(
      process.env.TWEETH_ADDRESS,
      ERC20Mintable,
      this.provider.getSigner()
    );

    this.currentAddress = (await this.provider.listAccounts())[0];
    const allowance = await this.tokenContract.allowance(
      this.currentAddress,
      process.env.VOTER_ADDRESS
    );
    this.isUnlocked = !allowance.isZero();
    this.getBalances();
    this.interval = setInterval(() => this.refresh(), 2000);
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
  }

  async refresh() {
    if (!this.hasWeb3) return;
    this.currentAddress = (await this.provider.listAccounts())[0];
    await this.getBalances();
  }

  async getBalances() {
    if (!this.hasWeb3) return;
    const totalSupply = await this.tokenContract.totalSupply();
    this.quorum = new BigNumber(totalSupply.toString()).div(
      new BigNumber("20")
    );
    this.tokenBalance = await this.tokenContract.balanceOf(this.currentAddress);
  }

  get hasWeb3() {
    return !!this.currentAddress && typeof this.isUnlocked !== undefined;
  }
}
