import LitJsSdk from "lit-js-sdk/build/index.node.js";

// this code will be run on the node
const litActionCode = `
const go = async () => {  
  const url = "https://api.weather.gov/gridpoints/TOP/31,80/forecast";
  const resp = await fetch(url).then((response) => response.json());
  const temp = resp.properties.periods[0].temperature;

  // only sign if the temperature is above 60.  if it's below 60, exit.
  if (temp < 60) {
    return;
  }
  
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
  const sigShare = await LitActions.signEcdsa({ toSign, publicKey , sigName });
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
    litNetwork: "serrano",
    debug: true,
  });
  await litNodeClient.connect();
  const signatures = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      // this is the string "Hello World" for testing
      toSign: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100],
      publicKey: "1",
      sigName: "sig1",
    },
  });
  console.log("signatures: ", signatures);
};

runLitAction();
