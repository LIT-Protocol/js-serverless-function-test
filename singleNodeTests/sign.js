const go = async () => {
  // this is the string "Hello World" for testing
  const toSign = [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100];
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  const sigShare = await LitActions.signEcdsa({
    toSign,
    publicKey:
      "0x02c339c85578dca9b330c89da1a3cc791961d1656ffd36be986971d465e4ab1f2d",
    sigName: "sig1",
  });
};

go();
