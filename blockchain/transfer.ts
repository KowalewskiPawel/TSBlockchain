import { MINIMUM_GAS_FEE } from "./consts";
import { Transaction } from "./types";
import {
  getAddressBalance,
  getTransactions,
  writeTransactions,
  ec,
  getUnixTimestamp,
  newUuid,
} from "./utils";

export const transfer = (
  senderPrivateKey: string,
  amount: number,
  gasFee: number,
  receiverPublicKey: string
) => {
  if (!gasFee || gasFee < MINIMUM_GAS_FEE) throw Error("Gas fee is too low");

  const currentTransactions = getTransactions();

  const senderKeypair = ec.keyFromPrivate(senderPrivateKey);
  const senderAddress = senderKeypair.getPublic("hex");

  const signature = senderKeypair.sign(senderAddress + amount + gasFee).toDER("hex");

  const transaction: Transaction = {
    transactionId: newUuid(),
    transactionTimestamp: getUnixTimestamp(),
    senderAddress,
    receiverAddress: receiverPublicKey,
    amount,
    gasFee,
    signature,
  };

  const isBalanceEnough = getAddressBalance(senderAddress) >= amount + gasFee;

  if (!isBalanceEnough) throw Error("Not enough tokens!");

  writeTransactions([...currentTransactions, transaction]);
};
