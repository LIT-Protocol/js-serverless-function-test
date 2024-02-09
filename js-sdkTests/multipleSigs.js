import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { getAuthSig, getPkp } from "../utils.js";

// this code will be run on the node
const litActionCode = `
const go = async () => {  
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
  const sigShare1 = await LitActions.signEcdsa({ toSign: [65, 208, 164, 167, 229, 220, 187, 13, 166, 2, 199, 95, 102, 221, 126, 115, 126, 3, 246, 254, 177, 16, 113, 222, 120, 95, 209, 63, 254, 29, 52, 240], publicKey, sigName: "sig1" });
  const sigShare2 = await LitActions.signEcdsa({ toSign: [128, 209, 155, 167, 229, 220, 187, 13, 166, 2, 199, 95, 102, 221, 126, 115, 126, 3, 246, 254, 177, 16, 113, 222, 120, 95, 209, 63, 254, 29, 55, 32], publicKey, sigName: "sig2" });
};

go();
`;

const runLitAction = async () => {
  const authSig = await getAuthSig();
  const publicKey = await getPkp();
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: "cayenne",
    debug: true,
  });
  await litNodeClient.connect();
  const result = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    jsParams: {
      publicKey,
    }
  });
  // console.log("result: ", result);
  const sig1 = result.signatures.sig1;
  const sig2 = result.signatures.sig2;
  console.log("sig1: ", sig1);
  console.log("sig2: ", sig2);
};

runLitAction();
