import Web3 = require("web3");
import { Airdrop } from "../models";

export default async function airdropTokens(
  web3: Web3,
  githubUsername: string,
  address: string
) {
  // TODO: send mint transaction
  web3;

  const airdrop = await Airdrop.create({ githubUsername, address });

  return airdrop;
}
