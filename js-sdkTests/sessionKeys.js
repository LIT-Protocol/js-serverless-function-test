// this example will generate and sign a session key and use it for a request
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { Wallet } from "@ethersproject/wallet";
import { computeAddress } from "@ethersproject/transactions";
import { SiweMessage } from "siwe";
import { getAuthSig, getPkp } from "../utils.js";
import { LitActionResource, LitAbility } from '@lit-protocol/auth-helpers';

// this code will be run on the node
const litActionCode = `
const go = async () => {
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the response from the node
  // and combined into a full signature by the LitJsSdk for you to use on the client
  // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
  const sigShare = await LitActions.signEcdsa({ toSign, publicKey, sigName });
};

go();
`;


const runLitAction = async () => {
  // mock a wallet
  const wallet = new Wallet(process.env.LIT_ROLLUP_MAINNET_DEPLOYER_PRIVATE_KEY);

  const authSig = await getAuthSig();
  const publicKey = await getPkp();
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: "cayenne",
    debug: true,
  });
  await litNodeClient.connect();

  // when the getSessionSigs function is called, it will generate a session key and sign it
  // using this function. the session key will be used for all requests until the session expires
  let authNeededCallback = async ({ chain, resources, expiration, uri }) => {
    const domain = "localhost:3000";
    const message = new SiweMessage({
      domain,
      address: wallet.address,
      statement: "Sign a session key to use with Lit Protocol",
      uri,
      version: "1",
      chainId: "1",
      expirationTime: expiration,
      resources,
    });
    const toSign = message.prepareMessage();
    const signature = await wallet.signMessage(toSign);

    const authSig = {
      sig: signature,
      derivedVia: "web3.eth.personal.sign",
      signedMessage: toSign,
      address: wallet.address,
    };

    return authSig;
  };

  const litResource = new LitActionResource(
    "*"
  );

  let sessionSigs = await litNodeClient.getSessionSigs({
    resourceAbilityRequests: [
      {
        resource: litResource,
        ability: LitAbility.LitActionExecution
      }
    ],
    chain: "ethereum",
    authNeededCallback,
  });

  // console.log("got sessionSigs: ", sessionSigs);

  const results = await litNodeClient.executeJs({
    code: litActionCode,
    sessionSigs,
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      toSign: [65, 208, 164, 167, 229, 220, 187, 13, 166, 2, 199, 95, 102, 221, 126, 115, 126, 3, 246, 254, 177, 16, 113, 222, 120, 95, 209, 63, 254, 29, 52, 240],
      publicKey,
      sigName: "sig1",
    },
  });
  console.log("results: ", results);
};

runLitAction();
