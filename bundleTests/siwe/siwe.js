import LitJsSdk from "lit-js-sdk/build/index.node.js";
import fs from "fs";
import { recoverAddress } from "@ethersproject/transactions";
import { verifyMessage } from "@ethersproject/wallet";
import { recoverPublicKey } from "@ethersproject/signing-key";
import { joinSignature } from "@ethersproject/bytes";

// this code will be run on the node
const litActionCode = fs.readFileSync("./bundled.js");

// you need an AuthSig to auth with the nodes
// normally you would obtain an AuthSig by calling LitJsSdk.checkAndSignAuthMessage({chain})
const authSig = {
  sig: "0x2bdede6164f56a601fc17a8a78327d28b54e87cf3fa20373fca1d73b804566736d76efe2dd79a4627870a50e66e1a9050ca333b6f98d9415d8bca424980611ca1c",
  derivedVia: "web3.eth.personal.sign",
  signedMessage:
    "localhost wants you to sign in with your Ethereum account:\n0x9D1a5EC58232A894eBFcB5e466E3075b23101B89\n\nThis is a key for Partiful\n\nURI: https://localhost/login\nVersion: 1\nChain ID: 1\nNonce: 1LF00rraLO4f7ZSIt\nIssued At: 2022-06-03T05:59:09.959Z",
  address: "0x9D1a5EC58232A894eBFcB5e466E3075b23101B89",
};

const runLitAction = async () => {
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: "localhost",
    debug: true,
  });
  await litNodeClient.connect();
  const results = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      // this is the string "Hello World" for testing
      publicKey:
        "0x04478d4d175f0f3e310f431224e169329be740db68f8bc224d2b57c3c6fc0e69671b233f570cd452b03431e40e5deac2780b7b68c00536bd7948c2c5de982542a3",
      nonce: "dAmR9aiDBfGKzwplX",
      issuedAt: new Date().toISOString(),
    },
  });
  console.log("results: ", results);
  const sig = results.signatures.siweSig.signature;
  const publicKey = results.signatures.siweSig.publicKey;
  const dataSigned = results.signatures.siweSig.dataSigned;
  const resp = results.response;
  const { toSign, ethAddress } = resp;

  const encodedSig = joinSignature({
    r: "0x" + results.signatures.siweSig.r,
    s: "0x" + results.signatures.siweSig.s,
    v: results.signatures.siweSig.recid,
  });
  console.log("encodedSig", encodedSig);
  console.log("encoded sig matches sig from nodes: ", encodedSig === sig);

  const recoveredPubkey = recoverPublicKey(dataSigned, sig);
  console.log("uncompressed recoveredPubkey", recoveredPubkey);
  console.log(
    "recoveredPubkey matches publicKey: ",
    recoveredPubkey === publicKey
  );

  const recoveredAddress = recoverAddress(dataSigned, sig);
  console.log("recoveredAddress", recoveredAddress);
  console.log(
    "recoveredAddress matches ethAddress: ",
    recoveredAddress === ethAddress
  );

  const recoveredAddressViaMessage = verifyMessage(toSign, sig);
  console.log("recoveredAddressViaMessage", recoveredAddressViaMessage);
  console.log(
    "recoveredAddressViaMessage matches ethAddress: ",
    recoveredAddressViaMessage === ethAddress
  );
};

runLitAction();
