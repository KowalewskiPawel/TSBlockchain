import sha256 from 'crypto-js/sha256';
import {
    getBlockchain,
    getTransactions,
    writeBlockchain,
    writeTransactions,
    ec,
    getAddressBalance
  } from './utils';
import { BLOCK_REWARD, GENESIS_ADDRESS, ZEROS } from "./consts";
import { Block, Transaction } from './types';

export const mineBlockchain = (minerPrivateKey: string) => {
  
  const currentBlockchain = getBlockchain();
  const listOfTransactions = [...getTransactions()];
  const previousHash = currentBlockchain[currentBlockchain.length-1].hash;
  let newHash = "";
  let nonce = 0;
  
  const minerKeypair = ec.keyFromPrivate(minerPrivateKey);
  const minerAddress = minerKeypair.getPublic('hex');

  const isSupplyAvailable = getAddressBalance(GENESIS_ADDRESS) > BLOCK_REWARD;

  const blockRewardTransaction = {
    senderAddress: GENESIS_ADDRESS,
    receiverAddress: minerAddress,
    amount: BLOCK_REWARD,
  };

  if(isSupplyAvailable) listOfTransactions.push(blockRewardTransaction);

  listOfTransactions.forEach(({ gasFee, senderAddress }: Transaction) => {
     if(gasFee) {
      listOfTransactions.push({
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
  const newBlock: Block = {
    hash: newHash,
    previousHash,
    nonce,
    transactions: listOfTransactions
  };
  
  writeBlockchain([...currentBlockchain, newBlock]);
  writeTransactions([]);
}