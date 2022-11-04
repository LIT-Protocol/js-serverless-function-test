// NOTE: this doens't work yet.  i only have it working on a private branch of the node.
// we are working on a better strategy for this and will release it soon.

import LitJsSdk from "lit-js-sdk/build/index.node.js";

// this code will be run on the node
const litActionCode = `
const go = async () => {
  Lit.Actions.setResponse({response: JSON.stringify({"Lit.Auth": Lit.Auth})})

  // try and sign something
  const sig = await Lit.Actions.signEcdsa({toSign, publicKey, sigName })
};

go();
`;

const runLitAction = async () => {
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: "localhost",
    debug: true,
  });
  await litNodeClient.connect();
  const results = await litNodeClient.executeJs({
    code: litActionCode,
    authSig: null,
    authMethods: [
      // {
      //   // discord oauth
      //   accessToken: "M1Y1WnYnavzmSaZ6p1LBLsNFn2iiu0",
      //   authMethodType: 4,
      // },
      // {
      //   // google oauth
      //   accessToken:
      //     "ya29.a0Aa4xrXMCyLStBQzLhC8il8YRPXIkEEgno9nB4PKvjCi6oIu-uIjeIoyfQoR99TcZf0IUMPfJfjRIJyIXtLk_kXLa5BmdUyJcJGP8SB4-UjlebOILidfItC8KR1sQR9LSFX55cw3_GTa5IqCOCTXME38z5ZMZaCgYKATASARASFQEjDvL9HinQH3Mk1UclCD011YbLfQ0163",
      //   authMethodType: 5,
      // },
      {
        // google oauth JWT
        accessToken:
          "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc3Y2MwZWY0YzcxODFjZjRjMGRjZWY3YjYwYWUyOGNjOTAyMmM3NmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDg5OTYwNTQyNzMzNjA1NjgxMzIiLCJlbWFpbCI6ImdldmVuc3RlZUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IkI1TTZvUEo5TU81cUJQLWlFUk9OMXciLCJpYXQiOjE2NjczNjE5MDksImV4cCI6MTY2NzM2NTUwOX0.j8k3xi49_Q9wcjDmQPhUqH5LOq0p35rYxivJSJ35phOUYtiu1Y-zQ7Z6b1ZywiOOxhdokGdp1LHgYZ77BB1pw5BkgcxklzatkZ7vD5P5Qi6TSbP7liNlwF5Vs4kiumhRM4I-c2Sy7TabDbXsWOI1HncycU6OiAC915EiL9sDDDJljxA4BPh2niAcKgAqZCaxlbvSBoSA6vBS40cZWPHy86_gsQ2ORNFxNS4PSPnUAFhInF4mCUNPMihNl_8nSOCP1bf8IkaIeCl9qtke4whXHTjgarVU9pE9O0QEK8DXIwKYHn91RqnCGf0SlxKBOIDa7q9gCbLFnMkX0L0Bn8-DeA",
        authMethodType: 6,
        pkpPublicKey:
          "0x04a9af8818c5fddcadbf5b83f6be16bd424516b67a280593b249c8aebe37c6ea957a7200a3c8ae6a61b48ea17751e8236d0f8425337b1732c25865070105c3543a",
      },
    ],
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      // this is the string "Hello World" for testing
      toSign: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100],
      publicKey:
        "0x04a9af8818c5fddcadbf5b83f6be16bd424516b67a280593b249c8aebe37c6ea957a7200a3c8ae6a61b48ea17751e8236d0f8425337b1732c25865070105c3543a",
      sigName: "sig1",
    },
  });
  console.log("results: ", JSON.stringify(results.response, null, 2));
};

runLitAction();
