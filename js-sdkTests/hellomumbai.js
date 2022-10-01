import LitJsSdk from "lit-js-sdk/build/index.node.js";

// this code will be run on the node
const litActionCode = `
const go = async () => {
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the response from the node
  // and combined into a full signature by the LitJsSdk for you to use on the client
  // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
  const sigShare = await LitActions.signEcdsa({ toSign, publicKey, sigName });
};

go();
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
    debug: true,
    litNetwork: "custom",
    bootstrapUrls: [
      "https://polygon-mumbai.litgateway.com:7470",
      "https://polygon-mumbai.litgateway.com:7471",
      "https://polygon-mumbai.litgateway.com:7472",
      "https://polygon-mumbai.litgateway.com:7473",
      "https://polygon-mumbai.litgateway.com:7474",
      "https://polygon-mumbai.litgateway.com:7475",
      "https://polygon-mumbai.litgateway.com:7476",
      "https://polygon-mumbai.litgateway.com:7477",
      "https://polygon-mumbai.litgateway.com:7478",
      "https://polygon-mumbai.litgateway.com:7479",
    ],
  });
  await litNodeClient.connect();
  const results = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      // this is the string "Hello World" for testing
      toSign: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100],
      publicKey:
        "0x03fcbe26124097579632d6dd645739fdf820ef7e528b4e116e47d93fafaf937f51",
      sigName: "sig1",
    },
  });
  console.log("results: ", results);
};

runLitAction();
