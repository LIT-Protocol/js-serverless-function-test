import * as LitJsSdk from "@lit-protocol/lit-node-client";

// this code will be run on the node
const litActionCode = `
const go = async () => {
  Lit.Actions.setResponse({response: JSON.stringify({"Lit.Auth": Lit.Auth})})
};

go();
`;

// you need an AuthSig to auth with the nodes
// normally you would obtain an AuthSig by calling LitJsSdk.checkAndSignAuthMessage({chain})
const authSig = {
  sig: "0x2bdede6164f56a601fc17a8a78327d28b54e87cf3fa20373fca1d73b804566736d76efe2dd79a4627870a50e66e1a9050ca333b6f98d9415d8bca424980611ca1c",
  derivedVia: "web3.eth.personal.sign",
  signedMessage:
    "localhost wants you to sign in with your Ethereum account:\n0x9D1a5EC58232A894eBFcB5e466E3075b23101B89\n\nThis is a key for Partiful\n\nURI: https://localhost/login\nVersion: 1\nChain ID: 1\nNonce: 1LF00rraLO4f7ZSIt\nIssued At: 2022-06-03T05:59:09.959Z",
  address: "0x9D1a5EC58232A894eBFcB5e466E3075b23101B89",
};

const runLitAction = async () => {
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: "localhost",
    debug: true,
  });
  await litNodeClient.connect();
  const results = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
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
          "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc3Y2MwZWY0YzcxODFjZjRjMGRjZWY3YjYwYWUyOGNjOTAyMmM3NmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDg5OTYwNTQyNzMzNjA1NjgxMzIiLCJlbWFpbCI6ImdldmVuc3RlZUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IlVYV1Z1eEJsdGswcEhKclllOEFXTUEiLCJpYXQiOjE2NjcxNjgyMTUsImV4cCI6MTY2NzE3MTgxNX0.ejZu5bADJ6cUsovV7otHAafy0mqWZBAtN860jvBdVe38XUi0v-eB5WWBPMD5zXcJxbXFvaPWCX8nTaE6S24cNNHJw0hq15irjRZeg9D2i7ToitR1LZSQ3rPCDQZPX4xYn7G-FH7C1DQ-7NEDMmr9ge4B6Qs4pT5Mj8ESVlA29yZjKCfk-zL7F5b6W0EOIA6G9rj6-3HgtazkHfIGHAtfBz4dqHjC4HJncHJzqIm9Y8eSBBnN-ZhYUr3cWxGCuFIw3yrGccv5_khfhbbk6TqdSeMO9YNWN3otiVB8Nwu2sb9VsllFoHIE0uGSzVZVbJgSK1GsGbJZe76ubLuObI5YFw",
        authMethodType: 6,
      },
    ],
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      // this is the string "Hello World" for testing
    },
  });
  console.log("results: ", JSON.stringify(results.response, null, 2));
};

runLitAction();
