import {
    getAddressBalance,
    getTransactions,
    writeTransactions,
    ec
  } from './utils';
  
  const senderPrivateKey = process.argv[2];
  const amount = Number(process.argv[3]);
  const receiverPublicKey = process.argv[4];
  const currentTransactions = getTransactions();
  
  const senderKeypair = ec.keyFromPrivate(senderPrivateKey);
  const senderAddress = senderKeypair.getPublic('hex');
  
  const signature = senderKeypair.sign(senderAddress + amount).toDER("hex");
  
  const transaction = {
    senderAddress,
    receiverAddress: receiverPublicKey,
    amount,
    signature
  };
  
  const isBalanceEnough = getAddressBalance(senderAddress) >= amount;
  
  if(!isBalanceEnough) throw Error("Not enough tokens!");
  
  writeTransactions([...currentTransactions, transaction]);
  