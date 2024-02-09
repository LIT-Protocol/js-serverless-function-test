import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { getAuthSig } from "../utils.js";

// this code will be run on the node
const litActionCode = `
const go = async () => {
  const val = ethers.utils.formatEther(10000)
  LitActions.setResponse({response: JSON.stringify({val})})
};

go();
`;

const go = async () => {
  const authSig = await getAuthSig();
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    minNodeCount: 6,
    debug: true,
    litNetwork: "cayenne"
  });
  await litNodeClient.connect();
  const results = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    jsParams: {},
  });

  console.log("results: ", results);
};

go();
