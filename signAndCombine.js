import fs from "fs";
import axios from "axios";
import LitJsSdk from "lit-js-sdk/build/index.node.js";
import { serialize } from "@ethersproject/transactions";
// import LitJsSdk from "lit-js-sdk";

const testBlsSigning = async () => {
  const bytes = fs.readFileSync("./blsFunctionTest.js");
  const encodedJs = bytes.toString("base64");

  console.log("encodedJs", encodedJs);

  // need pubkeyset for BLS share combination
  const handshakeResp = await axios.post(
    "http://localhost:7470/web/handshake",
    { clientPublicKey: "test" },
    { headers: { "Content-Type": "application/json" } }
  );
  // console.log("handshakeResp", handshakeResp.data);
  const { networkPublicKeySet } = handshakeResp.data;

  // console.log("networkPublicKeySet", networkPublicKeySet);

  const pkSetAsBytes = LitJsSdk.uint8arrayFromString(
    networkPublicKeySet,
    "base16"
  );
  console.log("pkSetAsBytes", pkSetAsBytes);

  const basePort = 7470;
  const promises = [];

  for (let i = 0; i < 10; i++) {
    const url = `http://127.0.0.1:${basePort + i}/web/execute`;
    promises.push(axios.post(url, { js_base64: encodedJs }));
  }

  Promise.all(promises).then((responses) => {
    const signatureShares = responses.map((res) => res.data);
    // sort the sig shares by share index.  this is important when combining the shares for BLS
    signatureShares.sort((a, b) => a.shareIndex - b.shareIndex);

    const sigShares = signatureShares.map((s) => ({
      shareHex: s.signatureShare,
      shareIndex: s.shareIndex,
    }));
    console.log("sigShares", sigShares);
    const signature = LitJsSdk.wasmBlsSdkHelpers.combine_signatures(
      pkSetAsBytes,
      sigShares
    );
    // console.log("raw sig", signature);
    console.log(
      "final signature is ",
      LitJsSdk.uint8arrayToString(signature, "base16")
    );
  });
};

const testEcdsaSigning = async () => {
  const bytes = fs.readFileSync("./ecdsaFunctionTest.js");
  const encodedJs = bytes.toString("base64");

  console.log("encodedJs", encodedJs);

  const basePort = 7470;
  const promises = [];

  for (let i = 0; i < 10; i++) {
    const url = `http://127.0.0.1:${basePort + i}/web/execute`;
    promises.push(axios.post(url, { js_base64: encodedJs }));
  }

  const responses = await Promise.all(promises);

  const signatureShares = responses.map((res) => res.data);
  // sort the sig shares by share index.  this is important when combining the shares for BLS
  signatureShares.sort((a, b) => a.shareIndex - b.shareIndex);

  const sigShares = signatureShares.map((s) => ({
    shareHex: s.signatureShare,
    shareIndex: s.shareIndex,
    localX: s.localX,
    localY: s.localY,
    publicKey: s.publicKey,
  }));
  console.log("sigShares", sigShares);

  // R_x & R_y values can come from any node (they will be different per node), and will generate a valid signature
  const R_x = sigShares[0].localX;
  const R_y = sigShares[0].localY;
  // the public key can come from any node - it obviously will be identical from each node
  const public_key = sigShares[0].publicKey;
  const valid_shares = sigShares.map((s) => s.shareHex);
  const shares = JSON.stringify(valid_shares);
  console.log("shares is", shares);
  await LitJsSdk.wasmECDSA.initWasmEcdsaSdk(); // init WASM
  const signature = LitJsSdk.wasmECDSA.combine_signature(R_x, R_y, shares);
  console.log("raw ecdsav sig", signature);
};

const testTxnSigning = async () => {
  const bytes = fs.readFileSync("./build/signTxnTest.js");
  const encodedJs = bytes.toString("base64");

  console.log("encodedJs", encodedJs);

  const basePort = 7470;
  const promises = [];

  for (let i = 0; i < 10; i++) {
    const url = `http://127.0.0.1:${basePort + i}/web/execute`;
    promises.push(axios.post(url, { js_base64: encodedJs }));
  }

  const responses = await Promise.all(promises);

  const signatureShares = responses.map((res) => res.data);
  // sort the sig shares by share index.  this is important when combining the shares for BLS
  signatureShares.sort((a, b) => a.shareIndex - b.shareIndex);

  const sigShares = signatureShares.map((s) => ({
    shareHex: s.signatureShare,
    shareIndex: s.shareIndex,
    localX: s.localX,
    localY: s.localY,
    publicKey: s.publicKey,
    dataSigned: s.dataSigned,
  }));
  console.log("sigShares", sigShares);

  // R_x & R_y values can come from any node (they will be different per node), and will generate a valid signature
  const R_x = sigShares[0].localX;
  const R_y = sigShares[0].localY;
  const dataSigned = sigShares[0].dataSigned;
  // the public key can come from any node - it obviously will be identical from each node
  const public_key = sigShares[0].publicKey;
  const valid_shares = sigShares.map((s) => s.shareHex);
  const shares = JSON.stringify(valid_shares);
  console.log("shares is", shares);
  await LitJsSdk.wasmECDSA.initWasmEcdsaSdk(); // init WASM
  const sig = JSON.parse(
    LitJsSdk.wasmECDSA.combine_signature(R_x, R_y, shares)
  );

  const encodedSig = `0x${sig.r}${sig.s}${(sig.recid + 27).toString(16)}`;
  console.log("encodedSig", encodedSig);

  const txParams = {
    nonce: "0x0",
    gasPrice: "0x2e90edd000", // 200 gwei
    gasLimit: "0x" + (30000).toString(16), // 30k gas limit should be enough.  only need 21k to send.
    to: "0x50e2dac5e78B5905CB09495547452cEE64426db2",
    value: "0x" + (10000).toString(16),
    chainId: 137,
  };

  const txn = serialize(txParams, encodedSig);

  console.log("txn", txn);
};

// testBlsSigning();
// testEcdsaSigning();
testTxnSigning();
