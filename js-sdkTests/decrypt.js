import * as LitJsSdk from "@lit-protocol/lit-node-client";
// this code will be run on the node
// The Lit Action Code lives at /ipfsCode/checkWeather.js

// you need an AuthSig to auth with the nodes
// normally you would obtain an AuthSig by calling LitJsSdk.checkAndSignAuthMessage({chain})
const authSig = {
  sig: "0x2bdede6164f56a601fc17a8a78327d28b54e87cf3fa20373fca1d73b804566736d76efe2dd79a4627870a50e66e1a9050ca333b6f98d9415d8bca424980611ca1c",
  derivedVia: "web3.eth.personal.sign",
  signedMessage:
    "localhost wants you to sign in with your Ethereum account:\n0x9D1a5EC58232A894eBFcB5e466E3075b23101B89\n\nThis is a key for Partiful\n\nURI: https://localhost/login\nVersion: 1\nChain ID: 1\nNonce: 1LF00rraLO4f7ZSIt\nIssued At: 2022-06-03T05:59:09.959Z",
  address: "0x9D1a5EC58232A894eBFcB5e466E3075b23101B89",
};

const runTest = async () => {
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: "serrano",
    debug: true,
  });
  await litNodeClient.connect();

  // This JS lives at IPFS ID QmcgbVu2sJSPpTeFhBd174FnmYmoVYvUFJeDkS7eYtwoFY
  // It's shown here for reference
  /*
  const go = async (maxTemp) => {
    const url = "https://api.weather.gov/gridpoints/LWX/97,71/forecast";
    try {
      const response = await fetch(url).then((res) => res.json());
      const nearestForecast = response.properties.periods[0];
      const temp = nearestForecast.temperature;
      return temp < parseInt(maxTemp);
    } catch (e) {
      console.log(e);
    }
    return false;
  };
  */

  // create your access control conditions.  Note that the contractAddress is an IPFS hash of the file at /ipfsCode/checkWeather.js.  We pass the param of "100" to the go() function in the Lit Action Code.
  var accessControlConditions = [
    {
      contractAddress: "ipfs://QmcgbVu2sJSPpTeFhBd174FnmYmoVYvUFJeDkS7eYtwoFY",
      standardContractType: "LitAction",
      chain: "ethereum", // nothing actually lives on ethereum here, but we need to pass a chain
      method: "go",
      parameters: ["100"],
      returnValueTest: {
        comparator: "=",
        value: "true",
      },
    },
  ];

  // let's encrypt something
  const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
    "this is a secret message"
  );
  console.log(
    "symmetric key: ",
    LitJsSdk.uint8arrayToString(symmetricKey, "base16")
  );

  // store the access control conditions
  const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
    accessControlConditions,
    symmetricKey,
    authSig,
    chain: "ethereum", // nothing actually lives on ethereum here, but we need to pass a chain
  });

  console.log("Condition stored.  Now to retrieve the key and decrypt it.");

  const symmetricKeyFromNodes = await litNodeClient.getEncryptionKey({
    accessControlConditions,
    toDecrypt: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16"),
    chain: "ethereum", // nothing actually lives on ethereum here, but we need to pass a chain
    authSig,
  });

  const decryptedString = await LitJsSdk.decryptString(
    encryptedString,
    symmetricKeyFromNodes
  );
  console.log("decryptedString: ", decryptedString);
};

runTest()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
