import { serialize, computeAddress } from "@ethersproject/transactions";
import { arrayify } from "@ethersproject/bytes";
import { keccak256 } from "js-sha3";

console.log("running!");

// NOTE: to replace with a new one that you get from oauth-pkp-signup-example
const pkp = {
  "status": "Succeeded",
  "pkpEthAddress": "0xfD3ed51076CF91570cC345d48FA5C411FCE96B72",
  "pkpPublicKey": "04944c839a484c29573250cc4e1f8f560938b371d0b47ded359683f5fe2c0de9bbc3c9d812d69317928a2fdd4b125d2436a33dddbe5417ec66c29adb60482a570b"
};

const toAddress = "0x535b0dABaF59c90EeeBEf272b5F778C5369a1445"; // J Labs test account
const chainId = 80001; // Polygon Mumbai Testnet
const publicKey = pkp.pkpPublicKey;

const go = async () => {
  const fromAddress = computeAddress(publicKey);
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
    publicKey,
    sigName: "sig1",
  });
  console.log("sig: ", sig);
};

go();
