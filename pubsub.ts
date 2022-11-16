import * as redis from "redis";
import { Block, Transaction } from "./blockchain/types";
import {
  writeBlockchain,
  getBlockchain,
  getTransactions,
  writeTransactions,
  verifySignature,
} from "./blockchain/utils";

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
  TRANSACTION: "TRANSACTION",
  SYNCREQ: "SYNCREQ",
  SYNCRES: "SYNCRES",
};

const publisher = redis.createClient();
const subscriber = redis.createClient();

const syncBlockchain = (message: string) => {
  const currentBlockchain = getBlockchain();
  const currentTransactions = getTransactions();
  const { blockchain, transactions } = JSON.parse(message);
  if (blockchain.length > currentBlockchain.length) {
    writeBlockchain(blockchain);
  }
  if (transactions.length > currentTransactions.length) {
    writeTransactions(transactions);
  }
};

const addBlock = (message: string) => {
  const parsedBlock = JSON.parse(message);
  const currentBlockchain = getBlockchain();
  const isLastBlockNumberValid =
    currentBlockchain[currentBlockchain.length - 1].blockNumber ===
    parsedBlock.lastBlock.blockNumber - 1;
  const isBlockchainLonger =
    parsedBlock.blockchainLength > currentBlockchain.length;
  const isLastHashValid =
    currentBlockchain.at(-1)?.hash === parsedBlock.lastBlock.previousHash;
  if (isBlockchainLonger && isLastHashValid && isLastBlockNumberValid) {
    console.log(`New block added: ${parsedBlock}.`);
    writeBlockchain([...currentBlockchain, parsedBlock.lastBlock]);
    writeTransactions(parsedBlock.transactions);
  }
};

const addTransaction = (message: string) => {
  const parsedTransaction = JSON.parse(message);
  const { publicKey, amount, gasFee, signature } = parsedTransaction;
  const isTransactionValid = verifySignature(
    publicKey,
    amount,
    gasFee,
    signature
  );
  if (isTransactionValid) {
    const currentTransactions = getTransactions();
    const newTransactions = [...currentTransactions, parsedTransaction].sort(
      (transactionA, transactionB) => transactionA.gasFee - transactionB.gasFee
    );
    writeTransactions(newTransactions);
  }
};

const handleMessage = (channel: string, message: string) => {
  switch (channel) {
    case CHANNELS.SYNCREQ:
      broadcastChain();
      break;
    case CHANNELS.SYNCRES:
      syncBlockchain(message);
      break;
    case CHANNELS.BLOCKCHAIN:
      addBlock(message);
      break;
    case CHANNELS.TRANSACTION:
      addTransaction(message);
      break;
    default:
      break;
  }
};

export const broadcastChain = () => {
  const currentBlockchain = getBlockchain();
  const currentTransactions = getTransactions();
  publisher.publish(
    CHANNELS.SYNCRES,
    JSON.stringify({
      blockchain: currentBlockchain,
      transactions: currentTransactions,
    })
  );
};

export const broadcastMinedBlock = (
  lastBlock: Block,
  blockchainLength: number,
  transactions: Transaction[]
) => {
  publisher.publish(
    CHANNELS.BLOCKCHAIN,
    JSON.stringify({ lastBlock, blockchainLength, transactions })
  );
};

export const broadcastNewTransaction = (transaction: Transaction) => {
  publisher.publish(CHANNELS.TRANSACTION, JSON.stringify(transaction));
};

export const syncChainRequest = () => {
  publisher.publish(CHANNELS.SYNCREQ, "Sync Request");
};

export const initPubSub = async () => {
  subscriber.subscribe([...Object.values(CHANNELS)], (channel, message) =>
    handleMessage(message, channel)
  );

  await publisher.connect();
  await subscriber.connect();

  publisher.publish(CHANNELS.TEST, "testMessage");
};
