import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { getAuthSig, getPkp } from "../utils.js";

// this code will be run on the node
const litActionCode = `
const go = async () => {
  // this is the string "Hello World" for testing
  const toSign = [65, 208, 164, 167, 229, 220, 187, 13, 166, 2, 199, 95, 102, 221, 126, 115, 126, 3, 246, 254, 177, 16, 113, 222, 120, 95, 209, 63, 254, 29, 52, 240];
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  const sigShare = await LitActions.signEcdsa({ toSign, publicKey , sigName: "sig1" });
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

const go = async () => {
  const authSig = await getAuthSig();
  const publicKey = await getPkp();
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: "cayenne",
    debug: true,
  });
  await litNodeClient.connect();
  const signatures = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    jsParams: {
      publicKey,
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
