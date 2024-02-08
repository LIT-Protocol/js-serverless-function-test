import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { getAuthSig, getPkp } from "../utils.js";

// this code will be run on the node
const litActionCode = `
const go = async () => {
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the response from the node
  // and combined into a full signature by the LitJsSdk for you to use on the client
  // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
  const sigShare = await LitActions.signEcdsa({ toSign, publicKey, sigName });

  console.log('finished signing!  this is a log statement that will show up in the response under the logs key');

  // you can return anything else extra you want in the response
  const response = JSON.stringify({ signed: "true" });
  LitActions.setResponse({ response });
};

console.log('Running go()');
go();
`;

const runLitAction = async () => {
  const authSig = await getAuthSig();
  const publicKey = await getPkp();
  const litNodeClient = new LitJsSdk.LitNodeClient({
    litNetwork: "cayenne",
  });
  await litNodeClient.connect();
  const results = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      // this is the string "Hello World" for testing
      toSign: [65, 208, 164, 167, 229, 220, 187, 13, 166, 2, 199, 95, 102, 221, 126, 115, 126, 3, 246, 254, 177, 16, 113, 222, 120, 95, 209, 63, 254, 29, 52, 240],
      publicKey,
      sigName: "sig1",
    },
  });
  console.log("results: ", results);
};

runLitAction();
