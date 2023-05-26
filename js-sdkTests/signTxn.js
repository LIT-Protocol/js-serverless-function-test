import * as LitJsSdk from "@lit-protocol/lit-node-client";
import fs from "fs";
import { serialize, recoverAddress } from "@ethersproject/transactions";
import {
  hexlify,
  splitSignature,
  hexZeroPad,
  joinSignature,
} from "@ethersproject/bytes";
import { recoverPublicKey, computePublicKey } from "@ethersproject/signing-key";
import { ethers } from "ethers";

// this code will be run on the node
const litActionCode = fs.readFileSync("./build/signTxnTest.js");

// you need an AuthSig to auth with the nodes
// normally you would obtain an AuthSig by calling LitJsSdk.checkAndSignAuthMessage({chain})
// NOTE: to replace with a new one that you get from oauth-pkp-signup-example
const authSig = {
  "sig": "0xaa22e352e4f8e8b6b22aff48c64a10c7fc45d523c09407a32fe80009fc7b365d3a1f3c61a80530e244dd08f1566297d6573d1f114e0ec89da3bcecbc519c53c31c",
  "derivedVia": "web3.eth.personal.sign via Lit PKP",
  "signedMessage": "localhost:3000 wants you to sign in with your Ethereum account:\n0x239e847590EB7F553487F2bC45160a73F3532d30\n\nLit Protocol PKP session signature I further authorize the stated URI to perform the following actions on my behalf: (1) '*': '*' for 'lit-accesscontrolcondition://3e40cf872fbf8486085d979ef5cf5021ffa6afa1b380cab32f2050c16fa4cf9a'.\n\nURI: lit:session:c121360f27436ac0b62a51ebb63339b9bd222a5d2a23dc72a0cde5683eb8ad8f\nVersion: 1\nChain ID: 1\nNonce: qlEHZMqnfbFfwoDdt\nIssued At: 2023-05-26T03:38:56.386Z\nExpiration Time: 2023-05-27T03:38:56.233Z\nResources:\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8zZTQwY2Y4NzJmYmY4NDg2MDg1ZDk3OWVmNWNmNTAyMWZmYTZhZmExYjM4MGNhYjMyZjIwNTBjMTZmYTRjZjlhIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ",
  "address": "0x239e847590EB7F553487F2bC45160a73F3532d30"
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

  // broadcast txn
  const provider = new ethers.providers.JsonRpcProvider(
    // process.env.LIT_MUMBAI_RPC_URL
    "https://rpc.ankr.com/polygon_mumbai"
  );
  const result = await provider.sendTransaction(txn);
  console.log("broadcast txn result:", JSON.stringify(result, null, 4));
};

go();
