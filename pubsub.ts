import * as redis from "redis";
import { Block } from "./blockchain/types";

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
};

export const initPubSub = async (blockchain: Block[]) => {
  const publisher = redis.createClient();
  const subscriber = redis.createClient();

  subscriber.subscribe(CHANNELS.TEST, (channel, message) => {
    console.log(`Message received. Channel: ${channel}. Message: ${message}.`);
  });

  await publisher.connect();
  await subscriber.connect();

  publisher.publish(CHANNELS.TEST, "testMessage");
};
