import {
    getAddressBalance,
    getWalletAddressFromName
  } from './utils';
  
  const nameOfAddress = process.argv[2];
  
  const address = getWalletAddressFromName(nameOfAddress);
  const addressBalance = getAddressBalance(address);
  
  console.log(`\nThe public address for ${nameOfAddress} is: ${address}`);
  console.log(
    `${nameOfAddress} has a balance of ${addressBalance}`);