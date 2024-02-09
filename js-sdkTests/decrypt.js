import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { getAuthSig } from "../utils.js";
// This example uses a Lit Action as an Access Control Condition to decrypt some data.  The data will only be decryptable if the Lit Action returns true.  In this case, the lit action checks a weather API to see if the temperature in New York is below 100 degrees F.  If it is, the data is decrypted.  If not, the data is not decrypted.


// The Lit Action Code lives at /ipfsCode/checkWeather.js and will be run on the node.  It's also at IPFS ID QmcgbVu2sJSPpTeFhBd174FnmYmoVYvUFJeDkS7eYtwoFY

const runTest = async () => {
  const authSig = await getAuthSig();
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: "cayenne",
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
  const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
    {
      accessControlConditions,
      authSig,
      chain: "ethereum",
      dataToEncrypt: "This is a secret message" // nothing actually lives on ethereum here, but we need to pass a chain
    },
    litNodeClient
  );
  console.log(
    "ciphertext ",
    LitJsSdk.uint8arrayToString(ciphertext, "base16")
  );

  console.log("Data encrypted.  Now to decrypt it.");

  const decryptedString = await LitJsSdk.decryptToString({
    accessControlConditions,
    ciphertext,
    dataToEncryptHash,
    authSig,
    chain: "ethereum", // nothing actually lives on ethereum here, but we need to pass a chain
  }, litNodeClient);

  console.log("decryptedString: ", decryptedString);
};

runTest()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
