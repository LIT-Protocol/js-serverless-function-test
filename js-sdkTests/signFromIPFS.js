import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { getAuthSig, getPkp } from "../utils.js";

const ipfsId = "QmRwN9GKHvCn4Vk7biqtr6adjXMs7PzzYPCzNCRjPFiDjm";

const runLitAction = async () => {
  const authSig = await getAuthSig();
  const publicKey = await getPkp();
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: "cayenne",
  });
  await litNodeClient.connect();
  const resp = await litNodeClient.executeJs({
    ipfsId,
    authSig,
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      toSign: [65, 208, 164, 167, 229, 220, 187, 13, 166, 2, 199, 95, 102, 221, 126, 115, 126, 3, 246, 254, 177, 16, 113, 222, 120, 95, 209, 63, 254, 29, 52, 240],
      publicKey,
      sigName: "sig1",
    },
  });
  console.log("response: ", resp);
};

runLitAction();
