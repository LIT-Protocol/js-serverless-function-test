import { createJWS, EllipticSigner } from "did-jwt";
import { RPCError, createHandler } from "rpc-utils";
import stringify from "fast-json-stable-stringify";
import * as u8a from "uint8arrays";
import { ec as EC } from "elliptic";
const ec = new EC("secp256k1");
function toStableObject(obj) {
  return JSON.parse(stringify(obj));
}
export function encodeDID(secretKey) {
  const pubBytes = ec.keyFromPrivate(secretKey).getPublic(true, "array");
  const bytes = new Uint8Array(pubBytes.length + 2);
  bytes[0] = 0xe7; // secp256k1 multicodec
  // The multicodec is encoded as a varint so we need to add this.
  // See js-multicodec for a general implementation
  bytes[1] = 0x01;
  bytes.set(pubBytes, 2);
  return `did:key:z${u8a.toString(bytes, "base58btc")}`;
}
const didMethods = {
  did_authenticate: ({ did }, params) => {
    return { did, paths: params.paths };
  },
  did_createJWS: async ({ did, secretKey }, params) => {
    const requestDid = params.did.split("#")[0];
    if (requestDid !== did) throw new RPCError(4100, `Unknown DID: ${did}`);
    const pubkey = did.split(":")[2];
    const kid = `${did}#${pubkey}`;
    const signer = EllipticSigner(u8a.toString(secretKey, "base16"));
    const header = toStableObject(
      Object.assign(params.protected || {}, { kid })
    );
    const jws = await createJWS(toStableObject(params.payload), signer, header);
    return { jws };
  },
  did_decryptJWE: () => {
    throw new RPCError(4100, "Decryption not supported");
  },
};
export class Secp256k1Provider {
  constructor(secretKey) {
    const did = encodeDID(secretKey);
    const handler = createHandler(didMethods);
    this._handle = (msg) => {
      return handler({ did, secretKey }, msg);
    };
  }
  get isDidProvider() {
    return true;
  }
  async send(msg) {
    return await this._handle(msg);
  }
}
