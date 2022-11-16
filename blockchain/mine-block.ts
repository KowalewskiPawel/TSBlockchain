import sha256 from 'crypto-js/sha256';
import {
    getBlockchain,
    getTransactions,
    writeBlockchain,
    writeTransactions,
    ec,
    getAddressBalance,
    getUnixTimestamp,
    newUuid
  } from './utils';
import { BLOCK_REWARD, GENESIS_ADDRESS, ZEROS } from "./consts";
import { Block, Transaction } from './types';

export const mineBlockchain = (minerPrivateKey: string) => {
  
  const currentBlockchain = getBlockchain();
  const currentTransactions = getTransactions();
  const listOfTransactions: Transaction[] = [];
  for (let i = 0; i < 3; i++) {
    if(currentTransactions[i]) {
      listOfTransactions.push(currentTransactions[i]);
    }
  }
  const previousHash = currentBlockchain[currentBlockchain.length-1].hash;
  let newHash = "";
  let nonce = 0;
  
  const minerKeypair = ec.keyFromPrivate(minerPrivateKey);
  const minerAddress = minerKeypair.getPublic('hex');

  const isSupplyAvailable = getAddressBalance(GENESIS_ADDRESS) > BLOCK_REWARD;

  const blockRewardTransaction: Transaction = {
    transactionId: newUuid(),
    transactionTimestamp: getUnixTimestamp(),
    senderAddress: GENESIS_ADDRESS,
    receiverAddress: minerAddress,
    amount: BLOCK_REWARD,
  };

  if(isSupplyAvailable) listOfTransactions.push(blockRewardTransaction);

  listOfTransactions.forEach(({ gasFee, senderAddress }: Transaction) => {
     if(gasFee) {
      listOfTransactions.push({
        transactionId: newUuid(),
        transactionTimestamp: getUnixTimestamp(),
        senderAddress,
        receiverAddress: minerAddress,
        amount: gasFee 
      })
    }
  });

  while(newHash.substring(0,2) !== ZEROS) {
    nonce++;
    newHash = sha256(nonce + String(previousHash) + JSON.stringify(listOfTransactions)).toString();
  }

  const lastBlockNumber = currentBlockchain[currentBlockchain.length-1].blockNumber + 1;

  const newBlock: Block = {
    blockNumber: lastBlockNumber,
    blockTimestamp: getUnixTimestamp(),
    hash: newHash,
    previousHash,
    nonce,
    transactions: listOfTransactions
  };
  
  writeBlockchain([...currentBlockchain, newBlock]);
  if(currentTransactions.length > 3) {
    const transactionsLeft = currentTransactions.slice(3);
    writeTransactions(transactionsLeft);
  } else {
  writeTransactions([]);
  }
}