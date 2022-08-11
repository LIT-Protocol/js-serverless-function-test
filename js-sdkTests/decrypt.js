import LitJsSdk from "lit-js-sdk/build/index.node.js";

// this code will be run on the node
const litActionCode = `
const go = async () => {  
  // this requests a decryption share from the Lit Node
  // the decryption share will be automatically returned in the HTTP response from the node
  const decryptionShare = await LitActions.decryptBls({ toDecrypt, publicKey, decryptionName });
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
    litNetwork: "localhost",
    debug: true,
  });
  await litNodeClient.connect();

  // let's encrypt something
  const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
    "this is a secret message"
  );
  console.log(
    "symmetric key: ",
    LitJsSdk.uint8arrayToString(symmetricKey, "base16")
  );
  const encryptedSymmetricKey = LitJsSdk.encryptWithBlsPubkey({
    pubkey: litNodeClient.subnetPubKey,
    data: symmetricKey,
  });
  console.log(
    "encryptedSymmetricKey: ",
    LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
  );

  const result = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    jsParams: {
      toDecrypt: Array.from(encryptedSymmetricKey),
      publicKey: "1",
      decryptionName: "decryption1",
    },
  });
  console.log("result: ", result);

  const decryptedSymmetricKey = LitJsSdk.uint8arrayFromString(
    result.decryptions.decryption1.decrypted,
    "base16"
  );
  const decryptedString = await LitJsSdk.decryptString(
    encryptedString,
    decryptedSymmetricKey
  );
  console.log("decryptedString: ", decryptedString);
};

runLitAction();
