import express from "express";
import bodyParser from "body-parser";
import { generateWallet, initBlockchain, mineBlockchain, transfer } from "./blockchain";
import { getBlockchain, getTransactions, getWallets } from "./blockchain/utils";
import { initPubSub, broadcastChain } from "./pubsub";

const app = express();
generateWallet("default");
initBlockchain();

initPubSub();

const wallets = getWallets();
const minerPrivateKey = wallets.default.privateKey;

setInterval(() => { 
    const transactions = getTransactions();
    if(transactions.length) {
        mineBlockchain(minerPrivateKey);
    }
    const blockchain = getBlockchain();
    broadcastChain(blockchain);
}, 10000);

app.use(bodyParser.json());

app.post("/api/mine", (req, res) => {
    try {
      mineBlockchain(minerPrivateKey);
      const blockchainNew = getBlockchain();
      broadcastChain(blockchainNew);
  
      return res.status(200).send({ success: true, message: "New Block mined" });
    } catch (error) {
      console.error("Block not mined", error);
      return res.status(500).json({
        error: true,
        message: error
      });
    }
  });

app.post("/api/transfer", (req, res) => {
  try {
    const { senderPrivateKey, amount, gasFee, receiverPublicKey } = req.body;

    transfer(senderPrivateKey, amount, gasFee, receiverPublicKey);

    return res.status(200).send({ success: true, message: "Transaction added to the mempool" });
  } catch (error) {
    console.error("Block not mined", error);
    return res.status(500).json({
      error: true,
      message: error
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Listening");
});
