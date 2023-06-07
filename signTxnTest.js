import { serialize, computeAddress } from "@ethersproject/transactions";
import { arrayify } from "@ethersproject/bytes";
import { keccak256 } from "js-sha3";

console.log("running!");

// NOTE: to replace with a new one that you get from oauth-pkp-signup-example
const pkp = {
  "status": "Succeeded",
  "pkpEthAddress": "0xfF8A9000a9866561dad7596f3342Fec18e8130d1",
  "pkpPublicKey": "0x04cb229885d49c49559c3a45c91adae12ecf5b578412d666991a6f31b647b96327b82f719aa755e08c0432d25a234774908bb795c06778aa4b5900d21a7f4a7495"
};

const toAddress = "0x535b0dABaF59c90EeeBEf272b5F778C5369a1445"; // J Labs test account
const chainId = 80001; // Polygon Mumbai Testnet
const publicKey = pkp.pkpEthAddress;

const go = async () => {
  const fromAddress = publicKey;
  // get latest nonce
  const latestNonce = await Lit.Actions.getLatestNonce({
    address: fromAddress,
    chain: "mumbai",
  });

  const txParams = {
    nonce: latestNonce,
    gasPrice: "0x2e90edd000", // 200 gwei
    gasLimit: "0x" + (30000).toString(16), // 30k gas limit should be enough.  only need 21k to send.
    to: toAddress,
    value: "0x" + (10000000).toString(16),
    chainId,
  };
  
  Lit.Actions.setResponse({ response: JSON.stringify({ txParams }) });

  const serializedTx = serialize(txParams);
  console.log("serializedTx", serializedTx);

  const rlpEncodedTxn = arrayify(serializedTx);
  console.log("rlpEncodedTxn: ", rlpEncodedTxn);

  // const unsignedTxn = arrayify("0x" + keccak256(rlpEncodedTxn));
  // console.log("unsignedTxn: ", unsignedTxn);

  const unsignedTxn = keccak256.digest(rlpEncodedTxn);
  console.log("unsignedTxn: ", unsignedTxn);

  const toSign = unsignedTxn; //[65, 65, 65]; // this is the string "AAA" for testing
  const sig = await LitActions.signEcdsa({
    toSign,
    publicKey: pkp.pkpPublicKey,
    sigName: "sig1",
  });
  console.log("sig: ", sig);
};

go();
