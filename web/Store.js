import { observable } from "mobx";
import { providers } from "ethers";

export default class Store {
  @observable currentAddress = undefined;
  @observable hasErrorEnabling = false;

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
    this.provider = new providers.Web3Provider(web3);
    this.currentAddress = (await this.provider.listAccounts())[0];
    await this.getBalances();
  }

  async refresh() {
    if (!this.hasWeb3) return;
    this.currentAddress = (await this.provider.listAccounts())[0];
    await this.getBalances();
  }

  async getBalances() {
    if (!this.hasWeb3) return;
    // TODO: fetch balances
  }

  get hasWeb3() {
    return !!this.currentAddress;
  }
}
