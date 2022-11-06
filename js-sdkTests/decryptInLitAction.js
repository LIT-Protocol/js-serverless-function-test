// Hello!  This demo is a PoC that isn't ready for production yet and will not work if you try to use it
// this feature is something that we intend to build but the naive implementation
// that we built for this PoC on the node is terrible and it needs to be revised
// before we can release this publicly.

import LitJsSdk from "lit-js-sdk/build/index.node.js";

// this code will be run on the node
const litActionCode = `
const go = async () => {
  // convert encryptedSymmetricKeyHex to an array
  const toDecrypt = Lit.Actions.uint8arrayFromString(encryptedSymmetricKeyHex, 'hex')
  const symmetricKeyHex = await Lit.Actions.getEncryptionKey({ conditions: unifiedAccessControlConditions, authSig, chain, toDecrypt })

  // convert ciphertext to array
  const ciphertext = Lit.Actions.uint8arrayFromString(encryptedStringHex, 'hex')
  const symmetricKey = Lit.Actions.uint8arrayFromString(symmetricKeyHex, 'hex')

  // console.log('ciphertext: ', ciphertext)
  // console.log('symmetricKey: ', symmetricKey)

  const decryptedContentHex = await Lit.Actions.aesDecrypt({symmetricKey, ciphertext})

  // convert decrypted content from hex to string
  const decryptedContentArray = Lit.Actions.uint8arrayFromString(decryptedContentHex, 'hex')
  const decryptedContent = Lit.Actions.uint8arrayToString(decryptedContentArray, 'utf8')
  

  Lit.Actions.setResponse({response: JSON.stringify({decryptedContent})})
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

const chain = "mumbai";

const unifiedAccessControlConditions = [
  {
    conditionType: "evmBasic",
    contractAddress: "",
    standardContractType: "",
    chain,
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "10000000000000",
    },
  },
];

const runLitAction = async () => {
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: "localhost",
    debug: true,
  });
  await litNodeClient.connect();

  const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
    "this is a secret message"
  );

  let encryptedStringAb = await encryptedString.arrayBuffer();
  let encryptedStringHex = LitJsSdk.uint8arrayToString(
    new Uint8Array(encryptedStringAb),
    "hex"
  );

  const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
    unifiedAccessControlConditions,
    symmetricKey,
    authSig,
    chain,
  });

  const encryptedSymmetricKeyHex = LitJsSdk.uint8arrayToString(
    encryptedSymmetricKey,
    "hex"
  );

  const results = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      unifiedAccessControlConditions,
      authSig,
      chain,
      encryptedSymmetricKeyHex,
      encryptedStringHex,
    },
  });
  console.log("results: ", results);
};

runLitAction();
