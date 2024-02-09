import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { serialize, recoverAddress } from "@ethersproject/transactions";
import { splitSignature, joinSignature, arrayify } from "@ethersproject/bytes";
import { Wallet, verifyMessage } from "@ethersproject/wallet";
import { recoverPublicKey, computePublicKey } from "@ethersproject/signing-key";
import { ethers } from "ethers";
import * as siwe from "siwe";
import * as fs from 'fs';
import { getAuthSig, getPkp } from "../utils.js";

// this code will be run on the node
let litActionCode = fs.readFileSync("./build/signTxnTest.js");
litActionCode = litActionCode.toString("ascii");

// this code will be run on the node
const go = async () => {
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    debug: true,
    litNetwork: "cayenne",
  });
  await litNodeClient.connect();

  // you need an AuthSig to auth with the nodes
  // normally you would obtain an AuthSig by calling LitJsSdk.checkAndSignAuthMessage({chain})
  // NOTE: to replace with a new one that you get from oauth-pkp-signup-example
  const authSig = await getAuthSig();

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
  let dataSginedBytes = arrayify("0x" + dataSigned);
  const splitSig = splitSignature(encodedSig);
  console.log("splitSig", splitSig);

  const recoveredPubkey = recoverPublicKey(dataSginedBytes, encodedSig);
  console.log("uncompressed recoveredPubkey", recoveredPubkey);

  const compressedRecoveredPubkey = computePublicKey(recoveredPubkey, true);
  console.log("compressed recoveredPubkey", compressedRecoveredPubkey);
  const recoveredAddress = recoverAddress(dataSginedBytes, encodedSig);
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
