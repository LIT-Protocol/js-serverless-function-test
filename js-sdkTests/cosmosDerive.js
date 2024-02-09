import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { pubkeyToAddress } from "@cosmjs/amino";
import secp256k1 from "secp256k1";


const deriveAddress = async () => {
  let pubkey =
    "0404e12210c57f81617918a5b783e51b6133790eb28a79f141df22519fb97977d2a681cc047f9f1a9b533df480eb2d816fb36606bd7c716e71a179efd53d2a55d1";
  pubkey = secp256k1.publicKeyConvert(
    LitJsSdk.uint8arrayFromString(pubkey, "base16"),
    true
  );
  console.log(
    "compressed pubkey: ",
    LitJsSdk.uint8arrayToString(pubkey, "base16")
  );
  pubkey = LitJsSdk.uint8arrayToString(pubkey, "base64");
  console.log("pubkey base64: ", pubkey);

  pubkey = {
    type: "tendermint/PubKeySecp256k1",
    value: pubkey, //"A08EGB7ro1ORuFhjOnZcSgwYlpe0DSFjVNUIkNNQxwKQ",
  };

  const addressChainA = pubkeyToAddress(pubkey, "achain");
  console.log("addressChainA: ", addressChainA);

};

deriveAddress();
