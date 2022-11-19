import { ethers } from "ethers";
import fs from "fs";

export async function mintPKP() {
  const litContractAddresses = JSON.parse(
    fs.readFileSync("./abis/deployed-contracts.json")
  );

  const provider = new ethers.providers.JsonRpcProvider(
    process.env.LIT_MUMBAI_RPC_URL
  );

  const signer = new ethers.Wallet(
    process.env.LIT_MUMBAI_DEPLOYER_PRIVATE_KEY,
    provider
  );

  const pkpNftJson = JSON.parse(fs.readFileSync("./abis/PKPNFT.json"));
  const pkpContract = new ethers.Contract(
    litContractAddresses.pkpNftContractAddress,
    pkpNftJson.abi,
    signer
  );

  const pkpPermissionsJson = JSON.parse(
    fs.readFileSync("./abis/PKPPermissions.json")
  );
  const pkpPermissionsContract = new ethers.Contract(
    litContractAddresses.pkpPermissionsContractAddress,
    pkpPermissionsJson.abi,
    signer
  );

  // just to see how many PKPs there are that can be minted.  it returned like 900 something
  // so we probably don't need to check this anytime soon so that's why it's commented out.
  // const unmintedPKPs = await pkpContract.getUnmintedRoutedTokenIdCount(2);
  // console.log("unmintedPKPs", unmintedPKPs);

  console.log("getting mint cost...");
  const mintCost = await pkpContract.mintCost();
  console.log("mintCost is ", mintCost.toString());

  const mintTx = await pkpContract.mintNext(2, { value: mintCost });
  console.log("mintTx hash", mintTx.hash);
  const mintingReceipt = await mintTx.wait();
  const tokenIdFromEvent = mintingReceipt.events[1].topics[3];
  console.log("tokenId is ", tokenIdFromEvent);

  const pkpPublicKey = await pkpContract.getPubkey(tokenIdFromEvent);

  // let the 0x9D1a5EC58232A894eBFcB5e466E3075b23101B89 use it
  const grantTx = await pkpPermissionsContract.addPermittedAddress(
    tokenIdFromEvent,
    "0x9D1a5EC58232A894eBFcB5e466E3075b23101B89",
    []
  );
  console.log("grantTx hash", grantTx.hash);
  const grantReceipt = await grantTx.wait();

  console.log(
    `Minting and granting complete.  PKP public key is ${pkpPublicKey} and Token ID is ${tokenIdFromEvent}`
  );

  return { publicKey: pkpPublicKey, tokenId: tokenIdFromEvent };
}
