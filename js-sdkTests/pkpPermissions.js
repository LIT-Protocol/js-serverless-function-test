import LitJsSdk from "lit-js-sdk/build/index.node.js";

// this code will be run on the node
const litActionCode = `
const go = async () => {
  const results = {}
  const tokenId = Lit.Actions.pubkeyToTokenId({publicKey})
  results.tokenId = tokenId

  // let's lookup some permissions
  const isPermittedAction = await Lit.Actions.isPermittedAction({tokenId, ipfsId: "QmRwN9GKHvCn4Vk7biqtr6adjXMs7PzzYPCzNCRjPFiDjm"})
  results.isPermittedAction = isPermittedAction

  const isPermittedAddress = await Lit.Actions.isPermittedAddress({tokenId, address: Lit.Auth.authSigAddress})
  results.isPermittedAddress = isPermittedAddress

  const userId = uint8arrayFromString("testing", "utf8")
  const isPermittedAuthMethod = await Lit.Actions.isPermittedAuthMethod({tokenId, authMethodType: "2", userId })
  results.isPermittedAuthMethod = isPermittedAuthMethod

  const permittedActions = await Lit.Actions.getPermittedActions({tokenId})
  results.permittedActions = permittedActions

  const permittedAddresses = await Lit.Actions.getPermittedAddresses({tokenId})
  results.permittedAddresses = permittedAddresses

  const permittedAuthMethods = await Lit.Actions.getPermittedAuthMethods({tokenId})
  results.permittedAuthMethods = JSON.stringify(permittedAuthMethods)

  Lit.Actions.setResponse({response: JSON.stringify(results)})
};

go();
`;

// you need an AuthSig to auth with the nodes
// normally you would obtain an AuthSig by calling LitJsSdk.checkAndSignAuthMessage({chain})
const authSig = {
  sig: "0x2bdede6164f56a601fc17a8a78327d28b54e87cf3fa20373fca1d73b804566736d76efe2dd79a4627870a50e66e1a9050ca333b6f98d9415d8bca424980611ca1c",
  derivedVia: "web3.eth.personal.sign",
  signedMessage:
    "localhost wants you to sign in with your Ethereum account:\n0x9D1a5EC58232A894eBFcB5e466E3075b23101B89\n\nThis is a key for Partiful\n\nURI: https://localhost/login\nVersion: 1\nChain ID: 1\nNonce: 1LF00rraLO4f7ZSIt\nIssued At: 2022-06-03T05:59:09.959Z",
  address: "0x9D1a5EC58232A894eBFcB5e466E3075b23101B89",
};

const runLitAction = async () => {
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: "mumbai",
    debug: true,
  });
  await litNodeClient.connect();
  const results = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      publicKey:
        "0x040899db7f6a80c12bafd97abf7f5794206775f1ec0b1b9917bcbae8d0594e17961458c7d99ab73015128a9adb65393a5941b30051c80fadc9f28ae19b5d7c7aa5",
    },
  });
  console.log("results: ", results);
};

runLitAction();
