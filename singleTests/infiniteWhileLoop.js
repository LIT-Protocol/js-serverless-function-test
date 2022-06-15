const go = async () => {
  // this is the string "Hello World" for testing
  const toSign = [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100];
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  // const sigShare = await LitActions.signEcdsa({ toSign, keyId: 1, sigName: "sig1" });

  let time = Date.now();
  while (true) {
    // do nothing
    let curTime = Date.now();
    console.log(
      "The JS has been running in an infinite loop for this many ms: " +
        (curTime - time)
    );
  }
};

go();
