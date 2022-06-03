import LitJsSdk from "lit-js-sdk";

const litActionCode = `
const go = async () => {
  // this is the string "Hello World" for testing
  const arr = [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100];
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  const sigShare = await LitActions.signEcdsa({ toSign, keyId: 1, sigName: "sig1" });
};

go();
`;

const signatures = LitJsSdk.executeJs({
  code: litActionCode,
  sigType: "ecdsa",
});
console.log("signatures: ", signatures);
