// this code will be run on the node
const litActionCodeEnvTest = `
const go = async () => {
  let env = Deno.env.toObject();
  Lit.Actions.setResponse({response: JSON.stringify({env})})
};
go();
`;

const litActionCodeProcTest = `
const go = async () => {
  const proc = Deno.run({ cmd: ["whoami"] });
  Lit.Actions.setResponse({response: JSON.stringify({ proc })})
};
go();
`;

const litActionCodeFileReadTest = `
const go = async () => {
  const conf = await Deno.readTextFile("./config/lit_config0.env");
  Lit.Actions.setResponse({response: JSON.stringify({ conf })})
};

go();
`;

const litActionCodeFileWriteTest = `
const go = async () => {
  await Deno.writeTextFile("./test.txt", "test");
  Lit.Actions.setResponse({response: JSON.stringify({ "writeSuccess": true })})
};

go();
`;

async function test({ litNodeClient, publicKey, authSig }) {
  // ok so we actually want this to FAIL.  if this doesn't throw an exception and we
  // get results back, then it means deno is not locked down and we are in big trouble

  // try the ENV Var test first
  try {
    const results = await litNodeClient.executeJs({
      code: litActionCodeEnvTest,
      authSig,
      // all jsParams can be used anywhere in your litActionCode
      jsParams: {},
    });
    // console.log("results: ", results);
    let { response } = results;
    if (response.env.length !== 0) {
      return {
        success: false,
        message: `Deno permissions test failed.  It should have generated an exception and it didn't.  Specifically, it looks like we have access to the environment variables.  This is bad.`,
      };
    }
  } catch (e) {
    // console.log("error: ", e);
    const { message } = e;
    if (
      !message.includes(
        "Error executing JS: PermissionDenied: Requires env access to all, run again with the --allow-env flag"
      )
    ) {
      console.log("Error trying to access ENV: ", e);
      return {
        success: false,
        message:
          "We did not get the error message we expected when trying to access the ENV",
      };
    }
  }

  // try the Proc test
  try {
    const results = await litNodeClient.executeJs({
      code: litActionCodeProcTest,
      authSig,
      // all jsParams can be used anywhere in your litActionCode
      jsParams: {},
    });
    // console.log("results: ", results);
    let { response } = results;
    if (response.proc.length !== 0) {
      return {
        success: false,
        message: `Deno permissions test failed.  It should have generated an exception and it didn't.  Specifically, it looks like we have access to run processes.  This is bad.`,
      };
    }
  } catch (e) {
    // console.log("error: ", e);
    const { message } = e;
    if (
      !message.includes(
        'Error executing JS: PermissionDenied: Requires run access to "whoami", run again with the --allow-run flag'
      )
    ) {
      console.log("Error trying to run a process: ", e);
      return {
        success: false,
        message:
          "We did not get the error message we expected when trying to run a process",
      };
    }
  }

  try {
    const results = await litNodeClient.executeJs({
      code: litActionCodeFileReadTest,
      authSig,
      // all jsParams can be used anywhere in your litActionCode
      jsParams: {},
    });
    // console.log("results: ", results);
    let { response } = results;
    if (response.conf.length !== 0) {
      return {
        success: false,
        message: `Deno permissions test failed.  It should have generated an exception and it didn't.  Specifically, it looks like we have access to read files.  This is bad.`,
      };
    }
  } catch (e) {
    // console.log("error: ", e);
    const { message } = e;
    if (
      !message.includes(
        'Error executing JS: PermissionDenied: Requires read access to "./config/lit_config0.env", run again with the --allow-read flag'
      )
    ) {
      console.log("Error trying to read from the filesystem: ", e);
      return {
        success: false,
        message:
          "We did not get the error message we expected when trying to access the ENV",
      };
    }
  }

  try {
    const results = await litNodeClient.executeJs({
      code: litActionCodeFileWriteTest,
      authSig,
      // all jsParams can be used anywhere in your litActionCode
      jsParams: {},
    });
    // console.log("results: ", results);
    let { response } = results;
    if (response.writeSuccess) {
      return {
        success: false,
        message: `Deno permissions test failed.  It should have generated an exception and it didn't.  Specifically, it looks like we have access to write files.  This is bad.`,
      };
    }
  } catch (e) {
    // console.log("error: ", e);
    const { message } = e;
    if (
      !message.includes(
        'Error executing JS: PermissionDenied: Requires write access to "./test.txt", run again with the --allow-write flag'
      )
    ) {
      console.log("Error trying to read from the filesystem: ", e);
      return {
        success: false,
        message:
          "We did not get the error message we expected when trying to access the ENV",
      };
    }
  }

  return { success: true };
}

export default { test };
