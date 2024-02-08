import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { getAuthSig, getPkp } from "../utils.js";

// this code will be run on the node
const litActionCode = `
const nestedSigning = async () => {
  // this Lit Action simply requests an ECDSA signature share from the Lit Node
  const resp = await Lit.Actions.call({
    ipfsId: "QmRwN9GKHvCn4Vk7biqtr6adjXMs7PzzYPCzNCRjPFiDjm",
    params: {
      // this is the string "Hello World" for testing
      toSign: [65, 208, 164, 167, 229, 220, 187, 13, 166, 2, 199, 95, 102, 221, 126, 115, 126, 3, 246, 254, 177, 16, 113, 222, 120, 95, 209, 63, 254, 29, 52, 240],
      publicKey,
      sigName: "childSig",
    },
  });

  console.log("results: ", resp);
};

// you could have various child lit actions that are run depending on the jsParams
if (functionToRun === "nestedSigning") {
  nestedSigning();
}
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
  const results = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      functionToRun: "nestedSigning",
      publicKey
    },
  });
  console.log("results: ", results);
};

runLitAction();
