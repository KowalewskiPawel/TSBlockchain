import { getAddressBalance, getWalletAddressFromName } from "./utils";

(() => {
  try {
  const nameOfAddress = process.argv[2];

  const address = getWalletAddressFromName(nameOfAddress);
  if (address instanceof Error) return;
  const addressBalance = getAddressBalance(address);

  console.log(`\nThe public address for ${nameOfAddress} is: ${address}`);
  console.log(`${nameOfAddress} has a balance of ${addressBalance}`);
  } catch ({ message }) {
    console.error(message);
  }
})();