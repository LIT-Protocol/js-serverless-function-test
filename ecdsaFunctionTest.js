const go = async () => {
  const toSign = [65, 65, 65, 65, 65]; // this is the string "AAA" for testing
  const sig = await LitActions.signEcdsa({
    toSign,
    publicKey: 1,
    sigName: "sig1",
  });
  console.log("sig: ", sig);
};

go();
