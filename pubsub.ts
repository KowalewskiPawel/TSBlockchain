import * as redis from "redis";
import { Block } from "./blockchain/types";
import { writeBlockchain } from "./blockchain/utils";

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
};

const handleMessage = (channel, message) => {
    console.log(`Message received. Channel: ${channel}. Message: ${message}.`);
    const parsedMessage = JSON.parse(message);

    if (channel === CHANNELS.BLOCKCHAIN) {
      writeBlockchain(parsedMessage);
    }
};

const publish = (publisher: any, { channel, message}) => {
    publisher.publish(channel, message);
  }

export const broadcastChain = () => {
    publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(blockchain)
    });
  }

export const initPubSub = async (blockchain: Block[]) => {
  const publisher = redis.createClient();
  const subscriber = redis.createClient();

  subscriber.subscribe([...Object.values(CHANNELS)], (channel, message) => handleMessage(channel, message));

  await publisher.connect();
  await subscriber.connect();

  publisher.publish(CHANNELS.TEST, "testMessage");
};
