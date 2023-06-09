import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { serialize, recoverAddress } from "@ethersproject/transactions";
import {
  splitSignature,
  joinSignature,
  arrayify
} from "@ethersproject/bytes";
import { recoverPublicKey, computePublicKey } from "@ethersproject/signing-key";
import { ethers } from "ethers";

// this code will be run on the node
// cid for the bundled `build/signTxnTest.js`
// to update run `yarn build`, upload to ipfs, and replace this cid.
let ipfsCID = "Qmf9kGzSrNSki5DvgWs4G8FFyHMKhK7jJqHRptGosQo9NJ";

const go = async () => {
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    minNodeCount: 6,
    debug: true,
    litNetwork: "serrano",
  });
  await litNodeClient.connect();
  
  // you need an AuthSig to auth with the nodes
  // normally you would obtain an AuthSig by calling LitJsSdk.checkAndSignAuthMessage({chain})
  // NOTE: to replace with a new one that you get from oauth-pkp-signup-example
  const authSig = {
    "sig": "0x18720b54cf0d29d618a90793d5e76f4838f04b559b02f1f01568d8e81c26ae9536e11bb90ad311b79a5bc56149b14103038e5e03fee83931a146d93d150eb0f61c",
    "derivedVia": "web3.eth.personal.sign",
    "signedMessage": "localhost wants you to sign in with your Ethereum account:\n0x1cD4147AF045AdCADe6eAC4883b9310FD286d95a\n\nThis is a test statement.  You can put anything you want here.\n\nURI: https://localhost/login\nVersion: 1\nChain ID: 1\nNonce: gzdlw7mR57zMcGFzz\nIssued At: 2022-04-15T22:58:44.754Z",
    "address": "0x1cD4147AF045AdCADe6eAC4883b9310FD286d95a"
  }

  const results = await litNodeClient.executeJs({
    ipfsId: ipfsCID,
    authSig,
    jsParams: {},
  });
  console.log("results", results);
  const { signatures, response } = results;
  console.log("response", response);
  const sig = signatures.sig1;
  const { dataSigned } = sig;
  const encodedSig = joinSignature({
    r: "0x" + sig.r,
    s: "0x" + sig.s,
    v: sig.recid,
  });

  const { txParams } = response;

  console.log("encodedSig", encodedSig);
  console.log("sig length in bytes: ", encodedSig.substring(2).length / 2);
  console.log("dataSigned", dataSigned);
  let dataSginedBytes = arrayify('0x' + dataSigned)
  const splitSig = splitSignature(encodedSig);
  console.log("splitSig", splitSig);

  const recoveredPubkey = recoverPublicKey(dataSginedBytes, encodedSig);
  console.log("uncompressed recoveredPubkey", recoveredPubkey);

  const compressedRecoveredPubkey = computePublicKey(recoveredPubkey, true);
  console.log("compressed recoveredPubkey", compressedRecoveredPubkey);
  const recoveredAddress = recoverAddress(dataSginedBytes, encodedSig);
  console.log("recoveredAddress", recoveredAddress);

  const txn = serialize(txParams, encodedSig);

  console.log("txn", txn);

  // broadcast txn
  const provider = new ethers.providers.JsonRpcProvider(
    // process.env.LIT_MUMBAI_RPC_URL
    "https://rpc.ankr.com/polygon_mumbai"
  );
  const result = await provider.sendTransaction(txn);
  console.log("broadcast txn result:", JSON.stringify(result, null, 4));
};

go();
