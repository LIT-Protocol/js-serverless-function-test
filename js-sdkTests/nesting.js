import LitJsSdk from "lit-js-sdk/build/index.node.js";

// this code will be run on the node
const litActionCode = `
const signEcdsa = async () => {
  // this Lit Action simply requests an ECDSA signature share from the Lit Node
  const resp = await LitActions.call({
    ipfsId: "Qmb2sJtVLXiNNXnerWB7zjSpAhoM8AxJF2uZsU2iednTtT",
    params: {
      // this is the string "Hello World" for testing
      toSign: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100],
      publicKey:
        "037c9a4097a27573bcda94c2824e92b06204e9a94dbed32fd6506b75d55b4e3c7d",
      sigName: "childSig",
    },
  });

  console.log("results: ", resp);
};

if (functionToRun === "signEcdsa") {
  signEcdsa();
}
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

const runLitAction = async () => {
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: "serrano",
    debug: true,
  });
  await litNodeClient.connect();
  const results = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      functionToRun: "signEcdsa",
    },
  });
  console.log("results: ", results);
};

runLitAction();
