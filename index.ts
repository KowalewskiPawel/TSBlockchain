import express from 'express';
import bodyParser from "body-parser";
import { initBlockchain } from './blockchain';
import { getBlockchain } from './blockchain/utils';
import { initPubSub } from './pubsub';

const app = express();
initBlockchain();
const blockchain = getBlockchain();
initPubSub(blockchain);


app.use(bodyParser.json());

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Listening");
});