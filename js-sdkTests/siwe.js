import * as LitJsSdk from "@lit-protocol/lit-node-client";
import fs from "fs";
import {
  serialize,
  recoverAddress,
  computeAddress,
} from "@ethersproject/transactions";
import {
  hexlify,
  splitSignature,
  hexZeroPad,
  joinSignature,
} from "@ethersproject/bytes";
import { recoverPublicKey, computePublicKey } from "@ethersproject/signing-key";
import { verifyMessage } from "@ethersproject/wallet";
import { SiweMessage } from "siwe";

// this code will be run on the node
const litActionCode = `
const go = async () => {  
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
  const sigShare = await LitActions.ethPersonalSignMessageEcdsa({ message, publicKey , sigName });
};

go();
`;

// you need an AuthSig to auth with the nodes
// normally you would obtain an AuthSig by calling LitJsSdk.checkAndSignAuthMessage({chain})
const authSig = {
  sig: "0x2bdede6164f56a601fc17a8a78327d28b54e87cf3fa20373fca1d73b804566736d76efe2dd79a4627870a50e66e1a9050ca333b6f98d9415d8bca424980611ca1c",
  derivedVia: "web3.eth.personal.sign",
  signedMessage:
    "localhost wants you to sign in with your Ethereum account:\n0x9D1a5EC58232A894eBFcB5e466E3075b23101B89\n\nThis is a key for Partiful\n\nURI: https://localhost/login\nVersion: 1\nChain ID: 1\nNonce: 1LF00rraLO4f7ZSIt\nIssued At: 2022-06-03T05:59:09.959Z",
  address: "0x9D1a5EC58232A894eBFcB5e466E3075b23101B89",
};

function createSiweMessage(address, statement) {
  const domain = "localhost:3000";
  const origin = "http://localhost:3000";
  const message = new SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: "1",
    chainId: "1",
  });
  return message.prepareMessage();
}

const go = async () => {
  const publicKey =
    "0x046b843beba8b6b6b2f9e3673d33e1b1dbd6f9a846e0b4e3c9f0a3f9e315c34b6f6f23650755227bb99aca0468e6bbd1d2e5cd3921f15690f96f5580a38b0847ff";
  const ethAddress = computeAddress(publicKey);
  const message = createSiweMessage(ethAddress, "Sign in with a PKP");
  const litNodeClient = new LitJsSdk.LitNodeClient({
    litNetwork: "serrano",
  });
  await litNodeClient.connect();
  const result = await litNodeClient.executeJs({
    code: litActionCode,
    jsParams: {
      // this is the string "Hello World" for testing
      message,
      publicKey,
      sigName: "sig1",
    },
    authSig,
  });
  const signatures = result.signatures;
  console.log("signatures: ", signatures);
  const sig = signatures.sig1;
  const dataSigned = sig.dataSigned;
  const encodedSig = joinSignature({
    r: "0x" + sig.r,
    s: "0x" + sig.s,
    v: sig.recid,
  });
  const encodedSigFromNodes = sig.signature;

  console.log("encodedSig", encodedSig);
  console.log(
    "encodedSig == encodedSigFromNodes",
    encodedSig == encodedSigFromNodes
  );

  const recoveredPubkey = recoverPublicKey(dataSigned, encodedSig);
  console.log("uncompressed recoveredPubkey", recoveredPubkey);
  console.log("recoveredPublicKey == publicKey", recoveredPubkey === publicKey);

  const recoveredAddress = recoverAddress(dataSigned, encodedSig);
  console.log("recoveredAddress", recoveredAddress);
  console.log(
    "recoveredAddress == ethAddress",
    recoveredAddress === ethAddress
  );

  const recoveredAddressViaMessage = verifyMessage(message, encodedSig);
  console.log("recoveredAddressViaMessage", recoveredAddressViaMessage);
  console.log(
    "recoverAddressViaMessage == ethAddress",
    recoveredAddressViaMessage === ethAddress
  );

  const finalAuthSig = {
    sig: sig.signature,
    derivedVia: "web3.eth.personal.sign",
    signedMessage: message,
    address: ethAddress,
  };

  console.log("Final Auth Sig signed by PKP: ", finalAuthSig);
};

go();
