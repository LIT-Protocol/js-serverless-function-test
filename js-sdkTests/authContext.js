import LitJsSdk from "lit-js-sdk/build/index.node.js";

// this code will be run on the node
const litActionCode = `
const go = async () => {
  Lit.Actions.setResponse({response: JSON.stringify({"Lit.Auth": Lit.Auth})})
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
    litNetwork: "mumbai",
    debug: true,
  });
  await litNodeClient.connect();
  const results = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    authMethods: [
      {
        // discord oauth
        accessToken: "M1Y1WnYnavzmSaZ6p1LBLsNFn2iiu0",
        authMethodType: 2,
      },
      {
        // google oauth
        accessToken:
          "ya29.a0Aa4xrXMwf3Eu3lKyQenWBbxy0nR0r-iEYT-LmIAY3GCEGd7Qu-V8Ni-nriVAand6pQiYSena52PlMheV3s2qzvrbFa5hJIktvq74YytPiKIrBiWj8e1Q_Nao-jqBGKFI_rn0Q7hKnDf2ff_Rmyd2YrZSnLAsaCgYKATASARESFQEjDvL9CPGxMjEQZBnvLEsMcZyLKw0163",
        authMethodType: 3,
      },
    ],
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      // this is the string "Hello World" for testing
      toSign: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100],
      publicKey:
        "0x0481977a2ca0e52eaa5f0ecd3da4858817bc8bce4d165ae76fbaabf1952348829657d11382a1f37c606329857048033befbde83094ea55d7d7208230485253f304",
      sigName: "sig1",
    },
  });
  console.log("results: ", JSON.stringify(results.response, null, 2));
};

runLitAction();
