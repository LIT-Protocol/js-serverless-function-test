import * as LitJsSdk from "@lit-protocol/lit-node-client";

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

// you need an AuthSig to auth with the nodes
// normally you would obtain an AuthSig by calling LitJsSdk.checkAndSignAuthMessage({chain})
const authSig = {
  sig: "0x2bdede6164f56a601fc17a8a78327d28b54e87cf3fa20373fca1d73b804566736d76efe2dd79a4627870a50e66e1a9050ca333b6f98d9415d8bca424980611ca1c",
  derivedVia: "web3.eth.personal.sign",
  signedMessage:
    "localhost wants you to sign in with your Ethereum account:\n0x9D1a5EC58232A894eBFcB5e466E3075b23101B89\n\nThis is a key for Partiful\n\nURI: https://localhost/login\nVersion: 1\nChain ID: 1\nNonce: 1LF00rraLO4f7ZSIt\nIssued At: 2022-06-03T05:59:09.959Z",
  address: "0x9D1a5EC58232A894eBFcB5e466E3075b23101B89",
};

const runLitAction = async () => {
  const litNodeClient = new LitJsSdk.LitNodeClient({
    litNetwork: "serrano",
  });
  await litNodeClient.connect();
  const signatures = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    jsParams: {
      publicKey:
        "048444afc2a0f32dfa1b62b46a0e75822e5de9663118d96a02aacd82651b9aed3e33c37ac12ab9c0c80d255b3a37bad26440931f59973d34ce918a213495b6ee99",
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
      authSig: {
        sig: "0x2bdede6164f56a601fc17a8a78327d28b54e87cf3fa20373fca1d73b804566736d76efe2dd79a4627870a50e66e1a9050ca333b6f98d9415d8bca424980611ca1c",
        derivedVia: "web3.eth.personal.sign",
        signedMessage:
          "localhost wants you to sign in with your Ethereum account:\n0x9D1a5EC58232A894eBFcB5e466E3075b23101B89\n\nThis is a key for Partiful\n\nURI: https://localhost/login\nVersion: 1\nChain ID: 1\nNonce: 1LF00rraLO4f7ZSIt\nIssued At: 2022-06-03T05:59:09.959Z",
        address: "0x9D1a5EC58232A894eBFcB5e466E3075b23101B89",
      },
      chain: "ethereum",
    },
  });
  console.log("signatures: ", signatures);
};

runLitAction();
