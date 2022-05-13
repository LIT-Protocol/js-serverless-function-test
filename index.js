console.log("running!");

const arr = [65, 65, 65];
const sig = Deno.core.opSync("op_sign_bls", arr);
console.log("sig: ", sig);

const go = async () => {
  let data = await fetch(
    "https://ipfs.litgateway.com/ipfs/QmNiDrDnTiSo4y78qKwaZboq8KfT9Y3CRrnM7pfUmG1EFq"
  ).then((response) => response.json());
  console.log("data: " + JSON.stringify(data, null, 2));
};

go();
