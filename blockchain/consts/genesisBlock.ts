import { Block } from "../types";
import { GENESIS_ADDRESS } from "./genesisAddress";
import { TOTAL_SUPPLY } from "./totalSupply";

export const genesisBlock: Block = {
  hash: 0,
  previousHash: null,
  transactions: [
    {
      senderAddress: "0",
      receiverAddress: GENESIS_ADDRESS,
      amount: TOTAL_SUPPLY,
    },
  ],
};
