console.log("running!");

// test BLS
const arr = [65, 65, 65];
const sig = Deno.core.opSync("op_sign_bls", arr);
console.log("sig: ", sig);
