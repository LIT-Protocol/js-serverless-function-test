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

async function test({ litNodeClient, publicKey, authSig }) {
  const results = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      // this is the string "Hello World" for testing
      toSign: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100],
      publicKey,
      sigName: "sig1",
    },
  });
  // console.log("results: ", results);
  const { signature } = results.signatures.sig1;
  if (signature.length !== 132) {
    return {
      success: false,
      message: `signature length is not 132.  signature is ${signature}`,
    };
  }
  return { success: true };
}

export default { test };
