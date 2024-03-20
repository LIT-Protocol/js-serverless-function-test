const toSign = await Lit.Actions.decryptAndCombine({
  accessControlConditions,
  ciphertext,
  dataToEncryptHash,
  authSig,
  chain: "ethereum",
});
const signature = await Lit.Actions.signAndCombineEcdsa({
  toSign,
  publicKey,
  sigName,
});
await Lit.Actions.runOnce({ waitForResponse: false, name: "txnSender" }, () => {
  // the code in the block will only be run once
  const signedTxn = serializeTxnForSending(toSign, signature);
  Lit.Actions.sendTxn({ chain: "ethereum", signedTxn });
});
