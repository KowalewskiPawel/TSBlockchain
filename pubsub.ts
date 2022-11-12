import * as redis from "redis";

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
};

const publisher = redis.createClient();
const subscriber = redis.createClient();

subscriber.subscribe(CHANNELS.TEST, (channel, message) => {
  console.log(`Message received. Channel: ${channel}. Message: ${message}.`);
});

const connectClients = async () => {
    await publisher.connect();
    await subscriber.connect();
  };
  connectClients();

publisher.publish(CHANNELS.TEST, "testMessage");
