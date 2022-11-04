import LitJsSdk from "lit-js-sdk/build/index.node.js";
import axios from "axios";

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
  let code = await axios.get(
    "https://ipfs.io/ipfs/QmdB8DJSmDFAAqJmijgLA6eJdDKt5EWiWzZuHq63nvkURC"
  );
  code = code.data;

  console.log(code);

  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: "mumbai",
  });
  await litNodeClient.connect();
  const resp = await litNodeClient.executeJs({
    code,
    authSig,
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      // this is the string "Hello World" for testing
      toSign: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100],
      publicKey:
        "0x044c490035904b174e88b15fbb70fa325652b81603a3c209f9f226d434be712deb90e633b3d7ee03c7dc63ad086906e4dfc9bc1e973845933c1be99719b00c8c75",
      sigName: "sig1",
    },
  });
  console.log("response: ", resp);
};

runLitAction();
