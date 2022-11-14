import express from 'express';
import bodyParser from "body-parser";
import { initBlockchain } from './blockchain';
import { getBlockchain } from './blockchain/utils';
import { initPubSub, broadcastChain } from './pubsub';

const app = express();
initBlockchain();
const blockchain = getBlockchain();
initPubSub();
setTimeout(() => broadcastChain(blockchain), 1000);


app.use(bodyParser.json());

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Listening");
});