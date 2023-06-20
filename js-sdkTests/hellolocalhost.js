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
    litNetwork: "custom",
    bootstrapUrls: [
      "http://localhost:7470",
      "http://localhost:7471",
      "http://localhost:7472",
      // "http://localhost:7473",
      // "http://localhost:7474",
      // "http://localhost:7475",
      // "http://localhost:7476",
      // "http://localhost:7477",
      // "http://localhost:7478",
      // "http://localhost:7479",
      // "https://polygon-mumbai.litgateway.com:7370",
      // "https://polygon-mumbai.litgateway.com:7371",
      // "https://polygon-mumbai.litgateway.com:7372",
      // `https://158.69.34.226`,
      // `https://173.231.56.243`,
      // `https://23.82.129.77`,
    ],
    debug: true,
    minNodeCount: 2,
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
        "0411e7f0ea9b5f4f37f92cb9c17943aa7aada4bdeb144b16da0d66909e1290ef44c3d0a8c0b039f73cd8fe02bcbc090ccfd939f2df3cb20eae61297d85d7e2273c",
      sigName: "sig1",
    },
  });
  console.log("results: ", results);

  /* This will print:
  results:  {
    signatures: {},
    decryptions: {},
    response: {
      tokenId: '0x989a329e54e4a96fc1cbcc84589ac6ef02c86c44bbe6a14f3d8b817a7ceedc98',
      isPermittedAction: false,
      isPermittedAddress: true,
      isPermittedAuthMethod: false,
      permittedActions: [ 'QmW6uH8p17DcfvZroULkdEDAKThWzEDeNtwi9oezURDeXN' ],
      permittedAddresses: [
        '0x50e2dac5e78b5905cb09495547452cee64426db2',
        '0x9d1a5ec58232a894ebfcb5e466e3075b23101b89'
      ],
      permittedAuthMethods: '[{"auth_method_type":"0x2","user_id":"0xba5eba11","user_pubkey":"0xb01dface"}]'
    },
    logs: ''
  }
  */
};

runLitAction();
