import express from "express";
import bodyParser from "body-parser";
import { generateWallet, initBlockchain, mineBlockchain } from "./blockchain";
import { getBlockchain, getWallets } from "./blockchain/utils";
import { initPubSub, broadcastChain } from "./pubsub";

const app = express();
generateWallet("default");
initBlockchain();

initPubSub();
setInterval(() => { 
    const blockchain = getBlockchain();
    broadcastChain(blockchain);
}, 10000);


const wallets = getWallets();
const minerPrivateKey = wallets.default.privateKey;

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

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Listening");
});
