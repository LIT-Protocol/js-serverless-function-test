import LitJsSdk from "lit-js-sdk/build/index.node.js";

// this code will be run on the node
const litActionCode = `
const go = async () => {
  // this is the string "Hello World" for testing
  const toSign = [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100];
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  const sigShare = await LitActions.signEcdsa({ toSign, publicKey: "02c55050b2f1a2f3207452f7a662728ed68f6dd17b8060b07d3af09a801b02f3c0", sigName: "sig1" });
};

// check the params we passed in:
const correctParams = {
  aString: "meow",
  anInt: 42,
  aFloat: 123.456,
  anArray: [1, 2, 3, 4],
  anArrayOfStrings: ["a", "b", "c", "d"],
  anObject: { x: 1, y: 2 },
  anObjectOfStrings: { x: "a", y: "b" },
};

// abort if any of these mismatch.  the signing won't happen.
if (
  aString !== correctParams.aString ||
  anInt !== correctParams.anInt ||
  aFloat !== correctParams.aFloat ||
  JSON.stringify(anArray) !== JSON.stringify(correctParams.anArray) ||
  JSON.stringify(anArrayOfStrings) !==
    JSON.stringify(correctParams.anArrayOfStrings) ||
  JSON.stringify(anObject) !== JSON.stringify(correctParams.anObject) ||
  JSON.stringify(anObjectOfStrings) !==
    JSON.stringify(correctParams.anObjectOfStrings)
) {
  // noooo
  console.log("------------- HEY!  Notice this! -------------");
  console.log("One of the params passed in is not matching");
  console.log("correctParams", JSON.stringify(correctParams));
  console.log(
    "Go and figure out which one below isn't matching correctParams above to debug this"
  );
  console.log("aString: ", aString);
  console.log("anInt: ", anInt);
  console.log("aFloat: ", aFloat);
  console.log("anArray: ", anArray);
  console.log("anArrayOfStrings: ", anArrayOfStrings);
  console.log("anObject: ", anObject),
    console.log("anObjectOfStrings: ", anObjectOfStrings);
  console.log(
    "------------- EXITING LIT ACTION due to above error -------------"
  );
  process.exit(0);
} else {
  console.log('all the params match!')
}




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

const go = async () => {
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    minNodeCount: 6,
    bootstrapUrls: [
      "http://localhost:7470",
      "http://localhost:7471",
      "http://localhost:7472",
      "http://localhost:7473",
      "http://localhost:7474",
      "http://localhost:7475",
      "http://localhost:7476",
      "http://localhost:7477",
      "http://localhost:7478",
      "http://localhost:7479",
    ],
    litNetwork: "custom",
    debug: true,
  });
  await litNodeClient.connect();
  const signatures = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    jsParams: {
      aString: "meow",
      anInt: 42,
      aFloat: 123.456,
      anArray: [1, 2, 3, 4],
      anArrayOfStrings: ["a", "b", "c", "d"],
      anObject: { x: 1, y: 2 },
      anObjectOfStrings: { x: "a", y: "b" },
    },
  });
  console.log("signatures: ", signatures);
};

go();
