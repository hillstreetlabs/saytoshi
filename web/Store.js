import { observable, when } from "mobx";
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

  @observable voterContract = undefined;
  @observable tokenContract = undefined;

  async start() {
    let web3 = null;
    let isShimmed = false;
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        web3 = window.ethereum;
      } catch (e) {
        this.hasErrorEnabling = true;
        this.isShimmed = true;
      }
    } else if (window.web3) {
      web3 = window.web3.currentProvider;
    }
    if (!web3) isShimmed = true;
    this.provider = isShimmed
      ? new providers.JsonRpcProvider(process.env.ETHEREUM_HTTP)
      : new providers.Web3Provider(web3);
    this.voterContract = new Contract(
      process.env.VOTER_ADDRESS,
      TweEthVoter,
      isShimmed ? this.provider : this.provider.getSigner()
    );
    this.tokenContract = new Contract(
      process.env.TWEETH_ADDRESS,
      ERC20Mintable,
      isShimmed ? this.provider : this.provider.getSigner()
    );
    if (!isShimmed) await this.initAccount();
    this.getBalances(); // Don't care about account
    this.interval = setInterval(() => this.refresh(), 2000);
  }

  async initAccount() {
    this.currentAddress = (await this.provider.listAccounts())[0];
    if (!this.currentAddress) {
      setTimeout(() => this.initAccount(), 2000);
      return;
    }
    const allowance = await this.tokenContract.allowance(
      this.currentAddress,
      process.env.VOTER_ADDRESS
    );
    this.isUnlocked = !allowance.isZero();
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
  }

  async getContracts() {
    if (!this.voterContract || !this.tokenContract) {
      await when(() => this.voterContract && this.tokenContract);
    }
    return {
      voterContract: this.voterContract,
      tokenContract: this.tokenContract
    };
  }

  async refresh() {
    if (this.hasWeb3)
      this.currentAddress = (await this.provider.listAccounts())[0];
    await this.getBalances();
  }

  async getBalances() {
    const totalSupply = await this.tokenContract.totalSupply();
    this.quorum = new BigNumber(totalSupply.toString()).div(
      new BigNumber("100")
    );
    if (!this.hasWeb3) return;
    this.tokenBalance = await this.tokenContract.balanceOf(this.currentAddress);
  }

  get hasWeb3() {
    return !!this.currentAddress && typeof this.isUnlocked !== undefined;
  }
}
