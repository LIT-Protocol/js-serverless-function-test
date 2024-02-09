import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { getAuthSig, getPkp } from "../utils.js";
import axios from "axios";

const runLitAction = async () => {
  let code = await axios.get(
    "https://ipfs.io/ipfs/QmdB8DJSmDFAAqJmijgLA6eJdDKt5EWiWzZuHq63nvkURC"
  );
  code = code.data;

  console.log(code);

  const authSig = await getAuthSig();
  const publicKey = await getPkp();
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: "cayenne",
  });
  await litNodeClient.connect();
  const resp = await litNodeClient.executeJs({
    code,
    authSig,
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      // this is the string "Hello World" for testing
      toSign: [65, 208, 164, 167, 229, 220, 187, 13, 166, 2, 199, 95, 102, 221, 126, 115, 126, 3, 246, 254, 177, 16, 113, 222, 120, 95, 209, 63, 254, 29, 52, 240],
      publicKey,
      sigName: "sig1",
    },
  });
  console.log("response: ", resp);
};

runLitAction();
