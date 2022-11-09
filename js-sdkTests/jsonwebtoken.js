import LitJsSdk from "lit-js-sdk/build/index.node.js";
import fs from "fs";
import jwkToPem from "jwk-to-pem";

// this code will be run on the node
const litActionCode = `
const go = async () => {
  // look up the kid in the jwt header
  const decoded = jwt.decode(accessToken, { complete: true });
  const kid = decoded.header.kid;
  // get the PEM from the google certs
  const pem = googleCerts[kid];

  // verify the token
  const val = jwt.verify(accessToken, pem);
  LitActions.setResponse({response: JSON.stringify({val})})
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

const go = async () => {
  // convert the second google cert to a PEM
  let googleCertsJWK = JSON.parse(fs.readFileSync("./google_certs.json"));
  // loop over google certs JWK and convert to PEM with kid as the object key
  const googleCerts = {};
  for (let i = 0; i < googleCertsJWK.keys.length; i++) {
    const googleCertJWK = googleCertsJWK.keys[i];
    const googleCertPEM = jwkToPem(googleCertJWK);
    googleCerts[googleCertJWK.kid] = googleCertPEM;
  }

  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    minNodeCount: 6,
    debug: true,
    litNetwork: "custom",
    bootstrapUrls: [
      "http://localhost:7470",
      "http://localhost:7471",
      "http://localhost:7472",
      "http://localhost:7473",
      "http://localhost:7474",
      "http://localhost:7475",
      "http://localhost:7476",
      "http://localhost:7477",
      "http://localhost:7478",
      "http://localhost:7479",
    ],
  });
  await litNodeClient.connect();
  const results = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    jsParams: {
      accessToken:
        "eyJhbGciOiJSUzI1NiIsImtpZCI6ImY0NTEzNDVmYWQwODEwMWJmYjM0NWNmNjQyYTJkYTkyNjdiOWViZWIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDg5OTYwNTQyNzMzNjA1NjgxMzIiLCJlbWFpbCI6ImdldmVuc3RlZUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6Im5HNFl1TXdhaHh6X3duVHRScHNlZUEiLCJpYXQiOjE2NjgwMTY4ODYsImV4cCI6MTY2ODAyMDQ4Nn0.P7kK52EsOJdrCWY1_5ktIx-jJHlo707Jwxgja30ZCFLBReeditQRteRoiY2Pg2q2j_V-y5oYo-qIBCj5Bvz0gQJ4PERFJhTHrMqwvEYwTxP9VNvcRRwEimCEz4p6k-Gxvf-wjczNumVdoaY6uXn1ic2eMuF3tSRYXVv6JhnKqwbOZpQOwfuWPQ9G8J3uBe22-yugOdrJBt3XJzLyuM42ti2mxMOkHTx1dUu6W11RyYSooZ_n3lN4rtp390qO0-kTWOyX4y7Jhssn1Ex3wFH8GRIL3pBUS_qItBPxujodf1UHRMMxEOTW4142b6KCjOVy1peZ-kUqMl3ruMMlnyZs7Q",
      googleCerts,
    },
  });

  console.log("results: ", results);
};

go();
