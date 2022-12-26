import LitJsSdk from "lit-js-sdk/build/index.node.js";
import fs from "fs";
import { serialize, recoverAddress } from "@ethersproject/transactions";
import {
  hexlify,
  splitSignature,
  hexZeroPad,
  joinSignature,
} from "@ethersproject/bytes";
import { recoverPublicKey, computePublicKey } from "@ethersproject/signing-key";

// this code will be run on the node
const litActionCode = fs.readFileSync("./build/signTxnTest.js");

// you need an AuthSig to auth with the nodes
// normally you would obtain an AuthSig by calling LitJsSdk.checkAndSignAuthMessage({chain})
// NOTE: to replace with a new one that you get from oauth-pkp-signup-example
const authSig = {
  "sig": "0xe5e1d290ed645fd45d558dc8de176fc808dffb4bdc1c1c24e1cdc15f38f30a72251ef9c1e48bfd95568818d97894aff5ae1e2cc9da30c317e54262074f21823b1b",
  "derivedVia": "web3.eth.personal.sign via Lit PKP",
  "signedMessage": "localhost:3000 wants you to sign in with your Ethereum account:\n0x2a5A2A9558118388e8f4bd1e1c32ac520CA7D0F4\n\nLit Protocol PKP session signature\n\nURI: lit:session:9e0525c8caa0e70f85b829677f5abab27ae70344679ab67d9eda90c10b3160e2\nVersion: 1\nChain ID: 1\nNonce: 9OtojzBuln2qoTiH2\nIssued At: 2022-12-26T00:46:24.514Z\nExpiration Time: 2024-12-25T00:46:23.433Z\nResources:\n- urn:recap:lit:session:eyJkZWYiOlsibGl0RW5jcnlwdGlvbkNvbmRpdGlvbiJdfQ==",
  "address": "0x2a5A2A9558118388e8f4bd1e1c32ac520CA7D0F4"
};

const go = async () => {
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    minNodeCount: 6,
    debug: true,
    litNetwork: "serrano",
  });
  await litNodeClient.connect();
  const results = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    jsParams: {},
  });
  console.log("results", results);
  const { signatures, response } = results;
  console.log("response", response);
  const sig = signatures.sig1;
  const { dataSigned } = sig;
  const encodedSig = joinSignature({
    r: "0x" + sig.r,
    s: "0x" + sig.s,
    v: sig.recid,
  });

  const { txParams } = response;

  console.log("encodedSig", encodedSig);
  console.log("sig length in bytes: ", encodedSig.substring(2).length / 2);
  console.log("dataSigned", dataSigned);
  const splitSig = splitSignature(encodedSig);
  console.log("splitSig", splitSig);

  const recoveredPubkey = recoverPublicKey(dataSigned, encodedSig);
  console.log("uncompressed recoveredPubkey", recoveredPubkey);
  const compressedRecoveredPubkey = computePublicKey(recoveredPubkey, true);
  console.log("compressed recoveredPubkey", compressedRecoveredPubkey);
  const recoveredAddress = recoverAddress(dataSigned, encodedSig);
  console.log("recoveredAddress", recoveredAddress);

  const txn = serialize(txParams, encodedSig);

  console.log("txn", txn);
};

go();
