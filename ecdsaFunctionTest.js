console.log("running!");

const go = async () => {
  const arr = [65, 65, 65, 65]; // this is the string "AAA" for testing
  const sig = await Deno.core.opAsync("op_sign_ecdsa", arr);
  console.log("sig: ", sig);
};

go();
