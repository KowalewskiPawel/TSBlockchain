import { MINIMUM_GAS_FEE } from './consts';
import {
    getAddressBalance,
    getTransactions,
    writeTransactions,
    ec
  } from './utils';
  
  const senderPrivateKey = process.argv[2];
  const amount = Number(process.argv[3]);
  const gasFee = Number(process.argv[4]);

  if(!gasFee || gasFee < MINIMUM_GAS_FEE) throw Error("Gas fee is too low");

  const receiverPublicKey = process.argv[5];
  const currentTransactions = getTransactions();
  
  const senderKeypair = ec.keyFromPrivate(senderPrivateKey);
  const senderAddress = senderKeypair.getPublic('hex');
  
  const signature = senderKeypair.sign(senderAddress + amount).toDER("hex");
  
  const transaction = {
    senderAddress,
    receiverAddress: receiverPublicKey,
    amount,
    gasFee,
    signature
  };
  
  const isBalanceEnough = getAddressBalance(senderAddress) >= (amount + gasFee);
  
  if(!isBalanceEnough) throw Error("Not enough tokens!");
  
  writeTransactions([...currentTransactions, transaction]);
  