import EC from 'elliptic';
import {
    getAddressItems,
    getItemPrice,
    getTransactions,
    writeTransactions
  } from './blockchain-helpers';
  
  const ec = new EC.ec('p192');
  
  const sellerPrivateKey = process.argv[2];
  const itemSold = process.argv[3];
  const currentTransactions = getTransactions();
  const sellerKeypair = ec.keyFromPrivate(sellerPrivateKey);
  const sellerAddress = sellerKeypair.getPublic('hex');
  const sellersItems = getAddressItems(sellerAddress);
  
  const itemPrice = getItemPrice(itemSold) - 5;
  const signature = sellerKeypair.sign(sellerAddress + itemPrice + itemSold).toDER("hex");
  
  const newTransaction = {
    buyerAddress: null,
    sellerAddress,
    price: itemPrice,
    itemSold,
    signature
  };
  
  if(sellersItems[itemSold]) {
  writeTransactions([...currentTransactions, newTransaction]);
  }