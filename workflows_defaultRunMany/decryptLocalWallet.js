// this will reach out to all the nodes, ask them to help decrypt, then combine the decryption shares
const walletPrivateKey = await Lit.Actions.decryptAndCombine({
  accessControlConditions,
  ciphertext,
  dataToEncryptHash,
  authSig,
  chain: "ethereum",
});
await Lit.Actions.runOnce(
  { waitForResponse: false, name: "txnSender" },
  async () => {
    // the code in the block will only be run once on one node
    const rpcUrl = await Lit.Actions.getRpcUrl({ chain: "ethereum" });
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const ethersWallet = new ethers.Wallet(walletPrivateKey).connect(provider);
    const tx = await ethersWallet.sendTransaction({
      to: "chrisc.eth",
      value: ethers.utils.parseEther("1.0"),
    });
    Lit.Actions.setResponse({
      response: JSON.stringify({ success: true, txHash: tx.hash }),
    });
  }
);
