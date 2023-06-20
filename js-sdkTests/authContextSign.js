import * as LitJsSdk from "@lit-protocol/lit-node-client";

// this code will be run on the node
const litActionCode = `
const go = async () => {
  Lit.Actions.setResponse({response: JSON.stringify({"Lit.Auth": Lit.Auth})})

  // try and sign something
  const sig = await Lit.Actions.signEcdsa({toSign, publicKey, sigName })
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
    litNetwork: "custom",
    bootstrapUrls: [
      "http://localhost:7470",
      "http://localhost:7471",
      "http://localhost:7472",
    ],
    minNodeCount: 2,
    debug: true,
  });
  await litNodeClient.connect();
  const results = await litNodeClient.executeJs({
    authSig: authSig,
    code: litActionCode,
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
      // {
      //   // google oauth JWT
      //   accessToken:
      //     "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc3Y2MwZWY0YzcxODFjZjRjMGRjZWY3YjYwYWUyOGNjOTAyMmM3NmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDg5OTYwNTQyNzMzNjA1NjgxMzIiLCJlbWFpbCI6ImdldmVuc3RlZUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IlhweWVtRF8xeHJYUEk3MzZWaUwxMGciLCJpYXQiOjE2NjcxNzIxNjEsImV4cCI6MTY2NzE3NTc2MX0.DtWgm-DvBzJihOCa3NWXhe-y_mj-B3_XX89YXQw5yHhddqfRsGiBZVkCLymsPDE7XflCS1WnE5W5nB7WhJ9fTbTzHauoZlBACpK8rh8F5zJZXdlRYla0PiQ6NAJmm8k8RjzjzGeR18Imym32Py0x4Ru3y6jted5PNqQ_ZmfmmdO1PEkzCT6JN7kcEA4LdRRrMzIaphNpVCNw5JeW3mjHXGenatnJNi-Kmsa_SvcHtXD0i3kzrRJNpDaNFyz9DoDX4fr1Bwv42z6IXB2wUmX6M3RxXLS2lh5EHU0cP8GG-dUQd8ec5YzKnPpwMFXkDi5-wWio2Ztyf1GaxDPgwKHugQ",
      //   authMethodType: 6,
      // },
      {
        accessToken:
          "eyJraWQiOiJXNldjT0tCIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiaG9zdC5leHAuRXhwb25lbnQiLCJleHAiOjE2ODYyMDgxNjEsImlhdCI6MTY4NjEyMTc2MSwic3ViIjoiMDAxOTE0LjAxNDQ3MTM1OTgyOTQ5MWZhOTU3N2QwNzQ3NDMwMTcxLjEzNTAiLCJjX2hhc2giOiJzSlc1SXlUQ3E2aDMyejVxa0V6NTF3IiwiZW1haWwiOiJiYXB0aXN0ZS5ncmV2ZUBlc3BlbWUuY29tIiwiZW1haWxfdmVyaWZpZWQiOiJ0cnVlIiwiYXV0aF90aW1lIjoxNjg2MTIxNzYxLCJub25jZV9zdXBwb3J0ZWQiOnRydWV9.A4mIHj4XSY5sgkW9q8BzFhR8gdFTNRORvPMFOISQyhjibn4Szrgj6gkE7INt32a5rtLN5KKqAQtxKkytANScpACZv9ROucItz4GrLHwjVnc0GoCEU6T9rQzWPKcDZejzJEdKlhJsBxM_etKBML6bOeWd4rAv5cfOoRzr1yo_2c1KcpWcglY2p2tJADFCjBG_FJbPaoTD2lSw7nUL0Nyvpyk9JpsRpRgUHN8wnaOLVFMew-Fk-6q_-FwAmddO7sIzPIgbxwSz_17ErgL6jwQRzdSX3P4HuiVVwIE6DRKrek7zjxB8TUu5yuFyrjzgeZZAgof_nRYI9svsFNiyLDnJzQ",
        authMethodType: 8,
      },
    ],
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      // this is the string "Hello World" for testing
      toSign: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100],
      publicKey:
        "0411e7f0ea9b5f4f37f92cb9c17943aa7aada4bdeb144b16da0d66909e1290ef44c3d0a8c0b039f73cd8fe02bcbc090ccfd939f2df3cb20eae61297d85d7e2273c",
      sigName: "sig1",
    },
  });
  console.log("results: ", JSON.stringify(results.response, null, 2));
};

runLitAction()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
