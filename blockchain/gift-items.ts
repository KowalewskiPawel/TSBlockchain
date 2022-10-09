import {
    getRandomItem,
    getWallets,
    getTransactions,
    writeTransactions
  } from './blockchain-helpers';
  
  const transactions = getTransactions();
  const wallets = getWallets();
  
  Object.keys(wallets).forEach(walletName => {
    const randomItem = getRandomItem();
    const giftTransaction = {
      sellerAddress: null,
      buyerAddress: wallets[walletName].publicKey,
      itemBought: randomItem
    };
  
    transactions.push(giftTransaction);
  });
  
  writeTransactions(transactions);