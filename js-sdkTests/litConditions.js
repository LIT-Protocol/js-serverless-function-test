import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { getAuthSig, getPkp } from "../utils.js";

// this code will be run on the node
const litActionCode = `
const go = async () => {
  const conditions = [
    {
      contractAddress: "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612",
      functionName: "latestAnswer",
      functionParams: [],
      functionAbi: {
        inputs: [],
        name: 'latestAnswer',
        outputs: [{ internalType: 'uint256', name: 'price', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      chain: "arbitrum",
      returnValueTest: {
        key: "price",
        comparator: ">=",
        value: "180017000000",
      },
    },
    { operator: "and" },
    {
        contractAddress: "0x50834F3163758fcC1Df9973b6e91f0F0F0434aD3",
        functionName: "latestAnswer",
        functionParams: [],
        functionAbi: {
          inputs: [],
          name: 'latestAnswer',
          outputs: [{ internalType: 'uint256', name: 'price', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
        chain: "arbitrum",
        returnValueTest: {
          key: "price",
          comparator: ">=",
          value: "99000000",
        },
      },
      { operator: "and" },
      {
        contractAddress: "0x50834F3163758fcC1Df9973b6e91f0F0F0434aD3",
        functionName: "latestAnswer",
        functionParams: [],
        functionAbi: {
          inputs: [],
          name: 'latestAnswer',
          outputs: [{ internalType: 'uint256', name: 'price', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
        chain: "arbitrum",
        returnValueTest: {
          key: "price",
          comparator: "<=",
          value: "101000000",
        },
      },
  ];
  const testResult = await Lit.Actions.checkConditions({
    conditions,
    authSig,
    chain: 'arbitrum',
  });
  console.log('Price Exceeds 1800 and USDC is Stable: ', testResult);
  if (testResult) {
    const sigShare = await LitActions.ethPersonalSignMessageEcdsa({
      message,
      publicKey,
      sigName,
    });
    LitActions.setResponse({
      response: JSON.stringify({
        success: true,
      }),
    });
  } else {
    LitActions.setResponse({
      response: JSON.stringify({
        success: false,
      }),
    });
  }
};
go();
`;


const runLitAction = async () => {
  const authSig = await getAuthSig();
  const publicKey = await getPkp();
  const litNodeClient = new LitJsSdk.LitNodeClient({
    litNetwork: "cayenne",
  });
  await litNodeClient.connect();
  const signatures = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    jsParams: {
      publicKey,
      conditions: [
        {
          conditionType: "evmBasic",
          contractAddress: "",
          standardContractType: "",
          chain: "ethereum",
          method: "eth_getBalance",
          parameters: [":userAddress", "latest"],
          returnValueTest: {
            comparator: ">=",
            value: "0",
          },
        },
      ],
      authSig,
      chain: "ethereum",
      message: "Hello, world!",
      sigName: "sig1",
    },
  });
  console.log("signatures: ", signatures);
};

runLitAction();
