// no need to import ethers, it's automatically injected on the lit node side
// import { ethers } from 'ethers';

import { SiweMessage } from "siwe";

const domain = "localhost:3000";
const origin = "http://localhost:3000";

function createSiweMessage(address, statement) {
  const message = new SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: "1",
    chainId: "1",
    nonce, // provided as a jsParam global
    issuedAt, // provided as a jsParam global
  });
  return message.prepareMessage();
}

const go = async () => {
  let ethAddress = ethers.utils.computeAddress(publicKey);

  let toSign = createSiweMessage(
    ethAddress,
    "Sign in with Ethereum with your PKP"
  );

  await Lit.Actions.ethPersonalSignMessageEcdsa({
    message: toSign,
    publicKey,
    sigName: "siweSig",
  });

  Lit.Actions.setResponse({
    response: JSON.stringify({ ethAddress, toSign }),
  });
};

go();
