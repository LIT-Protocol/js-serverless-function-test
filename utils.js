import { ethers } from "ethers";
import siwe from "siwe";

export const getAuthSig = async () => {
    // put your private key into this env var
    const privateKey = process.env.LIT_ROLLUP_MAINNET_DEPLOYER_PRIVATE_KEY;
    const wallet = new ethers.Wallet(privateKey);
    const address = await wallet.getAddress();

    // Craft the SIWE message
    const domain = "localhost";
    const origin = "https://localhost/login";
    const statement =
        "This is a test statement.  You can put anything you want here.";
    const siweMessage = new siwe.SiweMessage({
        domain,
        address: address,
        statement,
        uri: origin,
        version: "1",
        chainId: 1,
        expirationTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    });
    const messageToSign = siweMessage.prepareMessage();

    // Sign the message and format the authSig
    const signature = await wallet.signMessage(messageToSign);

    const authSig = {
        sig: signature,
        derivedVia: "web3.eth.personal.sign",
        signedMessage: messageToSign,
        address: address,
    };

    return authSig;
};

export const getPkp = async () => {
    // put a PKP public key here
    return "045d14eed3ffcec93b8db682e422ac10efcd8be5423e3e03e9f76896ba90831f0ab5d033e07717173c8ddc9d4daee747dd251ae719330b76cd1f5742fbefb0e8be"
}