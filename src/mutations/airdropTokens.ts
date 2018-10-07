import Web3 = require("web3");
import { Airdrop } from "../models";
const ERC20Mintable = require("../../abis/ERC20Mintable");
import { BigNumber } from "bignumber.js";

const MINT_AMOUNT = "0x" + new BigNumber("50000000000000000000").toString(16);

export default async function airdropTokens(
  web3: Web3,
  githubUsername: string,
  address: string
) {
  // TODO: send mint transaction
  const contract = new web3.eth.Contract(
    ERC20Mintable,
    process.env.TWEETH_ADDRESS
  );
  const ourAddress = (await web3.eth.getAccounts())[0];
  console.log("Our address", ourAddress);
  const receipt = await contract.methods.mint(address, MINT_AMOUNT).send({
    from: ourAddress
  });

  console.log("Sent 50 tokens to " + address);

  const airdrop = await Airdrop.create({
    githubUsername,
    address,
    transaction: receipt.transactionHash
  });

  return airdrop;
}
