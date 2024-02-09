import * as LitJsSdk from "@lit-protocol/lit-node-client";
import fs from "fs";
import jwkToPem from "jwk-to-pem";
import { getAuthSig, getPkp } from "../utils.js";

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

  const authSig = await getAuthSig();
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    debug: true,
    litNetwork: "cayenne",
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
