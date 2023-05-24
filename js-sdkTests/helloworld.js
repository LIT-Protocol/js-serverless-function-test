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
  "sig": "0xa40d3cd5bc56fee6f505068bffadda34da8ef94915c610d1dfaca124d82befd153dcafe4bba0191fbc2fa97aeea57b85e724f97048d1540bfe2e20f4aae47b6a1b",
  "derivedVia": "web3.eth.personal.sign via Lit PKP",
  "signedMessage": "localhost:3000 wants you to sign in with your Ethereum account:\n0x239e847590EB7F553487F2bC45160a73F3532d30\n\nLit Protocol PKP session signature I further authorize the stated URI to perform the following actions on my behalf: (1) '*': '*' for 'lit-accesscontrolcondition://fa66d3028e31a6e73c65eb36c41b1b17f37323bebfa1587afe2216ba959b1f4b'.\n\nURI: lit:session:c121360f27436ac0b62a51ebb63339b9bd222a5d2a23dc72a0cde5683eb8ad8f\nVersion: 1\nChain ID: 1\nNonce: fBhON689RDchHy9B9\nIssued At: 2023-05-24T23:34:46.373Z\nExpiration Time: 2023-05-25T23:34:46.216Z\nResources:\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly9mYTY2ZDMwMjhlMzFhNmU3M2M2NWViMzZjNDFiMWIxN2YzNzMyM2JlYmZhMTU4N2FmZTIyMTZiYTk1OWIxZjRiIjp7IiovKiI6W3t9XX19LCJwcmYiOltdfQ",
  "address": "0x239e847590EB7F553487F2bC45160a73F3532d30"
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
        "04944c839a484c29573250cc4e1f8f560938b371d0b47ded359683f5fe2c0de9bbc3c9d812d69317928a2fdd4b125d2436a33dddbe5417ec66c29adb60482a570b",
      sigName: "sig1",
    },
  });
  console.log("results: ", results);
};

runLitAction();
