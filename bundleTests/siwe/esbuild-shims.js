// the Lit nodes inject ethers for us, so this fixes SIWE so that it uses the built in ethers provided by the Lit nodes.
globalThis.require = (name) => {
  if (name === "ethers") {
    return ethers;
  }
  throw new Error("unknown module " + name);
};
