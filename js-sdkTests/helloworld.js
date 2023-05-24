import * as LitJsSdk from "@lit-protocol/lit-node-client";

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
  "authSig": {
      "sig": "0x1d32c6e26a77b4b93ebff744dd2782b56e60d46d0cb43e385c1d7753501fa34c4a0517c4e881461dc4e31b8c8bcfe4116215a1815449b9bfeadf967e4b9d360a1c",
      "derivedVia": "web3.eth.personal.sign via Lit PKP",
      "signedMessage": "localhost:3000 wants you to sign in with your Ethereum account:\n0x239e847590EB7F553487F2bC45160a73F3532d30\n\nLit Protocol PKP session signature I further authorize the stated URI to perform the following actions on my behalf: (1) '*': '*' for 'lit-accesscontrolcondition://befc5f27e2e257e1a76948516017406ca0ecfb4e11a5551178e86d40d279a6d3'.\n\nURI: lit:session:c121360f27436ac0b62a51ebb63339b9bd222a5d2a23dc72a0cde5683eb8ad8f\nVersion: 1\nChain ID: 1\nNonce: c7wR3YQePHHnX3xzI\nIssued At: 2023-05-24T05:28:01.127Z\nExpiration Time: 2023-05-25T05:28:00.964Z\nResources:\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly9iZWZjNWYyN2UyZTI1N2UxYTc2OTQ4NTE2MDE3NDA2Y2EwZWNmYjRlMTFhNTU1MTE3OGU4NmQ0MGQyNzlhNmQzIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ",
      "address": "0x239e847590EB7F553487F2bC45160a73F3532d30"
  },
  "pkpPublicKey": "04944c839a484c29573250cc4e1f8f560938b371d0b47ded359683f5fe2c0de9bbc3c9d812d69317928a2fdd4b125d2436a33dddbe5417ec66c29adb60482a570b"
};

const runLitAction = async () => {
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: "serrano",
    debug: true,
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
        "0x043a62b6fe3b9bdebaa9f2263059118a34cff6a99a10e5085d9bd99d14a42e7a1a24fd040d22f97aac0682b64b8f28905ed97f11848f61dd8cf2ec67bd329806c1",
      sigName: "sig1",
    },
  });
  console.log("results: ", results);
};

runLitAction();
