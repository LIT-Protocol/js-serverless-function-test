// automated tests that run on the node
import { authSig } from "./globals.js";
import { mintPKP } from "./utils.js";

import basicSign from "./tests/basicSign.js";
import denoPermissions from "./tests/denoPermissions.js";

import LitJsSdk from "lit-js-sdk/build/index.node.js";

(async function () {
  const tests = [{ basicSign }, { denoPermissions }];

  const litNodeClient = new LitJsSdk.LitNodeClient({
    litNetwork: "localhost",
    debug: false,
  });
  await litNodeClient.connect();

  // mint a PKP
  const pkp = await mintPKP();

  // this could prob be paralelleized with Promise.all
  for (let i = 0; i < tests.length; i++) {
    const testName = Object.keys(tests[i])[0];
    console.log(`Running test: ${testName}`);
    const test = tests[i][testName];
    try {
      const res = await test.test({
        litNodeClient,
        authSig,
        publicKey: pkp.publicKey,
      });
      tests[i].results = res;
    } catch (e) {
      console.log(`error running test: ${testName}`, e);
      tests[i].results = { success: false, message: e.message };
    }
  }

  let allTestsPass = true;
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    if (!test.results.success) {
      allTestsPass = false;
      console.log("test failed: ", test);
    }
  }

  if (allTestsPass) {
    console.log("Success!  All tests pass!");
  } else {
    console.log("Tests failed");
  }
})();
