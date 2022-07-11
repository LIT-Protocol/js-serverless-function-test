const go = async () => {
  console.log("running!");

  // test BLS
  const arr = [65, 65, 65];
  const sig = await LitActions.signBls({
    toSign: [65, 65, 65],
    keyId: "1",
    sigName: "sig1",
  });
  console.log("sig: ", sig);
};

go();
