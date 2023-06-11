import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { serialize, recoverAddress } from "@ethersproject/transactions";
import { splitSignature, joinSignature, arrayify } from "@ethersproject/bytes";
import { Wallet, verifyMessage } from "@ethersproject/wallet";
import { recoverPublicKey, computePublicKey } from "@ethersproject/signing-key";
import { ethers } from "ethers";
import * as siwe from "siwe";

// this code will be run on the node
// cid for the bundled `build/signTxnTest.js`
// to update run `yarn build`, upload to ipfs, and replace this cid.
let ipfsCID = "Qmf9kGzSrNSki5DvgWs4G8FFyHMKhK7jJqHRptGosQo9NJ";

// this code will be run on the node
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
  const authSig = await generateAuthsig(
    "localhost",
    "http://localhost:3000",
    "175177" // chronicle chain id
  );

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
  let dataSginedBytes = arrayify("0x" + dataSigned);
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

export async function generateAuthsig(domain, origin, chainId) {
  const privKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

  const wallet = new Wallet(privKey);

  const statement = "";

  const expiration = new Date(
    Date.now() + 1000 * 60 * 60 * 24 * 7
  ).toISOString();
  const siweMessage = new siwe.SiweMessage({
    domain,
    address: wallet.address,
    statement,
    uri: origin,
    version: "1",
    chainId: chainId,
    expirationTime: expiration,
  });

  const messageToSign = siweMessage.prepareMessage();

  const signature = await wallet.signMessage(messageToSign);

  const recoveredAddress = verifyMessage(messageToSign, signature);

  const authSig = {
    sig: signature,
    derivedVia: "web3.eth.personal.sign",
    signedMessage: messageToSign,
    address: recoveredAddress,
  };

  return authSig;
}

go();
