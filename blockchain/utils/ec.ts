import EC from "elliptic";

export const ec = new EC.ec("p192");

export const verifySignature = (publicKey, amount, gasFee, signature) => {
  const keyFromPublic = ec.keyFromPublic(publicKey, "hex");

  return keyFromPublic.verify(publicKey + amount + gasFee, signature);
};
