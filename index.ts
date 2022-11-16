import express from "express";
import bodyParser from "body-parser";
import {
  generateWallet,
  initBlockchain,
  mineBlockchain,
  transfer,
} from "./blockchain";
import {
  getBlockchain,
  getTransactions,
  getUnixTimestamp,
  getWallets,
  newUuid,
} from "./blockchain/utils";
import {
  initPubSub,
  broadcastMinedBlock,
  broadcastNewTransaction,
} from "./pubsub";
import { oneMinuteUnix } from "./blockchain/consts";

const app = express();
const newMinerWalletName = newUuid();
generateWallet(newMinerWalletName);
initBlockchain();

initPubSub();

const wallets = getWallets();
const minerPrivateKey = wallets[newMinerWalletName].privateKey;

setInterval(() => {
  const transactions = getTransactions();
  const blockchain = getBlockchain();
  const isTransactionPoolLongEnough = transactions.length > 3;
  const isBlockchainOneMinuteOld =
    getUnixTimestamp() - blockchain[blockchain.length - 1].blockTimestamp >
    oneMinuteUnix;

  if (isTransactionPoolLongEnough || isBlockchainOneMinuteOld) {
    mineBlockchain(minerPrivateKey);
    const transactions = getTransactions();
    const blockchain = getBlockchain();
    broadcastMinedBlock(
      blockchain[blockchain.length - 1],
      blockchain.length,
      transactions
    );
  }
}, 10000);

app.use(bodyParser.json());

app.post("/api/mine", (req, res) => {
  try {
    mineBlockchain(minerPrivateKey);
    const blockchainNew = getBlockchain();
    const currentTransactions = getTransactions();
    broadcastMinedBlock(
      blockchainNew[blockchainNew.length - 1],
      blockchainNew.length,
      currentTransactions
    );

    return res.status(200).send({ success: true, message: "New Block mined" });
  } catch (error) {
    console.error("Block not mined", error);
    return res.status(500).json({
      error: true,
      message: error,
    });
  }
});

app.post("/api/transfer", (req, res) => {
  try {
    const { senderPrivateKey, amount, gasFee, receiverPublicKey } = req.body;

    transfer(senderPrivateKey, amount, gasFee, receiverPublicKey);
    const currentTransactions = getTransactions();
    broadcastNewTransaction(
      currentTransactions[currentTransactions.length - 1]
    );
    return res
      .status(200)
      .send({ success: true, message: "Transaction added to the mempool" });
  } catch (error) {
    console.error("Block not mined", error);
    return res.status(500).json({
      error: true,
      message: error,
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Listening");
});
