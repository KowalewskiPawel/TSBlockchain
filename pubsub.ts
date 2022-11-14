import * as redis from "redis";
import { Block } from "./blockchain/types";
import { writeBlockchain } from "./blockchain/utils";

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
};

const publisher = redis.createClient();
const subscriber = redis.createClient();

const handleMessage = (channel: string, message: string) => {
    console.log(`Message received. Channel: ${channel}. Message: ${message}.`);

    if (channel === CHANNELS.BLOCKCHAIN) {
      const parsedMessage = JSON.parse(message);
      writeBlockchain(parsedMessage);
    }
};

export const broadcastChain = (blockchain: Block[]) => {
    publisher.publish(CHANNELS.BLOCKCHAIN, JSON.stringify(blockchain));
};

export const initPubSub = async () => {
  subscriber.subscribe([...Object.values(CHANNELS)], (channel, message) => handleMessage(channel, message));

  await publisher.connect();
  await subscriber.connect();

  publisher.publish(CHANNELS.TEST, "testMessage");
};
