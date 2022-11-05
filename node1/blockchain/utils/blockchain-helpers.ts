import { readFileSync, writeFileSync } from "fs";
import { Blockchain, Transaction, Wallets } from "../types";

/** blockchain helpers **/
export const getBlockchain = (): Blockchain => {
  const blockchainFile = readFileSync("./blockchain/blockchain.json");
  const blockchain = JSON.parse(String(blockchainFile));
  return blockchain;
}

export const writeBlockchain = (blockchain: Blockchain): void => {
  const blockchainString = JSON.stringify(blockchain, null, 2);
  writeFileSync("./blockchain/blockchain.json", blockchainString);
}

/** transaction helpers **/
export const getTransactions = (): Transaction[] => {
  const transactionsFile = readFileSync("./blockchain/transactions.json");
  const transactions = JSON.parse(String(transactionsFile));
  return transactions;
}

export const writeTransactions = (transactions: Transaction[]): void => {
  const transactionsString = JSON.stringify(transactions, null, 2);
  writeFileSync("./blockchain/transactions.json", transactionsString);
}

/** wallet helpers **/
export const getWallets = (): Wallets => {
  const walletsFile = readFileSync("./blockchain/wallets.json");
  const wallets = JSON.parse(String(walletsFile));
  return wallets;
}

export const writeWallets = (wallets: Wallets): void => {
  const walletsString = JSON.stringify(wallets, null, 2);
  writeFileSync("./blockchain/wallets.json", walletsString);
}

export const getWalletAddressFromName = (name: string): string => {
  const wallets = getWallets();
  if(!wallets[name]) throw Error("There is no such a name on the wallet list!");
  return wallets[name].publicKey;
}

/** address helpers **/
export const getAddressBalance = (address: string): number => {
  const blockchain = getBlockchain();
  const transactions = getTransactions();
  let balance = 0;

  // loop over blocks
  for (let i = 0; i < blockchain.length; i++) {
    const { transactions } = blockchain[i];

    if (!transactions) continue;

    // loop over transactions
    for (let j = 0; j < transactions.length; j++) {
      const { senderAddress, receiverAddress, amount = 0 } = transactions[j];
      if (senderAddress === address) {
        balance -= amount;
      }

      if (receiverAddress === address) {
        balance += amount;
      }
    }
  }

  // loop over transaction pool

  for (let i = 0; i < transactions.length; i++) {
    const { senderAddress, receiverAddress, amount = 0, gasFee = 0 } = transactions[i];
    if (senderAddress === address) {
      balance -= amount + gasFee;
    }

    if (receiverAddress === address) {
      balance += amount;
    }
  }

  return balance;
}