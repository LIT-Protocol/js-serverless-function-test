# Workflows

This is a preliminary spec for a new feature called "Workflows" that we are going to add to Lit. Workflows are a way to run a series of Lit Actions across all the nodes in a deterministic way. None of the code below will work until we implement Workflows.

# Main Idea

Everyone wants to decrypt, sign, and broadcast in a lit action, but this requires that the nodes are able to:

1. Collect signature / decryption shares and combine them
2. Run something only once, on only one node, and broadcast the results to the other nodes, where they wait until they’ve collected the results

# PoC Code

Below are some example Lit Actions that would use Workflows, showing the various functions we intend to create. These include:

- decryptAndCombine()
  - Runs decryption across the nodes, and combines the shares, and returns the decrypted thing
- signAndCombineEcdsa()
  - Runs signing across the nodes, and combines the shares, and returns the signature
- runOnce()
  - Runs something on only one node. Can return a value by broadcasting it to all nodes.
- sendTxn()
  - Sends a txn to a chain
- broadcastAndCollect()
  - Sends a value to all the nodes, and collects values from all the nodes. The result is an array of the values from all the other nodes.

### Sign and send a txn to chain

```js
const sigName = "sig1";
let txn = {
  to: "0x1234",
  value: 1000000000000000,
  gas: 21000,
  gasPrice: 20000000000,
  nonce: 0,
};
const toSign = serializeTxnForSigning(txn);
const signature = await Lit.Actions.signAndCombineEcdsa({
  toSign,
  publicKey,
  sigName,
});

// this specific block of code could be abstracted away with something like "Lit.Actions.sendTxnOnce()"
await Lit.Actions.runOnce({ waitForResponse: false, name: "txnSender" }, () => {
  // the code in the block will only be run once
  const signedTxn = serializeTxnForSending(txn, sigShare);
  Lit.Actions.sendTxn({ chain: "ethereum", signedTxn });
});
```

### Decrypt a local wallet, then sign and send a txn to chain

```js
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
```

### Decrypt, sign with the threshold key, and then send a txn to a chain

```js
const toSign = await Lit.Actions.decryptAndCombine({
  accessControlConditions,
  ciphertext,
  dataToEncryptHash,
  authSig,
  chain: "ethereum",
});
const signature = await Lit.Actions.signAndCombineEcdsa({
  toSign,
  publicKey,
  sigName,
});
await Lit.Actions.runOnce({ waitForResponse: false, name: "txnSender" }, () => {
  // the code in the block will only be run once
  const signedTxn = serializeTxnForSending(toSign, signature);
  Lit.Actions.sendTxn({ chain: "ethereum", signedTxn });
});
```

### Get a value once (on one node) and then have all the nodes sign it, and return the signature shares to the user

```js
let temperature = await Lit.Actions.runOnce(
  { waitForResponse: true },
  async () => {
    const url = "https://api.weather.gov/gridpoints/TOP/31,80/forecast";
    const resp = await fetch(url).then((response) => response.json());
    const temp = resp.properties.periods[0].temperature;
    return temp;
  }
);
const sigShare = await Lit.Actions.signEcdsa({ toSign, publicKey, sigName });
```

### Broadcast and collect with Medianizer

```js
const url = "https://api.weather.gov/gridpoints/TOP/31,80/forecast";
const resp = await fetch(url).then((response) => response.json());
const temp = resp.properties.periods[0].temperature;

const temperatures = await Lit.Actions.broadcastAndCollect({
  name: "temperature",
  value: temp,
});

// at this point, temperatures is an array of all the values that all the nodes got
const median = temperatures.sort()[Math.floor(temperatures.length / 2)];

// the signature shares will be returned to the user and they will be combined client side to the user
await Lit.Actions.signEcdsa({ toSign: median, publicKey, sigName: "sig1" });
```

# How it works under the hood

Ideally we use GRPC for this, and this just becomes another type of p2p message in our system. When the user requests a signature or decryption, this process is kicked off, and then all the signature shares are produced by each node and sent to all nodes. All nodes then combine the shares and create the final signature or decryption. At this point, the signature or decrypted data is available to all the nodes.

Additionally, we will create a new JS binding in Lit Actions, called Lit.Actions.runOnce(). runOnce() takes a function as a parameter, and all the nodes use a deterministic algorithm to choose which node will run the function that is passed to runOnce. This single node runs the function, and then broadcasts the result to all the other nodes. Therefore, it’s possible for runOnce() to return a value, and the runOnce() function should be a JS async function. After runOnce() has happened, it can be assumed that all the nodes have access to the same value, which is the return value to the runOnce() promise.
