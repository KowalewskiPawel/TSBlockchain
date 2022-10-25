import sha256 from 'crypto-js/sha256';
import {
    getBlockchain,
    getTransactions,
    writeBlockchain,
    writeTransactions
  } from './utils/blockchain-helpers';
import { ZEROS } from "./consts";
import { Block } from './types';
  
  const currentBlockchain = getBlockchain();
  const currentTransactions = getTransactions();
  const previousHash = currentBlockchain[currentBlockchain.length-1].hash;
  let newHash = "";
  let nonce = 0;
  
  while(newHash.substring(0,2) !== ZEROS) {
    nonce++;
    newHash = sha256(nonce + String(previousHash) + JSON.stringify(currentTransactions)).toString();
  }
  const newBlock: Block = {
    hash: newHash,
    previousHash,
    nonce,
    transactions: currentTransactions
  };
  
  writeBlockchain([...currentBlockchain, newBlock]);
  writeTransactions([]);