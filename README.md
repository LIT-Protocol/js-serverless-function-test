# Lit Action Examples

All the useful examples in this repo are in the js-sdkTests folder. 


Note: many of these examples are broken and use the V2 SDK.  Some examples have been fixed to use the new V3 SDK.

Examples that are confirmed to be working with V3 are listed below:
* nesting.js - Shows how to use Lit.Actions.call() to run child Lit Actions
* params.js - Shows how to pass params in the `jsParams` key when running lit actions and how to use the params in a lit action
* authContext.js - Shows how to log your auth context so you can see what's inside it.  Note that this example requires a access token or JWT from some auth method - Sign in With Google, or Sign in with Apple, for example.  If you run this out of the box, you should see a "Apple JWT expired" error because the included JWT is expired.
* consoleAndResponse.js - Shows how to see console.log in your response, and how to set your "response" key in the response itself
* cosmosDerive.js - Derive a cosmos wallet address from a PKP public key
* decrypt.js - Use a Lit Action as an access control condition.  Encrypt a string, and only allow it to be decrypted if a Lit Action returns true.
* derivedIpfsId.js - Shows how you can pass in some code string, and the nodes will still derive the IPFS ID for that code string as if you passed in an IPFS ID instead.  This is useful for a few reasons: You don't have to pin your code to IPFS to run it, but you can still add permitted Lit Actions to a PKP with the derived IPFS ID, even though the code never actually lives on IPFS.  This also lets you have "private lit actions" since the lit action code is never pinned to IPFS, and the communication channel between the user and the nodes is fully encrypted (aka, node operators can't see the code that gets run).
* ethers.js - Shows how to use the built in ethers v5 package that is included by default in the Lit Action runtime
* fetch.js - Shows how to fetch inside a lit action and use the response to conditionally sign
* getLatestNonce.js - Shows how to get the latest nonce for a wallet on any EVM chain supported by Lit
* sign.js - Shows how to sign something using a PKP.  Very basic example.
* signFromIpfs.js - Shows how to sign something but using an IPFS lit action instead of passing the code in.
* jsonwebtoken.js - Shows how to use the built in JWT library to decode a JWT in a lit action, and verify it.  Note that this example requires a JWT from Sign in with Google to run properly.  If you run it out of the box, you should see a "TokenExpiredError: jwt expired" error because the included JWT is expired.
* litConditions.js - Shows how to use Lit Access Control Conditions inside your Lit Action.  This can be used to gate signing based on some access control conditions you define.  The example checks a bunch of contracts on Arbitrum to decide whether or not to sign a message.
* multipleSigs.js - Shows how to sign more than 1 item in a lit action.  Note: the data you're signing MUST be different.  If you try to sign the same data twice in a lit action, it will fail.
* personalSign.js - Shows how to use the ethPersonalSignMessageEcdsa() function inside a Lit Action to sign a message (not a txn)
* pkpPermissions.js - Shows how to get and return PKP Permissions from inside a lit action
* sessionKeys.js - Shows how to use session sigs with lit actions
* signMsgAndCheckRecovery.js - Shows how to sign a message and then recovery the address from the signature on the client side.




Broken examples:
* decryptInLitAction.js - This is not working yet, don't use this example.  This is for a future feature
* signRawAndCheckRecovery.js
* signTxn.js
* signTxnFromIPFS.js
* simpleConsole.js
* simpleResponse.js
* siwe.js
* walletlessSign.js


More docs and info are here: https://getlit.dev
