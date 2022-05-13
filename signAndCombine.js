import fs from "fs";
import axios from "axios";
import LitJsSdk from "lit-js-sdk/build/index.node.js";

const bytes = fs.readFileSync("./index.js");
const encodedJs = bytes.toString("base64");

console.log("encodedJs", encodedJs);

// need pubkeyset for BLS share combination
// const handshakeResp = await axios.post(
//   "http://localhost:7470/web/handshake",
//   { clientPublicKey: "test" },
//   { headers: { "Content-Type": "application/json" } }
// );
// // console.log("handshakeResp", handshakeResp.data);
// const { networkPublicKeySet } = handshakeResp.data;

// // console.log("networkPublicKeySet", networkPublicKeySet);

// const pkSetAsBytes = LitJsSdk.uint8arrayFromString(
//   networkPublicKeySet,
//   "base16"
// );

// console.log("pkSetAsBytes", pkSetAsBytes);

const basePort = 7470;
const promises = [];

for (let i = 0; i < 10; i++) {
  const url = `http://127.0.0.1:${basePort + i}/web/execute`;
  promises.push(axios.post(url, { js_base64: encodedJs }));
}

Promise.all(promises).then((responses) => {
  const signatureShares = responses.map((res) => res.data);
  // sort the sig shares by share index.  this is important when combining the shares.
  signatureShares.sort((a, b) => a.shareIndex - b.shareIndex);

  const sigShares = signatureShares.map((s) => ({
    shareHex: s.signatureShare,
    shareIndex: s.shareIndex,
  }));
  console.log("sigShares", sigShares);
  // const signature = LitJsSdk.wasmBlsSdkHelpers.combine_signatures(
  //   pkSetAsBytes,
  //   sigShares
  // );
  // // console.log("raw sig", signature);
  // console.log(
  //   "final signature is ",
  //   LitJsSdk.uint8arrayToString(signature, "base16")
  // );
});
