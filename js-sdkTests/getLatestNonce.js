import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { getAuthSig } from "../utils.js";

// this code will be run on the node
const litActionCode = `
const go = async () => {
  const latestNonce = await Lit.Actions.getLatestNonce({ address, chain });
  Lit.Actions.setResponse({response: JSON.stringify({latestNonce})});
};

go();
`;

const runLitAction = async () => {
  const authSig = await getAuthSig();
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: "cayenne",
    debug: true,
  });
  await litNodeClient.connect();
  const results = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      chain: "ethereum",
    },
  });
  console.log("results: ", results);
};

runLitAction();
