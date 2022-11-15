import * as redis from "redis";
import { Block } from "./blockchain/types";
import { writeBlockchain, getBlockchain } from "./blockchain/utils";

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
  TRANSACTION: "TRANSACTION",
};

const publisher = redis.createClient();
const subscriber = redis.createClient();

const handleMessage = (channel: string, message: string) => {
  if (channel === CHANNELS.BLOCKCHAIN) {
    const parsedBlockchain = JSON.parse(message);
    const currentBlockchain = getBlockchain();
    if (parsedBlockchain.length > currentBlockchain.length) {
      console.log(
        `Message received. Channel: ${channel}. Message: ${message}.`
      );
      writeBlockchain(parsedBlockchain);
    }
  }
};

export const broadcastChain = (blockchain: Block[]) => {
  publisher.publish(CHANNELS.BLOCKCHAIN, JSON.stringify(blockchain));
};

export const initPubSub = async () => {
  subscriber.subscribe([...Object.values(CHANNELS)], (channel, message) =>
    handleMessage(message, channel)
  );

  await publisher.connect();
  await subscriber.connect();

  publisher.publish(CHANNELS.TEST, "testMessage");
};
