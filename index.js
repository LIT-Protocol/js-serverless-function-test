console.log("running fetch test");

const go = async () => {
  let data = await fetch(
    "https://ipfs.litgateway.com/ipfs/QmNiDrDnTiSo4y78qKwaZboq8KfT9Y3CRrnM7pfUmG1EFq"
  ).then((response) => response.json());
  console.log("data: " + JSON.stringify(data, null, 2));
};

go();
console.log(
  "sync code is done running.  now we are waiting for promises in the event loop"
);
