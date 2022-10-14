import { readFileSync, writeFileSync } from "fs";
import { Blockchain, Transaction, Wallets } from "./types";

/** blockchain helpers **/
const getBlockchain = (): Blockchain => {
  const blockchainFile = readFileSync("./blockchain/blockchain.json");
  const blockchain = JSON.parse(String(blockchainFile));
  return blockchain;
}

const writeBlockchain = (blockchain: Blockchain): void => {
  const blockchainString = JSON.stringify(blockchain, null, 2);
  writeFileSync("./blockchain/blockchain.json", blockchainString);
}

const _getBlockchain = getBlockchain;
export { _getBlockchain as getBlockchain };
const _writeBlockchain = writeBlockchain;
export { _writeBlockchain as writeBlockchain };

/** transaction helpers **/
const getTransactions = (): Transaction[] => {
  const transactionsFile = readFileSync("./blockchain/transactions.json");
  const transactions = JSON.parse(String(transactionsFile));
  return transactions;
}

const writeTransactions = (transactions: Transaction[]): void => {
  const transactionsString = JSON.stringify(transactions, null, 2);
  writeFileSync("./blockchain/transactions.json", transactionsString);
}

const _getTransactions = getTransactions;
export { _getTransactions as getTransactions };
const _writeTransactions = writeTransactions;
export { _writeTransactions as writeTransactions };

/** wallet helpers **/
const getWallets = (): Wallets => {
  const walletsFile = readFileSync("./blockchain/wallets.json");
  const wallets = JSON.parse(String(walletsFile));
  return wallets;
}

const writeWallets = (wallets: Wallets): void => {
  const walletsString = JSON.stringify(wallets, null, 2);
  writeFileSync("./blockchain/wallets.json", walletsString);
}

const getWalletAddressFromName = (name: string): string => {
  const wallets = getWallets();
  if(!wallets[name]) throw Error("There is no such a name on the wallet list!");
  return wallets[name].publicKey;
}

const _getWallets = getWallets;
export { _getWallets as getWallets };
const _writeWallets = writeWallets;
export { _writeWallets as writeWallets };
const _getWalletAddressFromName = getWalletAddressFromName;
export { _getWalletAddressFromName as getWalletAddressFromName };

/** address helpers **/
const getAddressBalance = (address: string): number => {
  const blockchain = getBlockchain();
  const transactions = getTransactions();
  let balance = 0;

  // loop over blocks
  for (let i = 1; i < blockchain.length; i++) {
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
    const { senderAddress, receiverAddress, amount = 0 } = transactions[i];
    if (senderAddress === address) {
      balance -= amount;
    }

    if (receiverAddress === address) {
      balance += amount;
    }
  }

  return balance;
}

const _getAddressBalance = getAddressBalance;
export { _getAddressBalance as getAddressBalance };