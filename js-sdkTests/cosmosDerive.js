import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { pubkeyToAddress } from "@cosmjs/amino";
import secp256k1 from "secp256k1";

// // this code will be run on the node
// const litActionCode = `
// const go = async () => {
//   // this requests a signature share from the Lit Node
//   // the signature share will be automatically returned in the response from the node
//   // and combined into a full signature by the LitJsSdk for you to use on the client
//   // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
//   const sigShare = await LitActions.signEcdsa({ toSign, publicKey, sigName });
// };

// go();
// `;

// // you need an AuthSig to auth with the nodes
// // normally you would obtain an AuthSig by calling LitJsSdk.checkAndSignAuthMessage({chain})
// const authSig = {
//   sig: "0x2bdede6164f56a601fc17a8a78327d28b54e87cf3fa20373fca1d73b804566736d76efe2dd79a4627870a50e66e1a9050ca333b6f98d9415d8bca424980611ca1c",
//   derivedVia: "web3.eth.personal.sign",
//   signedMessage:
//     "localhost wants you to sign in with your Ethereum account:\n0x9D1a5EC58232A894eBFcB5e466E3075b23101B89\n\nThis is a key for Partiful\n\nURI: https://localhost/login\nVersion: 1\nChain ID: 1\nNonce: 1LF00rraLO4f7ZSIt\nIssued At: 2022-06-03T05:59:09.959Z",
//   address: "0x9D1a5EC58232A894eBFcB5e466E3075b23101B89",
// };

const runLitAction = async () => {
  let pubkey =
    "0404e12210c57f81617918a5b783e51b6133790eb28a79f141df22519fb97977d2a681cc047f9f1a9b533df480eb2d816fb36606bd7c716e71a179efd53d2a55d1";
  pubkey = secp256k1.publicKeyConvert(
    LitJsSdk.uint8arrayFromString(pubkey, "base16"),
    true
  );
  console.log(
    "compressed pubkey: ",
    LitJsSdk.uint8arrayToString(pubkey, "base16")
  );
  pubkey = LitJsSdk.uint8arrayToString(pubkey, "base64");
  console.log("pubkey base64: ", pubkey);

  pubkey = {
    type: "tendermint/PubKeySecp256k1",
    value: pubkey, //"A08EGB7ro1ORuFhjOnZcSgwYlpe0DSFjVNUIkNNQxwKQ",
  };

  const addressChainA = pubkeyToAddress(pubkey, "achain");
  console.log("addressChainA: ", addressChainA);
  // const litNodeClient = new LitJsSdk.LitNodeClient({
  //   alertWhenUnauthorized: false,
  //   litNetwork: "serrano",
  //   debug: true,
  // });
  // await litNodeClient.connect();
  // const results = await litNodeClient.executeJs({
  //   code: litActionCode,
  //   authSig,
  //   // all jsParams can be used anywhere in your litActionCode
  //   jsParams: {
  //     // this is the string "Hello World" for testing
  //     toSign: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100],
  //     publicKey:
  //       "0x0404e12210c57f81617918a5b783e51b6133790eb28a79f141df22519fb97977d2a681cc047f9f1a9b533df480eb2d816fb36606bd7c716e71a179efd53d2a55d1",
  //     sigName: "sig1",
  //   },
  // });
  // console.log("results: ", results);
};

runLitAction();
