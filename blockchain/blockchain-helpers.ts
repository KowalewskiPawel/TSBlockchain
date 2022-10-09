import { readFileSync, writeFileSync } from "fs";
import { Blockchain, Items, Transaction, Wallets } from "./types";

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
  return wallets[name].publicKey;
}

const _getWallets = getWallets;
export { _getWallets as getWallets };
const _writeWallets = writeWallets;
export { _writeWallets as writeWallets };
const _getWalletAddressFromName = getWalletAddressFromName;
export { _getWalletAddressFromName as getWalletAddressFromName };

/** item helpers **/
const getRandomItem = (): string => {
  const itemsFile = readFileSync("./blockchain/items.json");
  const items: Items = JSON.parse(String(itemsFile));
  const itemKeys = Object.keys(items);
  const randomItem = itemKeys[Math.floor(Math.random() * itemKeys.length)];
  return randomItem;
}

const getItemPrice = (item: string): number => {
  const itemsFile = readFileSync("./blockchain/items.json");
  const items: Items = JSON.parse(String(itemsFile));
  return items[item];
}

const _getRandomItem = getRandomItem;
export { _getRandomItem as getRandomItem };
const _getItemPrice = getItemPrice;
export { _getItemPrice as getItemPrice };

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
      const { buyerAddress, sellerAddress, price = 0 } = transactions[j];
      if (buyerAddress === address) {
        balance -= price;
      }

      if (sellerAddress === address) {
        balance += price;
      }
    }
  }

  // loop over transaction pool
  for (let i = 0; i < transactions.length; i++) {
    const { buyerAddress, sellerAddress, price = 0 } = transactions[i];
    if (buyerAddress === address) {
      balance -= price;
    }

    if (sellerAddress === address) {
      balance += price;
    }
  }

  return balance;
}

const getAddressItems = (address: string) => {
  const blockchain = getBlockchain();
  const transactions = getTransactions();

  const items: Items= {
    icon: 0,
    spray: 0,
    pose: 0,
    emote: 0,
    skin: 0,
  };

  // loop over blocks
  for (let i = 1; i < blockchain.length; i++) {
    const { transactions } = blockchain[i];

    if(!transactions) continue;

    // loop over transactions in blockchain
    for (let j = 0; j < transactions.length; j++) {
      const {
        buyerAddress,
        sellerAddress,
        itemBought = null,
        itemSold = null,
      } = transactions[j];

      if (buyerAddress === address && itemBought) {
        items[itemBought] += 1;
      }

      if (sellerAddress === address && itemSold) {
        items[itemSold] -= 1;
      }
    }
  }

  // loop over transaction pool
  for (let i = 0; i < transactions.length; i++) {
    const {
      buyerAddress,
      sellerAddress,
      itemBought = null,
      itemSold = null,
    } = transactions[i];

    if (buyerAddress === address && itemBought) {
      items[itemBought] += 1;
    }

    if (sellerAddress === address && itemSold) {
      items[itemSold] -= 1;
    }
  }

  return items;
}

const _getAddressBalance = getAddressBalance;
export { _getAddressBalance as getAddressBalance };
const _getAddressItems = getAddressItems;
export { _getAddressItems as getAddressItems };