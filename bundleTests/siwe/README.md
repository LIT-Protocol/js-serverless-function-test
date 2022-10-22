This example shows how to bundle the SIWE package to create a SIWE signature inside a Lit Action. You can run this example by running the following command from the root of the repository:

```
yarn run siweNodeSide
```

This will bundle toBundle.js into bundled.js, and then run siwe.js which will load bundled.js and run it as a Lit Action.

This example shows how you can create a bundle with esbuild to run in a Lit Action, and use the ethers package provided by the Lit Nodes, which you can see is defined in esbuild-shims.js

You can also use SIWE by creating the message to be signed on the client side, and then sending the message to the Lit Node to sign. You can see an example of this in the js-sdkTests/siwe.js file which can be run using `yarn run sideClientSide`.
