const sigName = "sig1";
let txn = {
  to: "0x1234",
  value: 1000000000000000,
  gas: 21000,
  gasPrice: 20000000000,
  nonce: 0,
};
const toSign = serializeTxnForSigning(txn);
const signature = await Lit.Actions.signAndCombineEcdsa({
  toSign,
  publicKey,
  sigName,
});

// this specific block of code should be abstracted away with something like "Lit.Actions.sendTxnOnce()"
await Lit.Actions.runOnce({ waitForResponse: false, name: "txnSender" }, () => {
  // the code in the block will only be run once
  const signedTxn = serializeTxnForSending(txn, sigShare);
  Lit.Actions.sendTxn({ chain: "ethereum", signedTxn });
});
