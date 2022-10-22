var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

// esbuild-shims.js
var init_esbuild_shims = __esm({
  "esbuild-shims.js"() {
    globalThis.require = (name) => {
      if (name === "ethers") {
        return ethers;
      }
      throw new Error("unknown module " + name);
    };
  }
});

// ../../node_modules/@stablelib/random/lib/source/browser.js
var require_browser = __commonJS({
  "../../node_modules/@stablelib/random/lib/source/browser.js"(exports) {
    "use strict";
    init_esbuild_shims();
    Object.defineProperty(exports, "__esModule", { value: true });
    var QUOTA = 65536;
    var BrowserRandomSource = function() {
      function BrowserRandomSource2() {
        this.isAvailable = false;
        this.isInstantiated = false;
        var browserCrypto = typeof self !== "undefined" ? self.crypto || self.msCrypto : null;
        if (browserCrypto && browserCrypto.getRandomValues) {
          this._crypto = browserCrypto;
          this.isAvailable = true;
          this.isInstantiated = true;
        }
      }
      BrowserRandomSource2.prototype.randomBytes = function(length) {
        if (!this.isAvailable || !this._crypto) {
          throw new Error("Browser random byte generator is not available.");
        }
        var out = new Uint8Array(length);
        for (var i = 0; i < out.length; i += QUOTA) {
          this._crypto.getRandomValues(out.subarray(i, i + Math.min(out.length - i, QUOTA)));
        }
        return out;
      };
      return BrowserRandomSource2;
    }();
    exports.BrowserRandomSource = BrowserRandomSource;
  }
});

// ../../node_modules/@stablelib/wipe/lib/wipe.js
var require_wipe = __commonJS({
  "../../node_modules/@stablelib/wipe/lib/wipe.js"(exports) {
    "use strict";
    init_esbuild_shims();
    Object.defineProperty(exports, "__esModule", { value: true });
    function wipe(array) {
      for (var i = 0; i < array.length; i++) {
        array[i] = 0;
      }
      return array;
    }
    exports.wipe = wipe;
  }
});

// ../../node_modules/@stablelib/random/lib/source/node.js
var require_node = __commonJS({
  "../../node_modules/@stablelib/random/lib/source/node.js"(exports) {
    "use strict";
    init_esbuild_shims();
    Object.defineProperty(exports, "__esModule", { value: true });
    var wipe_1 = require_wipe();
    var NodeRandomSource = function() {
      function NodeRandomSource2() {
        this.isAvailable = false;
        this.isInstantiated = false;
        if (typeof require !== "undefined") {
          var nodeCrypto = require("crypto");
          if (nodeCrypto && nodeCrypto.randomBytes) {
            this._crypto = nodeCrypto;
            this.isAvailable = true;
            this.isInstantiated = true;
          }
        }
      }
      NodeRandomSource2.prototype.randomBytes = function(length) {
        if (!this.isAvailable || !this._crypto) {
          throw new Error("Node.js random byte generator is not available.");
        }
        var buffer = this._crypto.randomBytes(length);
        if (buffer.length !== length) {
          throw new Error("NodeRandomSource: got fewer bytes than requested");
        }
        var out = new Uint8Array(length);
        for (var i = 0; i < out.length; i++) {
          out[i] = buffer[i];
        }
        wipe_1.wipe(buffer);
        return out;
      };
      return NodeRandomSource2;
    }();
    exports.NodeRandomSource = NodeRandomSource;
  }
});

// ../../node_modules/@stablelib/random/lib/source/system.js
var require_system = __commonJS({
  "../../node_modules/@stablelib/random/lib/source/system.js"(exports) {
    "use strict";
    init_esbuild_shims();
    Object.defineProperty(exports, "__esModule", { value: true });
    var browser_1 = require_browser();
    var node_1 = require_node();
    var SystemRandomSource = function() {
      function SystemRandomSource2() {
        this.isAvailable = false;
        this.name = "";
        this._source = new browser_1.BrowserRandomSource();
        if (this._source.isAvailable) {
          this.isAvailable = true;
          this.name = "Browser";
          return;
        }
        this._source = new node_1.NodeRandomSource();
        if (this._source.isAvailable) {
          this.isAvailable = true;
          this.name = "Node";
          return;
        }
      }
      SystemRandomSource2.prototype.randomBytes = function(length) {
        if (!this.isAvailable) {
          throw new Error("System random byte generator is not available.");
        }
        return this._source.randomBytes(length);
      };
      return SystemRandomSource2;
    }();
    exports.SystemRandomSource = SystemRandomSource;
  }
});

// ../../node_modules/@stablelib/int/lib/int.js
var require_int = __commonJS({
  "../../node_modules/@stablelib/int/lib/int.js"(exports) {
    "use strict";
    init_esbuild_shims();
    Object.defineProperty(exports, "__esModule", { value: true });
    function imulShim(a, b) {
      var ah = a >>> 16 & 65535, al = a & 65535;
      var bh = b >>> 16 & 65535, bl = b & 65535;
      return al * bl + (ah * bl + al * bh << 16 >>> 0) | 0;
    }
    exports.mul = Math.imul || imulShim;
    function add(a, b) {
      return a + b | 0;
    }
    exports.add = add;
    function sub(a, b) {
      return a - b | 0;
    }
    exports.sub = sub;
    function rotl(x, n) {
      return x << n | x >>> 32 - n;
    }
    exports.rotl = rotl;
    function rotr(x, n) {
      return x << 32 - n | x >>> n;
    }
    exports.rotr = rotr;
    function isIntegerShim(n) {
      return typeof n === "number" && isFinite(n) && Math.floor(n) === n;
    }
    exports.isInteger = Number.isInteger || isIntegerShim;
    exports.MAX_SAFE_INTEGER = 9007199254740991;
    exports.isSafeInteger = function(n) {
      return exports.isInteger(n) && (n >= -exports.MAX_SAFE_INTEGER && n <= exports.MAX_SAFE_INTEGER);
    };
  }
});

// ../../node_modules/@stablelib/binary/lib/binary.js
var require_binary = __commonJS({
  "../../node_modules/@stablelib/binary/lib/binary.js"(exports) {
    "use strict";
    init_esbuild_shims();
    Object.defineProperty(exports, "__esModule", { value: true });
    var int_1 = require_int();
    function readInt16BE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      return (array[offset + 0] << 8 | array[offset + 1]) << 16 >> 16;
    }
    exports.readInt16BE = readInt16BE;
    function readUint16BE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      return (array[offset + 0] << 8 | array[offset + 1]) >>> 0;
    }
    exports.readUint16BE = readUint16BE;
    function readInt16LE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      return (array[offset + 1] << 8 | array[offset]) << 16 >> 16;
    }
    exports.readInt16LE = readInt16LE;
    function readUint16LE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      return (array[offset + 1] << 8 | array[offset]) >>> 0;
    }
    exports.readUint16LE = readUint16LE;
    function writeUint16BE(value, out, offset) {
      if (out === void 0) {
        out = new Uint8Array(2);
      }
      if (offset === void 0) {
        offset = 0;
      }
      out[offset + 0] = value >>> 8;
      out[offset + 1] = value >>> 0;
      return out;
    }
    exports.writeUint16BE = writeUint16BE;
    exports.writeInt16BE = writeUint16BE;
    function writeUint16LE(value, out, offset) {
      if (out === void 0) {
        out = new Uint8Array(2);
      }
      if (offset === void 0) {
        offset = 0;
      }
      out[offset + 0] = value >>> 0;
      out[offset + 1] = value >>> 8;
      return out;
    }
    exports.writeUint16LE = writeUint16LE;
    exports.writeInt16LE = writeUint16LE;
    function readInt32BE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      return array[offset] << 24 | array[offset + 1] << 16 | array[offset + 2] << 8 | array[offset + 3];
    }
    exports.readInt32BE = readInt32BE;
    function readUint32BE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      return (array[offset] << 24 | array[offset + 1] << 16 | array[offset + 2] << 8 | array[offset + 3]) >>> 0;
    }
    exports.readUint32BE = readUint32BE;
    function readInt32LE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      return array[offset + 3] << 24 | array[offset + 2] << 16 | array[offset + 1] << 8 | array[offset];
    }
    exports.readInt32LE = readInt32LE;
    function readUint32LE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      return (array[offset + 3] << 24 | array[offset + 2] << 16 | array[offset + 1] << 8 | array[offset]) >>> 0;
    }
    exports.readUint32LE = readUint32LE;
    function writeUint32BE(value, out, offset) {
      if (out === void 0) {
        out = new Uint8Array(4);
      }
      if (offset === void 0) {
        offset = 0;
      }
      out[offset + 0] = value >>> 24;
      out[offset + 1] = value >>> 16;
      out[offset + 2] = value >>> 8;
      out[offset + 3] = value >>> 0;
      return out;
    }
    exports.writeUint32BE = writeUint32BE;
    exports.writeInt32BE = writeUint32BE;
    function writeUint32LE(value, out, offset) {
      if (out === void 0) {
        out = new Uint8Array(4);
      }
      if (offset === void 0) {
        offset = 0;
      }
      out[offset + 0] = value >>> 0;
      out[offset + 1] = value >>> 8;
      out[offset + 2] = value >>> 16;
      out[offset + 3] = value >>> 24;
      return out;
    }
    exports.writeUint32LE = writeUint32LE;
    exports.writeInt32LE = writeUint32LE;
    function readInt64BE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      var hi = readInt32BE(array, offset);
      var lo = readInt32BE(array, offset + 4);
      return hi * 4294967296 + lo - (lo >> 31) * 4294967296;
    }
    exports.readInt64BE = readInt64BE;
    function readUint64BE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      var hi = readUint32BE(array, offset);
      var lo = readUint32BE(array, offset + 4);
      return hi * 4294967296 + lo;
    }
    exports.readUint64BE = readUint64BE;
    function readInt64LE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      var lo = readInt32LE(array, offset);
      var hi = readInt32LE(array, offset + 4);
      return hi * 4294967296 + lo - (lo >> 31) * 4294967296;
    }
    exports.readInt64LE = readInt64LE;
    function readUint64LE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      var lo = readUint32LE(array, offset);
      var hi = readUint32LE(array, offset + 4);
      return hi * 4294967296 + lo;
    }
    exports.readUint64LE = readUint64LE;
    function writeUint64BE(value, out, offset) {
      if (out === void 0) {
        out = new Uint8Array(8);
      }
      if (offset === void 0) {
        offset = 0;
      }
      writeUint32BE(value / 4294967296 >>> 0, out, offset);
      writeUint32BE(value >>> 0, out, offset + 4);
      return out;
    }
    exports.writeUint64BE = writeUint64BE;
    exports.writeInt64BE = writeUint64BE;
    function writeUint64LE(value, out, offset) {
      if (out === void 0) {
        out = new Uint8Array(8);
      }
      if (offset === void 0) {
        offset = 0;
      }
      writeUint32LE(value >>> 0, out, offset);
      writeUint32LE(value / 4294967296 >>> 0, out, offset + 4);
      return out;
    }
    exports.writeUint64LE = writeUint64LE;
    exports.writeInt64LE = writeUint64LE;
    function readUintBE(bitLength, array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      if (bitLength % 8 !== 0) {
        throw new Error("readUintBE supports only bitLengths divisible by 8");
      }
      if (bitLength / 8 > array.length - offset) {
        throw new Error("readUintBE: array is too short for the given bitLength");
      }
      var result = 0;
      var mul = 1;
      for (var i = bitLength / 8 + offset - 1; i >= offset; i--) {
        result += array[i] * mul;
        mul *= 256;
      }
      return result;
    }
    exports.readUintBE = readUintBE;
    function readUintLE(bitLength, array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      if (bitLength % 8 !== 0) {
        throw new Error("readUintLE supports only bitLengths divisible by 8");
      }
      if (bitLength / 8 > array.length - offset) {
        throw new Error("readUintLE: array is too short for the given bitLength");
      }
      var result = 0;
      var mul = 1;
      for (var i = offset; i < offset + bitLength / 8; i++) {
        result += array[i] * mul;
        mul *= 256;
      }
      return result;
    }
    exports.readUintLE = readUintLE;
    function writeUintBE(bitLength, value, out, offset) {
      if (out === void 0) {
        out = new Uint8Array(bitLength / 8);
      }
      if (offset === void 0) {
        offset = 0;
      }
      if (bitLength % 8 !== 0) {
        throw new Error("writeUintBE supports only bitLengths divisible by 8");
      }
      if (!int_1.isSafeInteger(value)) {
        throw new Error("writeUintBE value must be an integer");
      }
      var div = 1;
      for (var i = bitLength / 8 + offset - 1; i >= offset; i--) {
        out[i] = value / div & 255;
        div *= 256;
      }
      return out;
    }
    exports.writeUintBE = writeUintBE;
    function writeUintLE(bitLength, value, out, offset) {
      if (out === void 0) {
        out = new Uint8Array(bitLength / 8);
      }
      if (offset === void 0) {
        offset = 0;
      }
      if (bitLength % 8 !== 0) {
        throw new Error("writeUintLE supports only bitLengths divisible by 8");
      }
      if (!int_1.isSafeInteger(value)) {
        throw new Error("writeUintLE value must be an integer");
      }
      var div = 1;
      for (var i = offset; i < offset + bitLength / 8; i++) {
        out[i] = value / div & 255;
        div *= 256;
      }
      return out;
    }
    exports.writeUintLE = writeUintLE;
    function readFloat32BE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
      return view.getFloat32(offset);
    }
    exports.readFloat32BE = readFloat32BE;
    function readFloat32LE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
      return view.getFloat32(offset, true);
    }
    exports.readFloat32LE = readFloat32LE;
    function readFloat64BE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
      return view.getFloat64(offset);
    }
    exports.readFloat64BE = readFloat64BE;
    function readFloat64LE(array, offset) {
      if (offset === void 0) {
        offset = 0;
      }
      var view = new DataView(array.buffer, array.byteOffset, array.byteLength);
      return view.getFloat64(offset, true);
    }
    exports.readFloat64LE = readFloat64LE;
    function writeFloat32BE(value, out, offset) {
      if (out === void 0) {
        out = new Uint8Array(4);
      }
      if (offset === void 0) {
        offset = 0;
      }
      var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
      view.setFloat32(offset, value);
      return out;
    }
    exports.writeFloat32BE = writeFloat32BE;
    function writeFloat32LE(value, out, offset) {
      if (out === void 0) {
        out = new Uint8Array(4);
      }
      if (offset === void 0) {
        offset = 0;
      }
      var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
      view.setFloat32(offset, value, true);
      return out;
    }
    exports.writeFloat32LE = writeFloat32LE;
    function writeFloat64BE(value, out, offset) {
      if (out === void 0) {
        out = new Uint8Array(8);
      }
      if (offset === void 0) {
        offset = 0;
      }
      var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
      view.setFloat64(offset, value);
      return out;
    }
    exports.writeFloat64BE = writeFloat64BE;
    function writeFloat64LE(value, out, offset) {
      if (out === void 0) {
        out = new Uint8Array(8);
      }
      if (offset === void 0) {
        offset = 0;
      }
      var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
      view.setFloat64(offset, value, true);
      return out;
    }
    exports.writeFloat64LE = writeFloat64LE;
  }
});

// ../../node_modules/@stablelib/random/lib/random.js
var require_random = __commonJS({
  "../../node_modules/@stablelib/random/lib/random.js"(exports) {
    "use strict";
    init_esbuild_shims();
    Object.defineProperty(exports, "__esModule", { value: true });
    var system_1 = require_system();
    var binary_1 = require_binary();
    var wipe_1 = require_wipe();
    exports.defaultRandomSource = new system_1.SystemRandomSource();
    function randomBytes(length, prng) {
      if (prng === void 0) {
        prng = exports.defaultRandomSource;
      }
      return prng.randomBytes(length);
    }
    exports.randomBytes = randomBytes;
    function randomUint32(prng) {
      if (prng === void 0) {
        prng = exports.defaultRandomSource;
      }
      var buf = randomBytes(4, prng);
      var result = binary_1.readUint32LE(buf);
      wipe_1.wipe(buf);
      return result;
    }
    exports.randomUint32 = randomUint32;
    var ALPHANUMERIC = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    function randomString(length, charset, prng) {
      if (charset === void 0) {
        charset = ALPHANUMERIC;
      }
      if (prng === void 0) {
        prng = exports.defaultRandomSource;
      }
      if (charset.length < 2) {
        throw new Error("randomString charset is too short");
      }
      if (charset.length > 256) {
        throw new Error("randomString charset is too long");
      }
      var out = "";
      var charsLen = charset.length;
      var maxByte = 256 - 256 % charsLen;
      while (length > 0) {
        var buf = randomBytes(Math.ceil(length * 256 / maxByte), prng);
        for (var i = 0; i < buf.length && length > 0; i++) {
          var randomByte = buf[i];
          if (randomByte < maxByte) {
            out += charset.charAt(randomByte % charsLen);
            length--;
          }
        }
        wipe_1.wipe(buf);
      }
      return out;
    }
    exports.randomString = randomString;
    function randomStringForEntropy(bits, charset, prng) {
      if (charset === void 0) {
        charset = ALPHANUMERIC;
      }
      if (prng === void 0) {
        prng = exports.defaultRandomSource;
      }
      var length = Math.ceil(bits / (Math.log(charset.length) / Math.LN2));
      return randomString(length, charset, prng);
    }
    exports.randomStringForEntropy = randomStringForEntropy;
  }
});

// ../../node_modules/apg-js/src/apg-lib/identifiers.js
var require_identifiers = __commonJS({
  "../../node_modules/apg-js/src/apg-lib/identifiers.js"(exports, module2) {
    init_esbuild_shims();
    module2.exports = {
      ALT: 1,
      CAT: 2,
      REP: 3,
      RNM: 4,
      TRG: 5,
      TBS: 6,
      TLS: 7,
      UDT: 11,
      AND: 12,
      NOT: 13,
      BKR: 14,
      BKA: 15,
      BKN: 16,
      ABG: 17,
      AEN: 18,
      ACTIVE: 100,
      MATCH: 101,
      EMPTY: 102,
      NOMATCH: 103,
      SEM_PRE: 200,
      SEM_POST: 201,
      SEM_OK: 300,
      SEM_SKIP: 301,
      ATTR_N: 400,
      ATTR_R: 401,
      ATTR_MR: 402,
      LOOKAROUND_NONE: 500,
      LOOKAROUND_AHEAD: 501,
      LOOKAROUND_BEHIND: 502,
      BKR_MODE_UM: 601,
      BKR_MODE_PM: 602,
      BKR_MODE_CS: 603,
      BKR_MODE_CI: 604
    };
  }
});

// ../../node_modules/apg-js/src/apg-lib/style.js
var require_style = __commonJS({
  "../../node_modules/apg-js/src/apg-lib/style.js"(exports, module2) {
    init_esbuild_shims();
    module2.exports = {
      CLASS_MONOSPACE: "apg-mono",
      CLASS_ACTIVE: "apg-active",
      CLASS_EMPTY: "apg-empty",
      CLASS_MATCH: "apg-match",
      CLASS_NOMATCH: "apg-nomatch",
      CLASS_LOOKAHEAD: "apg-lh-match",
      CLASS_LOOKBEHIND: "apg-lb-match",
      CLASS_REMAINDER: "apg-remainder",
      CLASS_CTRLCHAR: "apg-ctrl-char",
      CLASS_LINEEND: "apg-line-end",
      CLASS_ERROR: "apg-error",
      CLASS_PHRASE: "apg-phrase",
      CLASS_EMPTYPHRASE: "apg-empty-phrase",
      CLASS_STATE: "apg-state",
      CLASS_STATS: "apg-stats",
      CLASS_TRACE: "apg-trace",
      CLASS_GRAMMAR: "apg-grammar",
      CLASS_RULES: "apg-rules",
      CLASS_RULESLINK: "apg-rules-link",
      CLASS_ATTRIBUTES: "apg-attrs"
    };
  }
});

// ../../node_modules/apg-js/src/apg-conv-api/transformers.js
var require_transformers = __commonJS({
  "../../node_modules/apg-js/src/apg-conv-api/transformers.js"(exports) {
    init_esbuild_shims();
    "use strict;";
    var thisThis = exports;
    var NON_SHORTEST = 4294967292;
    var TRAILING = 4294967293;
    var RANGE = 4294967294;
    var ILL_FORMED = 4294967295;
    var mask = [0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023];
    var ascii = [
      "00",
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "0A",
      "0B",
      "0C",
      "0D",
      "0E",
      "0F",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "1A",
      "1B",
      "1C",
      "1D",
      "1E",
      "1F",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "2A",
      "2B",
      "2C",
      "2D",
      "2E",
      "2F",
      "30",
      "31",
      "32",
      "33",
      "34",
      "35",
      "36",
      "37",
      "38",
      "39",
      "3A",
      "3B",
      "3C",
      "3D",
      "3E",
      "3F",
      "40",
      "41",
      "42",
      "43",
      "44",
      "45",
      "46",
      "47",
      "48",
      "49",
      "4A",
      "4B",
      "4C",
      "4D",
      "4E",
      "4F",
      "50",
      "51",
      "52",
      "53",
      "54",
      "55",
      "56",
      "57",
      "58",
      "59",
      "5A",
      "5B",
      "5C",
      "5D",
      "5E",
      "5F",
      "60",
      "61",
      "62",
      "63",
      "64",
      "65",
      "66",
      "67",
      "68",
      "69",
      "6A",
      "6B",
      "6C",
      "6D",
      "6E",
      "6F",
      "70",
      "71",
      "72",
      "73",
      "74",
      "75",
      "76",
      "77",
      "78",
      "79",
      "7A",
      "7B",
      "7C",
      "7D",
      "7E",
      "7F",
      "80",
      "81",
      "82",
      "83",
      "84",
      "85",
      "86",
      "87",
      "88",
      "89",
      "8A",
      "8B",
      "8C",
      "8D",
      "8E",
      "8F",
      "90",
      "91",
      "92",
      "93",
      "94",
      "95",
      "96",
      "97",
      "98",
      "99",
      "9A",
      "9B",
      "9C",
      "9D",
      "9E",
      "9F",
      "A0",
      "A1",
      "A2",
      "A3",
      "A4",
      "A5",
      "A6",
      "A7",
      "A8",
      "A9",
      "AA",
      "AB",
      "AC",
      "AD",
      "AE",
      "AF",
      "B0",
      "B1",
      "B2",
      "B3",
      "B4",
      "B5",
      "B6",
      "B7",
      "B8",
      "B9",
      "BA",
      "BB",
      "BC",
      "BD",
      "BE",
      "BF",
      "C0",
      "C1",
      "C2",
      "C3",
      "C4",
      "C5",
      "C6",
      "C7",
      "C8",
      "C9",
      "CA",
      "CB",
      "CC",
      "CD",
      "CE",
      "CF",
      "D0",
      "D1",
      "D2",
      "D3",
      "D4",
      "D5",
      "D6",
      "D7",
      "D8",
      "D9",
      "DA",
      "DB",
      "DC",
      "DD",
      "DE",
      "DF",
      "E0",
      "E1",
      "E2",
      "E3",
      "E4",
      "E5",
      "E6",
      "E7",
      "E8",
      "E9",
      "EA",
      "EB",
      "EC",
      "ED",
      "EE",
      "EF",
      "F0",
      "F1",
      "F2",
      "F3",
      "F4",
      "F5",
      "F6",
      "F7",
      "F8",
      "F9",
      "FA",
      "FB",
      "FC",
      "FD",
      "FE",
      "FF"
    ];
    var base64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".split("");
    var base64codes = [];
    base64chars.forEach((char) => {
      base64codes.push(char.charCodeAt(0));
    });
    exports.utf8 = {
      encode(chars) {
        const bytes = [];
        chars.forEach((char) => {
          if (char >= 0 && char <= 127) {
            bytes.push(char);
          } else if (char <= 2047) {
            bytes.push(192 + (char >> 6 & mask[5]));
            bytes.push(128 + (char & mask[6]));
          } else if (char < 55296 || char > 57343 && char <= 65535) {
            bytes.push(224 + (char >> 12 & mask[4]));
            bytes.push(128 + (char >> 6 & mask[6]));
            bytes.push(128 + (char & mask[6]));
          } else if (char >= 65536 && char <= 1114111) {
            const u = char >> 16 & mask[5];
            bytes.push(240 + (u >> 2));
            bytes.push(128 + ((u & mask[2]) << 4) + (char >> 12 & mask[4]));
            bytes.push(128 + (char >> 6 & mask[6]));
            bytes.push(128 + (char & mask[6]));
          } else {
            throw new RangeError(`utf8.encode: character out of range: char: ${char}`);
          }
        });
        return Buffer.from(bytes);
      },
      decode(buf, bom) {
        function bytes2(b12, b2) {
          if ((b2 & 192) !== 128) {
            return TRAILING;
          }
          const x = ((b12 & mask[5]) << 6) + (b2 & mask[6]);
          if (x < 128) {
            return NON_SHORTEST;
          }
          return x;
        }
        function bytes3(b12, b2, b3) {
          if ((b3 & 192) !== 128 || (b2 & 192) !== 128) {
            return TRAILING;
          }
          const x = ((b12 & mask[4]) << 12) + ((b2 & mask[6]) << 6) + (b3 & mask[6]);
          if (x < 2048) {
            return NON_SHORTEST;
          }
          if (x >= 55296 && x <= 57343) {
            return RANGE;
          }
          return x;
        }
        function bytes4(b12, b2, b3, b4) {
          if ((b4 & 192) !== 128 || (b3 & 192) !== 128 || (b2 & 192) !== 128) {
            return TRAILING;
          }
          const x = (((b12 & mask[3]) << 2) + (b2 >> 4 & mask[2]) << 16) + ((b2 & mask[4]) << 12) + ((b3 & mask[6]) << 6) + (b4 & mask[6]);
          if (x < 65536) {
            return NON_SHORTEST;
          }
          if (x > 1114111) {
            return RANGE;
          }
          return x;
        }
        let c;
        let b1;
        let i1;
        let i2;
        let i3;
        let inc;
        const len = buf.length;
        let i = bom ? 3 : 0;
        const chars = [];
        while (i < len) {
          b1 = buf[i];
          c = ILL_FORMED;
          const TRUE = true;
          while (TRUE) {
            if (b1 >= 0 && b1 <= 127) {
              c = b1;
              inc = 1;
              break;
            }
            i1 = i + 1;
            if (i1 < len && b1 >= 194 && b1 <= 223) {
              c = bytes2(b1, buf[i1]);
              inc = 2;
              break;
            }
            i2 = i + 2;
            if (i2 < len && b1 >= 224 && b1 <= 239) {
              c = bytes3(b1, buf[i1], buf[i2]);
              inc = 3;
              break;
            }
            i3 = i + 3;
            if (i3 < len && b1 >= 240 && b1 <= 244) {
              c = bytes4(b1, buf[i1], buf[i2], buf[i3]);
              inc = 4;
              break;
            }
            break;
          }
          if (c > 1114111) {
            const at = `byte[${i}]`;
            if (c === ILL_FORMED) {
              throw new RangeError(`utf8.decode: ill-formed UTF8 byte sequence found at: ${at}`);
            }
            if (c === TRAILING) {
              throw new RangeError(`utf8.decode: illegal trailing byte found at: ${at}`);
            }
            if (c === RANGE) {
              throw new RangeError(`utf8.decode: code point out of range found at: ${at}`);
            }
            if (c === NON_SHORTEST) {
              throw new RangeError(`utf8.decode: non-shortest form found at: ${at}`);
            }
            throw new RangeError(`utf8.decode: unrecognized error found at: ${at}`);
          }
          chars.push(c);
          i += inc;
        }
        return chars;
      }
    };
    exports.utf16be = {
      encode(chars) {
        const bytes = [];
        let char;
        let h;
        let l;
        for (let i = 0; i < chars.length; i += 1) {
          char = chars[i];
          if (char >= 0 && char <= 55295 || char >= 57344 && char <= 65535) {
            bytes.push(char >> 8 & mask[8]);
            bytes.push(char & mask[8]);
          } else if (char >= 65536 && char <= 1114111) {
            l = char - 65536;
            h = 55296 + (l >> 10);
            l = 56320 + (l & mask[10]);
            bytes.push(h >> 8 & mask[8]);
            bytes.push(h & mask[8]);
            bytes.push(l >> 8 & mask[8]);
            bytes.push(l & mask[8]);
          } else {
            throw new RangeError(`utf16be.encode: UTF16BE value out of range: char[${i}]: ${char}`);
          }
        }
        return Buffer.from(bytes);
      },
      decode(buf, bom) {
        if (buf.length % 2 > 0) {
          throw new RangeError(`utf16be.decode: data length must be even multiple of 2: length: ${buf.length}`);
        }
        const chars = [];
        const len = buf.length;
        let i = bom ? 2 : 0;
        let j = 0;
        let c;
        let inc;
        let i1;
        let i3;
        let high;
        let low;
        while (i < len) {
          const TRUE = true;
          while (TRUE) {
            i1 = i + 1;
            if (i1 < len) {
              high = (buf[i] << 8) + buf[i1];
              if (high < 55296 || high > 57343) {
                c = high;
                inc = 2;
                break;
              }
              i3 = i + 3;
              if (i3 < len) {
                low = (buf[i + 2] << 8) + buf[i3];
                if (high <= 56319 && low >= 56320 && low <= 57343) {
                  c = 65536 + (high - 55296 << 10) + (low - 56320);
                  inc = 4;
                  break;
                }
              }
            }
            throw new RangeError(`utf16be.decode: ill-formed UTF16BE byte sequence found: byte[${i}]`);
          }
          chars[j++] = c;
          i += inc;
        }
        return chars;
      }
    };
    exports.utf16le = {
      encode(chars) {
        const bytes = [];
        let char;
        let h;
        let l;
        for (let i = 0; i < chars.length; i += 1) {
          char = chars[i];
          if (char >= 0 && char <= 55295 || char >= 57344 && char <= 65535) {
            bytes.push(char & mask[8]);
            bytes.push(char >> 8 & mask[8]);
          } else if (char >= 65536 && char <= 1114111) {
            l = char - 65536;
            h = 55296 + (l >> 10);
            l = 56320 + (l & mask[10]);
            bytes.push(h & mask[8]);
            bytes.push(h >> 8 & mask[8]);
            bytes.push(l & mask[8]);
            bytes.push(l >> 8 & mask[8]);
          } else {
            throw new RangeError(`utf16le.encode: UTF16LE value out of range: char[${i}]: ${char}`);
          }
        }
        return Buffer.from(bytes);
      },
      decode(buf, bom) {
        if (buf.length % 2 > 0) {
          throw new RangeError(`utf16le.decode: data length must be even multiple of 2: length: ${buf.length}`);
        }
        const chars = [];
        const len = buf.length;
        let i = bom ? 2 : 0;
        let j = 0;
        let c;
        let inc;
        let i1;
        let i3;
        let high;
        let low;
        while (i < len) {
          const TRUE = true;
          while (TRUE) {
            i1 = i + 1;
            if (i1 < len) {
              high = (buf[i1] << 8) + buf[i];
              if (high < 55296 || high > 57343) {
                c = high;
                inc = 2;
                break;
              }
              i3 = i + 3;
              if (i3 < len) {
                low = (buf[i3] << 8) + buf[i + 2];
                if (high <= 56319 && low >= 56320 && low <= 57343) {
                  c = 65536 + (high - 55296 << 10) + (low - 56320);
                  inc = 4;
                  break;
                }
              }
            }
            throw new RangeError(`utf16le.decode: ill-formed UTF16LE byte sequence found: byte[${i}]`);
          }
          chars[j++] = c;
          i += inc;
        }
        return chars;
      }
    };
    exports.utf32be = {
      encode(chars) {
        const buf = Buffer.alloc(chars.length * 4);
        let i = 0;
        chars.forEach((char) => {
          if (char >= 55296 && char <= 57343 || char > 1114111) {
            throw new RangeError(`utf32be.encode: UTF32BE character code out of range: char[${i / 4}]: ${char}`);
          }
          buf[i++] = char >> 24 & mask[8];
          buf[i++] = char >> 16 & mask[8];
          buf[i++] = char >> 8 & mask[8];
          buf[i++] = char & mask[8];
        });
        return buf;
      },
      decode(buf, bom) {
        if (buf.length % 4 > 0) {
          throw new RangeError(`utf32be.decode: UTF32BE byte length must be even multiple of 4: length: ${buf.length}`);
        }
        const chars = [];
        let i = bom ? 4 : 0;
        for (; i < buf.length; i += 4) {
          const char = (buf[i] << 24) + (buf[i + 1] << 16) + (buf[i + 2] << 8) + buf[i + 3];
          if (char >= 55296 && char <= 57343 || char > 1114111) {
            throw new RangeError(`utf32be.decode: UTF32BE character code out of range: char[${i / 4}]: ${char}`);
          }
          chars.push(char);
        }
        return chars;
      }
    };
    exports.utf32le = {
      encode(chars) {
        const buf = Buffer.alloc(chars.length * 4);
        let i = 0;
        chars.forEach((char) => {
          if (char >= 55296 && char <= 57343 || char > 1114111) {
            throw new RangeError(`utf32le.encode: UTF32LE character code out of range: char[${i / 4}]: ${char}`);
          }
          buf[i++] = char & mask[8];
          buf[i++] = char >> 8 & mask[8];
          buf[i++] = char >> 16 & mask[8];
          buf[i++] = char >> 24 & mask[8];
        });
        return buf;
      },
      decode(buf, bom) {
        if (buf.length % 4 > 0) {
          throw new RangeError(`utf32be.decode: UTF32LE byte length must be even multiple of 4: length: ${buf.length}`);
        }
        const chars = [];
        let i = bom ? 4 : 0;
        for (; i < buf.length; i += 4) {
          const char = (buf[i + 3] << 24) + (buf[i + 2] << 16) + (buf[i + 1] << 8) + buf[i];
          if (char >= 55296 && char <= 57343 || char > 1114111) {
            throw new RangeError(`utf32le.encode: UTF32LE character code out of range: char[${i / 4}]: ${char}`);
          }
          chars.push(char);
        }
        return chars;
      }
    };
    exports.uint7 = {
      encode(chars) {
        const buf = Buffer.alloc(chars.length);
        for (let i = 0; i < chars.length; i += 1) {
          if (chars[i] > 127) {
            throw new RangeError(`uint7.encode: UINT7 character code out of range: char[${i}]: ${chars[i]}`);
          }
          buf[i] = chars[i];
        }
        return buf;
      },
      decode(buf) {
        const chars = [];
        for (let i = 0; i < buf.length; i += 1) {
          if (buf[i] > 127) {
            throw new RangeError(`uint7.decode: UINT7 character code out of range: byte[${i}]: ${buf[i]}`);
          }
          chars[i] = buf[i];
        }
        return chars;
      }
    };
    exports.uint8 = {
      encode(chars) {
        const buf = Buffer.alloc(chars.length);
        for (let i = 0; i < chars.length; i += 1) {
          if (chars[i] > 255) {
            throw new RangeError(`uint8.encode: UINT8 character code out of range: char[${i}]: ${chars[i]}`);
          }
          buf[i] = chars[i];
        }
        return buf;
      },
      decode(buf) {
        const chars = [];
        for (let i = 0; i < buf.length; i += 1) {
          chars[i] = buf[i];
        }
        return chars;
      }
    };
    exports.uint16be = {
      encode(chars) {
        const buf = Buffer.alloc(chars.length * 2);
        let i = 0;
        chars.forEach((char) => {
          if (char > 65535) {
            throw new RangeError(`uint16be.encode: UINT16BE character code out of range: char[${i / 2}]: ${char}`);
          }
          buf[i++] = char >> 8 & mask[8];
          buf[i++] = char & mask[8];
        });
        return buf;
      },
      decode(buf) {
        if (buf.length % 2 > 0) {
          throw new RangeError(`uint16be.decode: UINT16BE byte length must be even multiple of 2: length: ${buf.length}`);
        }
        const chars = [];
        for (let i = 0; i < buf.length; i += 2) {
          chars.push((buf[i] << 8) + buf[i + 1]);
        }
        return chars;
      }
    };
    exports.uint16le = {
      encode(chars) {
        const buf = Buffer.alloc(chars.length * 2);
        let i = 0;
        chars.forEach((char) => {
          if (char > 65535) {
            throw new RangeError(`uint16le.encode: UINT16LE character code out of range: char[${i / 2}]: ${char}`);
          }
          buf[i++] = char & mask[8];
          buf[i++] = char >> 8 & mask[8];
        });
        return buf;
      },
      decode(buf) {
        if (buf.length % 2 > 0) {
          throw new RangeError(`uint16le.decode: UINT16LE byte length must be even multiple of 2: length: ${buf.length}`);
        }
        const chars = [];
        for (let i = 0; i < buf.length; i += 2) {
          chars.push((buf[i + 1] << 8) + buf[i]);
        }
        return chars;
      }
    };
    exports.uint32be = {
      encode(chars) {
        const buf = Buffer.alloc(chars.length * 4);
        let i = 0;
        chars.forEach((char) => {
          buf[i++] = char >> 24 & mask[8];
          buf[i++] = char >> 16 & mask[8];
          buf[i++] = char >> 8 & mask[8];
          buf[i++] = char & mask[8];
        });
        return buf;
      },
      decode(buf) {
        if (buf.length % 4 > 0) {
          throw new RangeError(`uint32be.decode: UINT32BE byte length must be even multiple of 4: length: ${buf.length}`);
        }
        const chars = [];
        for (let i = 0; i < buf.length; i += 4) {
          chars.push((buf[i] << 24) + (buf[i + 1] << 16) + (buf[i + 2] << 8) + buf[i + 3]);
        }
        return chars;
      }
    };
    exports.uint32le = {
      encode(chars) {
        const buf = Buffer.alloc(chars.length * 4);
        let i = 0;
        chars.forEach((char) => {
          buf[i++] = char & mask[8];
          buf[i++] = char >> 8 & mask[8];
          buf[i++] = char >> 16 & mask[8];
          buf[i++] = char >> 24 & mask[8];
        });
        return buf;
      },
      decode(buf) {
        if (buf.length % 4 > 0) {
          throw new RangeError(`uint32le.decode: UINT32LE byte length must be even multiple of 4: length: ${buf.length}`);
        }
        const chars = [];
        for (let i = 0; i < buf.length; i += 4) {
          chars.push((buf[i + 3] << 24) + (buf[i + 2] << 16) + (buf[i + 1] << 8) + buf[i]);
        }
        return chars;
      }
    };
    exports.string = {
      encode(chars) {
        return thisThis.utf16le.encode(chars).toString("utf16le");
      },
      decode(str) {
        return thisThis.utf16le.decode(Buffer.from(str, "utf16le"), 0);
      }
    };
    exports.escaped = {
      encode(chars) {
        const bytes = [];
        for (let i = 0; i < chars.length; i += 1) {
          const char = chars[i];
          if (char === 96) {
            bytes.push(char);
            bytes.push(char);
          } else if (char === 10) {
            bytes.push(char);
          } else if (char >= 32 && char <= 126) {
            bytes.push(char);
          } else {
            let str = "";
            if (char >= 0 && char <= 31) {
              str += `\`x${ascii[char]}`;
            } else if (char >= 127 && char <= 255) {
              str += `\`x${ascii[char]}`;
            } else if (char >= 256 && char <= 65535) {
              str += `\`u${ascii[char >> 8 & mask[8]]}${ascii[char & mask[8]]}`;
            } else if (char >= 65536 && char <= 4294967295) {
              str += "`u{";
              const digit = char >> 24 & mask[8];
              if (digit > 0) {
                str += ascii[digit];
              }
              str += `${ascii[char >> 16 & mask[8]] + ascii[char >> 8 & mask[8]] + ascii[char & mask[8]]}}`;
            } else {
              throw new Error("escape.encode(char): char > 0xffffffff not allowed");
            }
            const buf = Buffer.from(str);
            buf.forEach((b) => {
              bytes.push(b);
            });
          }
        }
        return Buffer.from(bytes);
      },
      decode(buf) {
        function isHex(hex) {
          if (hex >= 48 && hex <= 57 || hex >= 65 && hex <= 70 || hex >= 97 && hex <= 102) {
            return true;
          }
          return false;
        }
        function getx(i2, len2, bufArg) {
          const ret2 = { char: null, nexti: i2 + 2, error: true };
          if (i2 + 1 < len2) {
            if (isHex(bufArg[i2]) && isHex(bufArg[i2 + 1])) {
              const str = String.fromCodePoint(bufArg[i2], bufArg[i2 + 1]);
              ret2.char = parseInt(str, 16);
              if (!Number.isNaN(ret2.char)) {
                ret2.error = false;
              }
            }
          }
          return ret2;
        }
        function getu(i2, len2, bufArg) {
          const ret2 = { char: null, nexti: i2 + 4, error: true };
          if (i2 + 3 < len2) {
            if (isHex(bufArg[i2]) && isHex(bufArg[i2 + 1]) && isHex(bufArg[i2 + 2]) && isHex(bufArg[i2 + 3])) {
              const str = String.fromCodePoint(bufArg[i2], bufArg[i2 + 1], bufArg[i2 + 2], bufArg[i2 + 3]);
              ret2.char = parseInt(str, 16);
              if (!Number.isNaN(ret2.char)) {
                ret2.error = false;
              }
            }
          }
          return ret2;
        }
        function getU(i2, len2, bufArg) {
          const ret2 = { char: null, nexti: i2 + 4, error: true };
          let str = "";
          while (i2 < len2 && isHex(bufArg[i2])) {
            str += String.fromCodePoint(bufArg[i2]);
            i2 += 1;
          }
          ret2.char = parseInt(str, 16);
          if (bufArg[i2] === 125 && !Number.isNaN(ret2.char)) {
            ret2.error = false;
          }
          ret2.nexti = i2 + 1;
          return ret2;
        }
        const chars = [];
        const len = buf.length;
        let i1;
        let ret;
        let error;
        let i = 0;
        while (i < len) {
          const TRUE = true;
          while (TRUE) {
            error = true;
            if (buf[i] !== 96) {
              chars.push(buf[i]);
              i += 1;
              error = false;
              break;
            }
            i1 = i + 1;
            if (i1 >= len) {
              break;
            }
            if (buf[i1] === 96) {
              chars.push(96);
              i += 2;
              error = false;
              break;
            }
            if (buf[i1] === 120) {
              ret = getx(i1 + 1, len, buf);
              if (ret.error) {
                break;
              }
              chars.push(ret.char);
              i = ret.nexti;
              error = false;
              break;
            }
            if (buf[i1] === 117) {
              if (buf[i1 + 1] === 123) {
                ret = getU(i1 + 2, len, buf);
                if (ret.error) {
                  break;
                }
                chars.push(ret.char);
                i = ret.nexti;
                error = false;
                break;
              }
              ret = getu(i1 + 1, len, buf);
              if (ret.error) {
                break;
              }
              chars.push(ret.char);
              i = ret.nexti;
              error = false;
              break;
            }
            break;
          }
          if (error) {
            throw new Error(`escaped.decode: ill-formed escape sequence at buf[${i}]`);
          }
        }
        return chars;
      }
    };
    var CR = 13;
    var LF = 10;
    exports.lineEnds = {
      crlf(chars) {
        const lfchars = [];
        let i = 0;
        while (i < chars.length) {
          switch (chars[i]) {
            case CR:
              if (i + 1 < chars.length && chars[i + 1] === LF) {
                i += 2;
              } else {
                i += 1;
              }
              lfchars.push(CR);
              lfchars.push(LF);
              break;
            case LF:
              lfchars.push(CR);
              lfchars.push(LF);
              i += 1;
              break;
            default:
              lfchars.push(chars[i]);
              i += 1;
              break;
          }
        }
        if (lfchars.length > 0 && lfchars[lfchars.length - 1] !== LF) {
          lfchars.push(CR);
          lfchars.push(LF);
        }
        return lfchars;
      },
      lf(chars) {
        const lfchars = [];
        let i = 0;
        while (i < chars.length) {
          switch (chars[i]) {
            case CR:
              if (i + 1 < chars.length && chars[i + 1] === LF) {
                i += 2;
              } else {
                i += 1;
              }
              lfchars.push(LF);
              break;
            case LF:
              lfchars.push(LF);
              i += 1;
              break;
            default:
              lfchars.push(chars[i]);
              i += 1;
              break;
          }
        }
        if (lfchars.length > 0 && lfchars[lfchars.length - 1] !== LF) {
          lfchars.push(LF);
        }
        return lfchars;
      }
    };
    exports.base64 = {
      encode(buf) {
        if (buf.length === 0) {
          return Buffer.alloc(0);
        }
        let i;
        let j;
        let n;
        let tail = buf.length % 3;
        tail = tail > 0 ? 3 - tail : 0;
        let units = (buf.length + tail) / 3;
        const base64 = Buffer.alloc(units * 4);
        if (tail > 0) {
          units -= 1;
        }
        i = 0;
        j = 0;
        for (let u = 0; u < units; u += 1) {
          n = buf[i++] << 16;
          n += buf[i++] << 8;
          n += buf[i++];
          base64[j++] = base64codes[n >> 18 & mask[6]];
          base64[j++] = base64codes[n >> 12 & mask[6]];
          base64[j++] = base64codes[n >> 6 & mask[6]];
          base64[j++] = base64codes[n & mask[6]];
        }
        if (tail === 0) {
          return base64;
        }
        if (tail === 1) {
          n = buf[i++] << 16;
          n += buf[i] << 8;
          base64[j++] = base64codes[n >> 18 & mask[6]];
          base64[j++] = base64codes[n >> 12 & mask[6]];
          base64[j++] = base64codes[n >> 6 & mask[6]];
          base64[j] = base64codes[64];
          return base64;
        }
        if (tail === 2) {
          n = buf[i] << 16;
          base64[j++] = base64codes[n >> 18 & mask[6]];
          base64[j++] = base64codes[n >> 12 & mask[6]];
          base64[j++] = base64codes[64];
          base64[j] = base64codes[64];
          return base64;
        }
        return void 0;
      },
      decode(codes) {
        function validate(buf2) {
          const chars = [];
          let tail2 = 0;
          for (let i2 = 0; i2 < buf2.length; i2 += 1) {
            const char = buf2[i2];
            const TRUE = true;
            while (TRUE) {
              if (char === 32 || char === 9 || char === 10 || char === 13) {
                break;
              }
              if (char >= 65 && char <= 90) {
                chars.push(char - 65);
                break;
              }
              if (char >= 97 && char <= 122) {
                chars.push(char - 71);
                break;
              }
              if (char >= 48 && char <= 57) {
                chars.push(char + 4);
                break;
              }
              if (char === 43) {
                chars.push(62);
                break;
              }
              if (char === 47) {
                chars.push(63);
                break;
              }
              if (char === 61) {
                chars.push(64);
                tail2 += 1;
                break;
              }
              throw new RangeError(`base64.decode: invalid character buf[${i2}]: ${char}`);
            }
          }
          if (chars.length % 4 > 0) {
            throw new RangeError(`base64.decode: string length not integral multiple of 4: ${chars.length}`);
          }
          switch (tail2) {
            case 0:
              break;
            case 1:
              if (chars[chars.length - 1] !== 64) {
                throw new RangeError("base64.decode: one tail character found: not last character");
              }
              break;
            case 2:
              if (chars[chars.length - 1] !== 64 || chars[chars.length - 2] !== 64) {
                throw new RangeError("base64.decode: two tail characters found: not last characters");
              }
              break;
            default:
              throw new RangeError(`base64.decode: more than two tail characters found: ${tail2}`);
          }
          return { tail: tail2, buf: Buffer.from(chars) };
        }
        if (codes.length === 0) {
          return Buffer.alloc(0);
        }
        const val = validate(codes);
        const { tail } = val;
        const base64 = val.buf;
        let i;
        let j;
        let n;
        let units = base64.length / 4;
        const buf = Buffer.alloc(units * 3 - tail);
        if (tail > 0) {
          units -= 1;
        }
        j = 0;
        i = 0;
        for (let u = 0; u < units; u += 1) {
          n = base64[i++] << 18;
          n += base64[i++] << 12;
          n += base64[i++] << 6;
          n += base64[i++];
          buf[j++] = n >> 16 & mask[8];
          buf[j++] = n >> 8 & mask[8];
          buf[j++] = n & mask[8];
        }
        if (tail === 1) {
          n = base64[i++] << 18;
          n += base64[i++] << 12;
          n += base64[i] << 6;
          buf[j++] = n >> 16 & mask[8];
          buf[j] = n >> 8 & mask[8];
        }
        if (tail === 2) {
          n = base64[i++] << 18;
          n += base64[i++] << 12;
          buf[j] = n >> 16 & mask[8];
        }
        return buf;
      },
      toString(buf) {
        if (buf.length % 4 > 0) {
          throw new RangeError(`base64.toString: input buffer length not multiple of 4: ${buf.length}`);
        }
        let str = "";
        let lineLen = 0;
        function buildLine(c1, c2, c3, c4) {
          switch (lineLen) {
            case 76:
              str += `\r
${c1}${c2}${c3}${c4}`;
              lineLen = 4;
              break;
            case 75:
              str += `${c1}\r
${c2}${c3}${c4}`;
              lineLen = 3;
              break;
            case 74:
              str += `${c1 + c2}\r
${c3}${c4}`;
              lineLen = 2;
              break;
            case 73:
              str += `${c1 + c2 + c3}\r
${c4}`;
              lineLen = 1;
              break;
            default:
              str += c1 + c2 + c3 + c4;
              lineLen += 4;
              break;
          }
        }
        function validate(c) {
          if (c >= 65 && c <= 90) {
            return true;
          }
          if (c >= 97 && c <= 122) {
            return true;
          }
          if (c >= 48 && c <= 57) {
            return true;
          }
          if (c === 43) {
            return true;
          }
          if (c === 47) {
            return true;
          }
          if (c === 61) {
            return true;
          }
          return false;
        }
        for (let i = 0; i < buf.length; i += 4) {
          for (let j = i; j < i + 4; j += 1) {
            if (!validate(buf[j])) {
              throw new RangeError(`base64.toString: buf[${j}]: ${buf[j]} : not valid base64 character code`);
            }
          }
          buildLine(String.fromCharCode(buf[i]), String.fromCharCode(buf[i + 1]), String.fromCharCode(buf[i + 2]), String.fromCharCode(buf[i + 3]));
        }
        return str;
      }
    };
  }
});

// ../../node_modules/apg-js/src/apg-conv-api/converter.js
var require_converter = __commonJS({
  "../../node_modules/apg-js/src/apg-conv-api/converter.js"(exports) {
    init_esbuild_shims();
    "use strict;";
    var thisThis = exports;
    var trans = require_transformers();
    var UTF8 = "UTF8";
    var UTF16 = "UTF16";
    var UTF16BE = "UTF16BE";
    var UTF16LE = "UTF16LE";
    var UTF32 = "UTF32";
    var UTF32BE = "UTF32BE";
    var UTF32LE = "UTF32LE";
    var UINT7 = "UINT7";
    var ASCII = "ASCII";
    var BINARY = "BINARY";
    var UINT8 = "UINT8";
    var UINT16 = "UINT16";
    var UINT16LE = "UINT16LE";
    var UINT16BE = "UINT16BE";
    var UINT32 = "UINT32";
    var UINT32LE = "UINT32LE";
    var UINT32BE = "UINT32BE";
    var ESCAPED = "ESCAPED";
    var STRING = "STRING";
    var bom8 = function bom82(src) {
      src.type = UTF8;
      const buf = src.data;
      src.bom = 0;
      if (buf.length >= 3) {
        if (buf[0] === 239 && buf[1] === 187 && buf[2] === 191) {
          src.bom = 3;
        }
      }
    };
    var bom16 = function bom162(src) {
      const buf = src.data;
      src.bom = 0;
      switch (src.type) {
        case UTF16:
          src.type = UTF16BE;
          if (buf.length >= 2) {
            if (buf[0] === 254 && buf[1] === 255) {
              src.bom = 2;
            } else if (buf[0] === 255 && buf[1] === 254) {
              src.type = UTF16LE;
              src.bom = 2;
            }
          }
          break;
        case UTF16BE:
          src.type = UTF16BE;
          if (buf.length >= 2) {
            if (buf[0] === 254 && buf[1] === 255) {
              src.bom = 2;
            } else if (buf[0] === 255 && buf[1] === 254) {
              throw new TypeError(`src type: "${UTF16BE}" specified but BOM is for "${UTF16LE}"`);
            }
          }
          break;
        case UTF16LE:
          src.type = UTF16LE;
          if (buf.length >= 0) {
            if (buf[0] === 254 && buf[1] === 255) {
              throw new TypeError(`src type: "${UTF16LE}" specified but BOM is for "${UTF16BE}"`);
            } else if (buf[0] === 255 && buf[1] === 254) {
              src.bom = 2;
            }
          }
          break;
        default:
          throw new TypeError(`UTF16 BOM: src type "${src.type}" unrecognized`);
      }
    };
    var bom32 = function bom322(src) {
      const buf = src.data;
      src.bom = 0;
      switch (src.type) {
        case UTF32:
          src.type = UTF32BE;
          if (buf.length >= 4) {
            if (buf[0] === 0 && buf[1] === 0 && buf[2] === 254 && buf[3] === 255) {
              src.bom = 4;
            }
            if (buf[0] === 255 && buf[1] === 254 && buf[2] === 0 && buf[3] === 0) {
              src.type = UTF32LE;
              src.bom = 4;
            }
          }
          break;
        case UTF32BE:
          src.type = UTF32BE;
          if (buf.length >= 4) {
            if (buf[0] === 0 && buf[1] === 0 && buf[2] === 254 && buf[3] === 255) {
              src.bom = 4;
            }
            if (buf[0] === 255 && buf[1] === 254 && buf[2] === 0 && buf[3] === 0) {
              throw new TypeError(`src type: ${UTF32BE} specified but BOM is for ${UTF32LE}"`);
            }
          }
          break;
        case UTF32LE:
          src.type = UTF32LE;
          if (buf.length >= 4) {
            if (buf[0] === 0 && buf[1] === 0 && buf[2] === 254 && buf[3] === 255) {
              throw new TypeError(`src type: "${UTF32LE}" specified but BOM is for "${UTF32BE}"`);
            }
            if (buf[0] === 255 && buf[1] === 254 && buf[2] === 0 && buf[3] === 0) {
              src.bom = 4;
            }
          }
          break;
        default:
          throw new TypeError(`UTF32 BOM: src type "${src.type}" unrecognized`);
      }
    };
    var validateSrc = function validateSrc2(type, data) {
      function getType(typeArg) {
        const ret2 = {
          type: "",
          base64: false
        };
        const rx = /^(base64:)?([a-zA-Z0-9]+)$/i;
        const result = rx.exec(typeArg);
        if (result) {
          if (result[2]) {
            ret2.type = result[2].toUpperCase();
          }
          if (result[1]) {
            ret2.base64 = true;
          }
        }
        return ret2;
      }
      if (typeof type !== "string" || type === "") {
        throw new TypeError(`type: "${type}" not recognized`);
      }
      const ret = getType(type.toUpperCase());
      if (ret.base64) {
        if (ret.type === STRING) {
          throw new TypeError(`type: "${type} "BASE64:" prefix not allowed with type ${STRING}`);
        }
        if (Buffer.isBuffer(data)) {
          ret.data = trans.base64.decode(data);
        } else if (typeof data === "string") {
          const buf = Buffer.from(data, "ascii");
          ret.data = trans.base64.decode(buf);
        } else {
          throw new TypeError(`type: "${type} unrecognized data type: typeof(data): ${typeof data}`);
        }
      } else {
        ret.data = data;
      }
      switch (ret.type) {
        case UTF8:
          bom8(ret);
          break;
        case UTF16:
        case UTF16BE:
        case UTF16LE:
          bom16(ret);
          break;
        case UTF32:
        case UTF32BE:
        case UTF32LE:
          bom32(ret);
          break;
        case UINT16:
          ret.type = UINT16BE;
          break;
        case UINT32:
          ret.type = UINT32BE;
          break;
        case ASCII:
          ret.type = UINT7;
          break;
        case BINARY:
          ret.type = UINT8;
          break;
        case UINT7:
        case UINT8:
        case UINT16LE:
        case UINT16BE:
        case UINT32LE:
        case UINT32BE:
        case STRING:
        case ESCAPED:
          break;
        default:
          throw new TypeError(`type: "${type}" not recognized`);
      }
      if (ret.type === STRING) {
        if (typeof ret.data !== "string") {
          throw new TypeError(`type: "${type}" but data is not a string`);
        }
      } else if (!Buffer.isBuffer(ret.data)) {
        throw new TypeError(`type: "${type}" but data is not a Buffer`);
      }
      return ret;
    };
    var validateDst = function validateDst2(type, chars) {
      function getType(typeArg) {
        let fix;
        let rem;
        const ret2 = {
          crlf: false,
          lf: false,
          base64: false,
          type: ""
        };
        const TRUE = true;
        while (TRUE) {
          rem = typeArg;
          fix = typeArg.slice(0, 5);
          if (fix === "CRLF:") {
            ret2.crlf = true;
            rem = typeArg.slice(5);
            break;
          }
          fix = typeArg.slice(0, 3);
          if (fix === "LF:") {
            ret2.lf = true;
            rem = typeArg.slice(3);
            break;
          }
          break;
        }
        fix = rem.split(":");
        if (fix.length === 1) {
          ret2.type = fix[0];
        } else if (fix.length === 2 && fix[1] === "BASE64") {
          ret2.base64 = true;
          ret2.type = fix[0];
        }
        return ret2;
      }
      if (!Array.isArray(chars)) {
        throw new TypeError(`dst chars: not array: "${typeof chars}`);
      }
      if (typeof type !== "string") {
        throw new TypeError(`dst type: not string: "${typeof type}`);
      }
      const ret = getType(type.toUpperCase());
      switch (ret.type) {
        case UTF8:
        case UTF16BE:
        case UTF16LE:
        case UTF32BE:
        case UTF32LE:
        case UINT7:
        case UINT8:
        case UINT16LE:
        case UINT16BE:
        case UINT32LE:
        case UINT32BE:
        case ESCAPED:
          break;
        case STRING:
          if (ret.base64) {
            throw new TypeError(`":BASE64" suffix not allowed with type ${STRING}`);
          }
          break;
        case ASCII:
          ret.type = UINT7;
          break;
        case BINARY:
          ret.type = UINT8;
          break;
        case UTF16:
          ret.type = UTF16BE;
          break;
        case UTF32:
          ret.type = UTF32BE;
          break;
        case UINT16:
          ret.type = UINT16BE;
          break;
        case UINT32:
          ret.type = UINT32BE;
          break;
        default:
          throw new TypeError(`dst type unrecognized: "${type}" : must have form [crlf:|lf:]type[:base64]`);
      }
      return ret;
    };
    var encode = function encode2(type, chars) {
      switch (type) {
        case UTF8:
          return trans.utf8.encode(chars);
        case UTF16BE:
          return trans.utf16be.encode(chars);
        case UTF16LE:
          return trans.utf16le.encode(chars);
        case UTF32BE:
          return trans.utf32be.encode(chars);
        case UTF32LE:
          return trans.utf32le.encode(chars);
        case UINT7:
          return trans.uint7.encode(chars);
        case UINT8:
          return trans.uint8.encode(chars);
        case UINT16BE:
          return trans.uint16be.encode(chars);
        case UINT16LE:
          return trans.uint16le.encode(chars);
        case UINT32BE:
          return trans.uint32be.encode(chars);
        case UINT32LE:
          return trans.uint32le.encode(chars);
        case STRING:
          return trans.string.encode(chars);
        case ESCAPED:
          return trans.escaped.encode(chars);
        default:
          throw new TypeError(`encode type "${type}" not recognized`);
      }
    };
    var decode = function decode2(src) {
      switch (src.type) {
        case UTF8:
          return trans.utf8.decode(src.data, src.bom);
        case UTF16LE:
          return trans.utf16le.decode(src.data, src.bom);
        case UTF16BE:
          return trans.utf16be.decode(src.data, src.bom);
        case UTF32BE:
          return trans.utf32be.decode(src.data, src.bom);
        case UTF32LE:
          return trans.utf32le.decode(src.data, src.bom);
        case UINT7:
          return trans.uint7.decode(src.data);
        case UINT8:
          return trans.uint8.decode(src.data);
        case UINT16BE:
          return trans.uint16be.decode(src.data);
        case UINT16LE:
          return trans.uint16le.decode(src.data);
        case UINT32BE:
          return trans.uint32be.decode(src.data);
        case UINT32LE:
          return trans.uint32le.decode(src.data);
        case STRING:
          return trans.string.decode(src.data);
        case ESCAPED:
          return trans.escaped.decode(src.data);
        default:
          throw new TypeError(`decode type "${src.type}" not recognized`);
      }
    };
    exports.decode = function exportsDecode(type, data) {
      const src = validateSrc(type, data);
      return decode(src);
    };
    exports.encode = function exportsEncode(type, chars) {
      let c;
      let buf;
      const dst = validateDst(type, chars);
      if (dst.crlf) {
        c = trans.lineEnds.crlf(chars);
        buf = encode(dst.type, c);
      } else if (dst.lf) {
        c = trans.lineEnds.lf(chars);
        buf = encode(dst.type, c);
      } else {
        buf = encode(dst.type, chars);
      }
      if (dst.base64) {
        buf = trans.base64.encode(buf);
      }
      return buf;
    };
    exports.convert = function convert(srcType, srcData, dstType) {
      return thisThis.encode(dstType, thisThis.decode(srcType, srcData));
    };
  }
});

// ../../node_modules/apg-js/src/apg-lib/emitcss.js
var require_emitcss = __commonJS({
  "../../node_modules/apg-js/src/apg-lib/emitcss.js"(exports, module2) {
    init_esbuild_shims();
    module2.exports = function emittcss() {
      return "/* This file automatically generated by jsonToless() and LESS. */\n.apg-mono {\n  font-family: monospace;\n}\n.apg-active {\n  font-weight: bold;\n  color: #000000;\n}\n.apg-match {\n  font-weight: bold;\n  color: #264BFF;\n}\n.apg-empty {\n  font-weight: bold;\n  color: #0fbd0f;\n}\n.apg-nomatch {\n  font-weight: bold;\n  color: #FF4000;\n}\n.apg-lh-match {\n  font-weight: bold;\n  color: #1A97BA;\n}\n.apg-lb-match {\n  font-weight: bold;\n  color: #5F1687;\n}\n.apg-remainder {\n  font-weight: bold;\n  color: #999999;\n}\n.apg-ctrl-char {\n  font-weight: bolder;\n  font-style: italic;\n  font-size: 0.6em;\n}\n.apg-line-end {\n  font-weight: bold;\n  color: #000000;\n}\n.apg-error {\n  font-weight: bold;\n  color: #FF4000;\n}\n.apg-phrase {\n  color: #000000;\n  background-color: #8caae6;\n}\n.apg-empty-phrase {\n  color: #0fbd0f;\n}\ntable.apg-state {\n  font-family: monospace;\n  margin-top: 5px;\n  font-size: 11px;\n  line-height: 130%;\n  text-align: left;\n  border: 1px solid black;\n  border-collapse: collapse;\n}\ntable.apg-state th,\ntable.apg-state td {\n  text-align: left;\n  border: 1px solid black;\n  border-collapse: collapse;\n}\ntable.apg-state th:nth-last-child(2),\ntable.apg-state td:nth-last-child(2) {\n  text-align: right;\n}\ntable.apg-state caption {\n  font-size: 125%;\n  line-height: 130%;\n  font-weight: bold;\n  text-align: left;\n}\ntable.apg-stats {\n  font-family: monospace;\n  margin-top: 5px;\n  font-size: 11px;\n  line-height: 130%;\n  text-align: right;\n  border: 1px solid black;\n  border-collapse: collapse;\n}\ntable.apg-stats th,\ntable.apg-stats td {\n  text-align: right;\n  border: 1px solid black;\n  border-collapse: collapse;\n}\ntable.apg-stats caption {\n  font-size: 125%;\n  line-height: 130%;\n  font-weight: bold;\n  text-align: left;\n}\ntable.apg-trace {\n  font-family: monospace;\n  margin-top: 5px;\n  font-size: 11px;\n  line-height: 130%;\n  text-align: right;\n  border: 1px solid black;\n  border-collapse: collapse;\n}\ntable.apg-trace caption {\n  font-size: 125%;\n  line-height: 130%;\n  font-weight: bold;\n  text-align: left;\n}\ntable.apg-trace th,\ntable.apg-trace td {\n  text-align: right;\n  border: 1px solid black;\n  border-collapse: collapse;\n}\ntable.apg-trace th:last-child,\ntable.apg-trace th:nth-last-child(2),\ntable.apg-trace td:last-child,\ntable.apg-trace td:nth-last-child(2) {\n  text-align: left;\n}\ntable.apg-grammar {\n  font-family: monospace;\n  margin-top: 5px;\n  font-size: 11px;\n  line-height: 130%;\n  text-align: right;\n  border: 1px solid black;\n  border-collapse: collapse;\n}\ntable.apg-grammar caption {\n  font-size: 125%;\n  line-height: 130%;\n  font-weight: bold;\n  text-align: left;\n}\ntable.apg-grammar th,\ntable.apg-grammar td {\n  text-align: right;\n  border: 1px solid black;\n  border-collapse: collapse;\n}\ntable.apg-grammar th:last-child,\ntable.apg-grammar td:last-child {\n  text-align: left;\n}\ntable.apg-rules {\n  font-family: monospace;\n  margin-top: 5px;\n  font-size: 11px;\n  line-height: 130%;\n  text-align: right;\n  border: 1px solid black;\n  border-collapse: collapse;\n}\ntable.apg-rules caption {\n  font-size: 125%;\n  line-height: 130%;\n  font-weight: bold;\n  text-align: left;\n}\ntable.apg-rules th,\ntable.apg-rules td {\n  text-align: right;\n  border: 1px solid black;\n  border-collapse: collapse;\n}\ntable.apg-rules a {\n  color: #003399 !important;\n}\ntable.apg-rules a:hover {\n  color: #8caae6 !important;\n}\ntable.apg-attrs {\n  font-family: monospace;\n  margin-top: 5px;\n  font-size: 11px;\n  line-height: 130%;\n  text-align: center;\n  border: 1px solid black;\n  border-collapse: collapse;\n}\ntable.apg-attrs caption {\n  font-size: 125%;\n  line-height: 130%;\n  font-weight: bold;\n  text-align: left;\n}\ntable.apg-attrs th,\ntable.apg-attrs td {\n  text-align: center;\n  border: 1px solid black;\n  border-collapse: collapse;\n}\ntable.apg-attrs th:nth-child(1),\ntable.apg-attrs th:nth-child(2),\ntable.apg-attrs th:nth-child(3) {\n  text-align: right;\n}\ntable.apg-attrs td:nth-child(1),\ntable.apg-attrs td:nth-child(2),\ntable.apg-attrs td:nth-child(3) {\n  text-align: right;\n}\ntable.apg-attrs a {\n  color: #003399 !important;\n}\ntable.apg-attrs a:hover {\n  color: #8caae6 !important;\n}\n";
    };
  }
});

// ../../node_modules/apg-js/src/apg-lib/utilities.js
var require_utilities = __commonJS({
  "../../node_modules/apg-js/src/apg-lib/utilities.js"(exports) {
    init_esbuild_shims();
    var style = require_style();
    var converter = require_converter();
    var emitCss = require_emitcss();
    var id = require_identifiers();
    var thisFileName = "utilities.js: ";
    var thisThis = exports;
    var getBounds = function(length, begArg, len) {
      let end;
      let beg = begArg;
      const TRUE = true;
      while (TRUE) {
        if (length <= 0) {
          beg = 0;
          end = 0;
          break;
        }
        if (typeof beg !== "number") {
          beg = 0;
          end = length;
          break;
        }
        if (beg >= length) {
          beg = length;
          end = length;
          break;
        }
        if (typeof len !== "number") {
          end = length;
          break;
        }
        end = beg + len;
        if (end > length) {
          end = length;
          break;
        }
        break;
      }
      return {
        beg,
        end
      };
    };
    exports.htmlToPage = function(html, titleArg) {
      let title;
      if (typeof html !== "string") {
        throw new Error(`${thisFileName}htmlToPage: input HTML is not a string`);
      }
      if (typeof titleArg !== "string") {
        title = "htmlToPage";
      } else {
        title = titleArg;
      }
      let page = "";
      page += "<!DOCTYPE html>\n";
      page += '<html lang="en">\n';
      page += "<head>\n";
      page += '<meta charset="utf-8">\n';
      page += `<title>${title}</title>
`;
      page += "<style>\n";
      page += emitCss();
      page += "</style>\n";
      page += "</head>\n<body>\n";
      page += `<p>${new Date()}</p>
`;
      page += html;
      page += "</body>\n</html>\n";
      return page;
    };
    exports.parserResultToHtml = function(result, caption) {
      let cap = null;
      if (typeof caption === "string" && caption !== "") {
        cap = caption;
      }
      let success;
      let state;
      if (result.success === true) {
        success = `<span class="${style.CLASS_MATCH}">true</span>`;
      } else {
        success = `<span class="${style.CLASS_NOMATCH}">false</span>`;
      }
      if (result.state === id.EMPTY) {
        state = `<span class="${style.CLASS_EMPTY}">EMPTY</span>`;
      } else if (result.state === id.MATCH) {
        state = `<span class="${style.CLASS_MATCH}">MATCH</span>`;
      } else if (result.state === id.NOMATCH) {
        state = `<span class="${style.CLASS_NOMATCH}">NOMATCH</span>`;
      } else {
        state = `<span class="${style.CLASS_NOMATCH}">unrecognized</span>`;
      }
      let html = "";
      html += `<table class="${style.CLASS_STATE}">
`;
      if (cap) {
        html += `<caption>${cap}</caption>
`;
      }
      html += "<tr><th>state item</th><th>value</th><th>description</th></tr>\n";
      html += `<tr><td>parser success</td><td>${success}</td>
`;
      html += `<td><span class="${style.CLASS_MATCH}">true</span> if the parse succeeded,
`;
      html += ` <span class="${style.CLASS_NOMATCH}">false</span> otherwise`;
      html += "<br><i>NOTE: for success, entire string must be matched</i></td></tr>\n";
      html += `<tr><td>parser state</td><td>${state}</td>
`;
      html += `<td><span class="${style.CLASS_EMPTY}">EMPTY</span>, `;
      html += `<span class="${style.CLASS_MATCH}">MATCH</span> or 
`;
      html += `<span class="${style.CLASS_NOMATCH}">NOMATCH</span></td></tr>
`;
      html += `<tr><td>string length</td><td>${result.length}</td><td>length of the input (sub)string</td></tr>
`;
      html += `<tr><td>matched length</td><td>${result.matched}</td><td>number of input string characters matched</td></tr>
`;
      html += `<tr><td>max matched</td><td>${result.maxMatched}</td><td>maximum number of input string characters matched</td></tr>
`;
      html += `<tr><td>max tree depth</td><td>${result.maxTreeDepth}</td><td>maximum depth of the parse tree reached</td></tr>
`;
      html += `<tr><td>node hits</td><td>${result.nodeHits}</td><td>number of parse tree node hits (opcode function calls)</td></tr>
`;
      html += `<tr><td>input length</td><td>${result.inputLength}</td><td>length of full input string</td></tr>
`;
      html += `<tr><td>sub-string begin</td><td>${result.subBegin}</td><td>sub-string first character index</td></tr>
`;
      html += `<tr><td>sub-string end</td><td>${result.subEnd}</td><td>sub-string end-of-string index</td></tr>
`;
      html += `<tr><td>sub-string length</td><td>${result.subLength}</td><td>sub-string length</td></tr>
`;
      html += "</table>\n";
      return html;
    };
    exports.charsToString = function(chars, phraseIndex, phraseLength) {
      let beg;
      let end;
      if (typeof phraseIndex === "number") {
        if (phraseIndex >= chars.length) {
          return "";
        }
        beg = phraseIndex < 0 ? 0 : phraseIndex;
      } else {
        beg = 0;
      }
      if (typeof phraseLength === "number") {
        if (phraseLength <= 0) {
          return "";
        }
        end = phraseLength > chars.length - beg ? chars.length : beg + phraseLength;
      } else {
        end = chars.length;
      }
      if (beg < end) {
        return converter.encode("UTF16LE", chars.slice(beg, end)).toString("utf16le");
      }
      return "";
    };
    exports.stringToChars = function(string) {
      return converter.decode("STRING", string);
    };
    exports.opcodeToString = function(type) {
      let ret = "unknown";
      switch (type) {
        case id.ALT:
          ret = "ALT";
          break;
        case id.CAT:
          ret = "CAT";
          break;
        case id.RNM:
          ret = "RNM";
          break;
        case id.UDT:
          ret = "UDT";
          break;
        case id.AND:
          ret = "AND";
          break;
        case id.NOT:
          ret = "NOT";
          break;
        case id.REP:
          ret = "REP";
          break;
        case id.TRG:
          ret = "TRG";
          break;
        case id.TBS:
          ret = "TBS";
          break;
        case id.TLS:
          ret = "TLS";
          break;
        case id.BKR:
          ret = "BKR";
          break;
        case id.BKA:
          ret = "BKA";
          break;
        case id.BKN:
          ret = "BKN";
          break;
        case id.ABG:
          ret = "ABG";
          break;
        case id.AEN:
          ret = "AEN";
          break;
        default:
          throw new Error("unrecognized opcode");
      }
      return ret;
    };
    exports.stateToString = function(state) {
      let ret = "unknown";
      switch (state) {
        case id.ACTIVE:
          ret = "ACTIVE";
          break;
        case id.MATCH:
          ret = "MATCH";
          break;
        case id.EMPTY:
          ret = "EMPTY";
          break;
        case id.NOMATCH:
          ret = "NOMATCH";
          break;
        default:
          throw new Error("unrecognized state");
      }
      return ret;
    };
    exports.asciiChars = [
      "NUL",
      "SOH",
      "STX",
      "ETX",
      "EOT",
      "ENQ",
      "ACK",
      "BEL",
      "BS",
      "TAB",
      "LF",
      "VT",
      "FF",
      "CR",
      "SO",
      "SI",
      "DLE",
      "DC1",
      "DC2",
      "DC3",
      "DC4",
      "NAK",
      "SYN",
      "ETB",
      "CAN",
      "EM",
      "SUB",
      "ESC",
      "FS",
      "GS",
      "RS",
      "US",
      "&nbsp;",
      "!",
      "&#34;",
      "#",
      "$",
      "%",
      "&#38;",
      "&#39;",
      "(",
      ")",
      "*",
      "+",
      ",",
      "-",
      ".",
      "/",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      ":",
      ";",
      "&#60;",
      "=",
      "&#62;",
      "?",
      "@",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "[",
      "&#92;",
      "]",
      "^",
      "_",
      "`",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "{",
      "|",
      "}",
      "~",
      "DEL"
    ];
    exports.charToHex = function(char) {
      let ch = char.toString(16).toUpperCase();
      switch (ch.length) {
        case 1:
        case 3:
        case 7:
          ch = `0${ch}`;
          break;
        case 2:
        case 6:
          ch = `00${ch}`;
          break;
        case 4:
          break;
        case 5:
          ch = `000${ch}`;
          break;
        default:
          throw new Error("unrecognized option");
      }
      return ch;
    };
    exports.charsToDec = function(chars, beg, len) {
      let ret = "";
      if (!Array.isArray(chars)) {
        throw new Error(`${thisFileName}charsToDec: input must be an array of integers`);
      }
      const bounds = getBounds(chars.length, beg, len);
      if (bounds.end > bounds.beg) {
        ret += chars[bounds.beg];
        for (let i = bounds.beg + 1; i < bounds.end; i += 1) {
          ret += `,${chars[i]}`;
        }
      }
      return ret;
    };
    exports.charsToHex = function(chars, beg, len) {
      let ret = "";
      if (!Array.isArray(chars)) {
        throw new Error(`${thisFileName}charsToHex: input must be an array of integers`);
      }
      const bounds = getBounds(chars.length, beg, len);
      if (bounds.end > bounds.beg) {
        ret += `\\x${thisThis.charToHex(chars[bounds.beg])}`;
        for (let i = bounds.beg + 1; i < bounds.end; i += 1) {
          ret += `,\\x${thisThis.charToHex(chars[i])}`;
        }
      }
      return ret;
    };
    exports.charsToHtmlEntities = function(chars, beg, len) {
      let ret = "";
      if (!Array.isArray(chars)) {
        throw new Error(`${thisFileName}charsToHex: input must be an array of integers`);
      }
      const bounds = getBounds(chars.length, beg, len);
      if (bounds.end > bounds.beg) {
        for (let i = bounds.beg; i < bounds.end; i += 1) {
          ret += `&#x${chars[i].toString(16)};`;
        }
      }
      return ret;
    };
    function isUnicode(char) {
      if (char >= 55296 && char <= 57343) {
        return false;
      }
      if (char > 1114111) {
        return false;
      }
      return true;
    }
    exports.charsToUnicode = function(chars, beg, len) {
      let ret = "";
      if (!Array.isArray(chars)) {
        throw new Error(`${thisFileName}charsToUnicode: input must be an array of integers`);
      }
      const bounds = getBounds(chars.length, beg, len);
      if (bounds.end > bounds.beg) {
        for (let i = bounds.beg; i < bounds.end; i += 1) {
          if (isUnicode(chars[i])) {
            ret += `&#${chars[i]};`;
          } else {
            ret += ` U+${thisThis.charToHex(chars[i])}`;
          }
        }
      }
      return ret;
    };
    exports.charsToJsUnicode = function(chars, beg, len) {
      let ret = "";
      if (!Array.isArray(chars)) {
        throw new Error(`${thisFileName}charsToJsUnicode: input must be an array of integers`);
      }
      const bounds = getBounds(chars.length, beg, len);
      if (bounds.end > bounds.beg) {
        ret += `\\u${thisThis.charToHex(chars[bounds.beg])}`;
        for (let i = bounds.beg + 1; i < bounds.end; i += 1) {
          ret += `,\\u${thisThis.charToHex(chars[i])}`;
        }
      }
      return ret;
    };
    exports.charsToAscii = function(chars, beg, len) {
      let ret = "";
      if (!Array.isArray(chars)) {
        throw new Error(`${thisFileName}charsToAscii: input must be an array of integers`);
      }
      const bounds = getBounds(chars.length, beg, len);
      for (let i = bounds.beg; i < bounds.end; i += 1) {
        const char = chars[i];
        if (char >= 32 && char <= 126) {
          ret += String.fromCharCode(char);
        } else {
          ret += `\\x${thisThis.charToHex(char)}`;
        }
      }
      return ret;
    };
    exports.charsToAsciiHtml = function(chars, beg, len) {
      if (!Array.isArray(chars)) {
        throw new Error(`${thisFileName}charsToAsciiHtml: input must be an array of integers`);
      }
      let html = "";
      let char;
      const bounds = getBounds(chars.length, beg, len);
      for (let i = bounds.beg; i < bounds.end; i += 1) {
        char = chars[i];
        if (char < 32 || char === 127) {
          html += `<span class="${style.CLASS_CTRLCHAR}">${thisThis.asciiChars[char]}</span>`;
        } else if (char > 127) {
          html += `<span class="${style.CLASS_CTRLCHAR}">U+${thisThis.charToHex(char)}</span>`;
        } else {
          html += thisThis.asciiChars[char];
        }
      }
      return html;
    };
    exports.stringToAsciiHtml = function(str) {
      const chars = converter.decode("STRING", str);
      return this.charsToAsciiHtml(chars);
    };
  }
});

// ../../node_modules/apg-js/src/apg-lib/ast.js
var require_ast = __commonJS({
  "../../node_modules/apg-js/src/apg-lib/ast.js"(exports, module2) {
    init_esbuild_shims();
    module2.exports = function exportsAst() {
      const id = require_identifiers();
      const utils = require_utilities();
      const thisFileName = "ast.js: ";
      const that = this;
      let rules = null;
      let udts = null;
      let chars = null;
      let nodeCount = 0;
      const nodesDefined = [];
      const nodeCallbacks = [];
      const stack = [];
      const records = [];
      this.callbacks = [];
      this.astObject = "astObject";
      this.init = function init(rulesIn, udtsIn, charsIn) {
        stack.length = 0;
        records.length = 0;
        nodesDefined.length = 0;
        nodeCount = 0;
        rules = rulesIn;
        udts = udtsIn;
        chars = charsIn;
        let i;
        const list = [];
        for (i = 0; i < rules.length; i += 1) {
          list.push(rules[i].lower);
        }
        for (i = 0; i < udts.length; i += 1) {
          list.push(udts[i].lower);
        }
        nodeCount = rules.length + udts.length;
        for (i = 0; i < nodeCount; i += 1) {
          nodesDefined[i] = false;
          nodeCallbacks[i] = null;
        }
        for (const index in that.callbacks) {
          const lower = index.toLowerCase();
          i = list.indexOf(lower);
          if (i < 0) {
            throw new Error(`${thisFileName}init: node '${index}' not a rule or udt name`);
          }
          if (typeof that.callbacks[index] === "function") {
            nodesDefined[i] = true;
            nodeCallbacks[i] = that.callbacks[index];
          }
          if (that.callbacks[index] === true) {
            nodesDefined[i] = true;
          }
        }
      };
      this.ruleDefined = function ruleDefined(index) {
        return nodesDefined[index] !== false;
      };
      this.udtDefined = function udtDefined(index) {
        return nodesDefined[rules.length + index] !== false;
      };
      this.down = function down(callbackIndex, name) {
        const thisIndex = records.length;
        stack.push(thisIndex);
        records.push({
          name,
          thisIndex,
          thatIndex: null,
          state: id.SEM_PRE,
          callbackIndex,
          phraseIndex: null,
          phraseLength: null,
          stack: stack.length
        });
        return thisIndex;
      };
      this.up = function up(callbackIndex, name, phraseIndex, phraseLength) {
        const thisIndex = records.length;
        const thatIndex = stack.pop();
        records.push({
          name,
          thisIndex,
          thatIndex,
          state: id.SEM_POST,
          callbackIndex,
          phraseIndex,
          phraseLength,
          stack: stack.length
        });
        records[thatIndex].thatIndex = thisIndex;
        records[thatIndex].phraseIndex = phraseIndex;
        records[thatIndex].phraseLength = phraseLength;
        return thisIndex;
      };
      this.translate = function translate(data) {
        let ret;
        let callback;
        let record;
        for (let i = 0; i < records.length; i += 1) {
          record = records[i];
          callback = nodeCallbacks[record.callbackIndex];
          if (record.state === id.SEM_PRE) {
            if (callback !== null) {
              ret = callback(id.SEM_PRE, chars, record.phraseIndex, record.phraseLength, data);
              if (ret === id.SEM_SKIP) {
                i = record.thatIndex;
              }
            }
          } else if (callback !== null) {
            callback(id.SEM_POST, chars, record.phraseIndex, record.phraseLength, data);
          }
        }
      };
      this.setLength = function setLength(length) {
        records.length = length;
        if (length > 0) {
          stack.length = records[length - 1].stack;
        } else {
          stack.length = 0;
        }
      };
      this.getLength = function getLength() {
        return records.length;
      };
      function indent(n) {
        let ret = "";
        for (let i = 0; i < n; i += 1) {
          ret += " ";
        }
        return ret;
      }
      this.toXml = function toSml(modeArg) {
        let display = utils.charsToDec;
        let caption = "decimal integer character codes";
        if (typeof mode === "string" && modeArg.length >= 3) {
          const mode2 = modeArg.slice(0, 3).toLowerCase();
          if (mode2 === "asc") {
            display = utils.charsToAscii;
            caption = "ASCII for printing characters, hex for non-printing";
          } else if (mode2 === "hex") {
            display = utils.charsToHex;
            caption = "hexidecimal integer character codes";
          } else if (mode2 === "uni") {
            display = utils.charsToUnicode;
            caption = "Unicode UTF-32 integer character codes";
          }
        }
        let xml = "";
        let depth = 0;
        xml += '<?xml version="1.0" encoding="utf-8"?>\n';
        xml += `<root nodes="${records.length / 2}" characters="${chars.length}">
`;
        xml += `<!-- input string, ${caption} -->
`;
        xml += indent(depth + 2);
        xml += display(chars);
        xml += "\n";
        records.forEach((rec) => {
          if (rec.state === id.SEM_PRE) {
            depth += 1;
            xml += indent(depth);
            xml += `<node name="${rec.name}" index="${rec.phraseIndex}" length="${rec.phraseLength}">
`;
            xml += indent(depth + 2);
            xml += display(chars, rec.phraseIndex, rec.phraseLength);
            xml += "\n";
          } else {
            xml += indent(depth);
            xml += `</node><!-- name="${rec.name}" -->
`;
            depth -= 1;
          }
        });
        xml += "</root>\n";
        return xml;
      };
      this.phrases = function phrases() {
        const obj = {};
        let i;
        let record;
        for (i = 0; i < records.length; i += 1) {
          record = records[i];
          if (record.state === id.SEM_PRE) {
            if (!Array.isArray(obj[record.name])) {
              obj[record.name] = [];
            }
            obj[record.name].push({
              index: record.phraseIndex,
              length: record.phraseLength
            });
          }
        }
        return obj;
      };
    };
  }
});

// ../../node_modules/apg-js/src/apg-lib/circular-buffer.js
var require_circular_buffer = __commonJS({
  "../../node_modules/apg-js/src/apg-lib/circular-buffer.js"(exports, module2) {
    init_esbuild_shims();
    module2.exports = function exportsCircularBuffer() {
      "use strict;";
      const thisFileName = "circular-buffer.js: ";
      let itemIndex = -1;
      let maxListSize = 0;
      this.init = function init(size) {
        if (typeof size !== "number" || size <= 0) {
          throw new Error(`${thisFileName}init: circular buffer size must an integer > 0`);
        }
        maxListSize = Math.ceil(size);
        itemIndex = -1;
      };
      this.increment = function increment() {
        itemIndex += 1;
        return (itemIndex + maxListSize) % maxListSize;
      };
      this.maxSize = function maxSize() {
        return maxListSize;
      };
      this.items = function items() {
        return itemIndex + 1;
      };
      this.getListIndex = function getListIndex(item) {
        if (itemIndex === -1) {
          return -1;
        }
        if (item < 0 || item > itemIndex) {
          return -1;
        }
        if (itemIndex - item >= maxListSize) {
          return -1;
        }
        return (item + maxListSize) % maxListSize;
      };
      this.forEach = function forEach(fn) {
        if (itemIndex === -1) {
          return;
        }
        if (itemIndex < maxListSize) {
          for (let i = 0; i <= itemIndex; i += 1) {
            fn(i, i);
          }
          return;
        }
        for (let i = itemIndex - maxListSize + 1; i <= itemIndex; i += 1) {
          const listIndex = (i + maxListSize) % maxListSize;
          fn(listIndex, i);
        }
      };
    };
  }
});

// ../../node_modules/apg-js/src/apg-lib/parser.js
var require_parser = __commonJS({
  "../../node_modules/apg-js/src/apg-lib/parser.js"(exports, module2) {
    init_esbuild_shims();
    module2.exports = function parser() {
      const id = require_identifiers();
      const utils = require_utilities();
      const thisFileName = "parser.js: ";
      const thisThis = this;
      let opExecute;
      this.ast = null;
      this.stats = null;
      this.trace = null;
      this.callbacks = [];
      let opcodes = null;
      let chars = null;
      let charsBegin;
      let charsLength;
      let charsEnd;
      let lookAround;
      let treeDepth = 0;
      let maxTreeDepth = 0;
      let nodeHits = 0;
      let ruleCallbacks = null;
      let udtCallbacks = null;
      let rules = null;
      let udts = null;
      let syntaxData = null;
      let maxMatched = 0;
      let limitTreeDepth = Infinity;
      let limitNodeHits = Infinity;
      const evaluateRule = function evaluateRule2(ruleIndex, phraseIndex, sysData) {
        const functionName = `${thisFileName}evaluateRule(): `;
        if (ruleIndex >= rules.length) {
          throw new Error(`${functionName}rule index: ${ruleIndex} out of range`);
        }
        if (phraseIndex >= charsEnd) {
          throw new Error(`${functionName}phrase index: ${phraseIndex} out of range`);
        }
        const { length } = opcodes;
        opcodes.push({
          type: id.RNM,
          index: ruleIndex
        });
        opExecute(length, phraseIndex, sysData);
        opcodes.pop();
      };
      const evaluateUdt = function(udtIndex, phraseIndex, sysData) {
        const functionName = `${thisFileName}evaluateUdt(): `;
        if (udtIndex >= udts.length) {
          throw new Error(`${functionName}udt index: ${udtIndex} out of range`);
        }
        if (phraseIndex >= charsEnd) {
          throw new Error(`${functionName}phrase index: ${phraseIndex} out of range`);
        }
        const { length } = opcodes;
        opcodes.push({
          type: id.UDT,
          empty: udts[udtIndex].empty,
          index: udtIndex
        });
        opExecute(length, phraseIndex, sysData);
        opcodes.pop();
      };
      const clear = function() {
        treeDepth = 0;
        maxTreeDepth = 0;
        nodeHits = 0;
        maxMatched = 0;
        lookAround = [
          {
            lookAround: id.LOOKAROUND_NONE,
            anchor: 0,
            charsEnd: 0,
            charsLength: 0
          }
        ];
        rules = null;
        udts = null;
        chars = null;
        charsBegin = 0;
        charsLength = 0;
        charsEnd = 0;
        ruleCallbacks = null;
        udtCallbacks = null;
        syntaxData = null;
        opcodes = null;
      };
      const backRef = function() {
        const stack = [];
        const init = function() {
          const obj = {};
          rules.forEach((rule) => {
            if (rule.isBkr) {
              obj[rule.lower] = null;
            }
          });
          if (udts.length > 0) {
            udts.forEach((udt) => {
              if (udt.isBkr) {
                obj[udt.lower] = null;
              }
            });
          }
          stack.push(obj);
        };
        const copy = function() {
          const top = stack[stack.length - 1];
          const obj = {};
          for (const name in top) {
            obj[name] = top[name];
          }
          return obj;
        };
        this.push = function push() {
          stack.push(copy());
        };
        this.pop = function pop(lengthArg) {
          let length = lengthArg;
          if (!length) {
            length = stack.length - 1;
          }
          if (length < 1 || length > stack.length) {
            throw new Error(`${thisFileName}backRef.pop(): bad length: ${length}`);
          }
          stack.length = length;
          return stack[stack.length - 1];
        };
        this.length = function length() {
          return stack.length;
        };
        this.savePhrase = function savePhrase(name, index, length) {
          stack[stack.length - 1][name] = {
            phraseIndex: index,
            phraseLength: length
          };
        };
        this.getPhrase = function(name) {
          return stack[stack.length - 1][name];
        };
        init();
      };
      const systemData = function systemData2() {
        const thisData = this;
        this.state = id.ACTIVE;
        this.phraseLength = 0;
        this.ruleIndex = 0;
        this.udtIndex = 0;
        this.lookAround = lookAround[lookAround.length - 1];
        this.uFrame = new backRef();
        this.pFrame = new backRef();
        this.evaluateRule = evaluateRule;
        this.evaluateUdt = evaluateUdt;
        this.refresh = function refresh() {
          thisData.state = id.ACTIVE;
          thisData.phraseLength = 0;
          thisData.lookAround = lookAround[lookAround.length - 1];
        };
      };
      const lookAroundValue = function lookAroundValue2() {
        return lookAround[lookAround.length - 1];
      };
      const inLookAround = function inLookAround2() {
        return lookAround.length > 1;
      };
      const inLookBehind = function() {
        return lookAround[lookAround.length - 1].lookAround === id.LOOKAROUND_BEHIND;
      };
      const initializeAst = function() {
        const functionName = `${thisFileName}initializeAst(): `;
        const TRUE = true;
        while (TRUE) {
          if (thisThis.ast === void 0) {
            thisThis.ast = null;
            break;
          }
          if (thisThis.ast === null) {
            break;
          }
          if (thisThis.ast.astObject !== "astObject") {
            throw new Error(`${functionName}ast object not recognized`);
          }
          break;
        }
        if (thisThis.ast !== null) {
          thisThis.ast.init(rules, udts, chars);
        }
      };
      const initializeTrace = function() {
        const functionName = `${thisFileName}initializeTrace(): `;
        const TRUE = true;
        while (TRUE) {
          if (thisThis.trace === void 0) {
            thisThis.trace = null;
            break;
          }
          if (thisThis.trace === null) {
            break;
          }
          if (thisThis.trace.traceObject !== "traceObject") {
            throw new Error(`${functionName}trace object not recognized`);
          }
          break;
        }
        if (thisThis.trace !== null) {
          thisThis.trace.init(rules, udts, chars);
        }
      };
      const initializeStats = function() {
        const functionName = `${thisFileName}initializeStats(): `;
        const TRUE = true;
        while (TRUE) {
          if (thisThis.stats === void 0) {
            thisThis.stats = null;
            break;
          }
          if (thisThis.stats === null) {
            break;
          }
          if (thisThis.stats.statsObject !== "statsObject") {
            throw new Error(`${functionName}stats object not recognized`);
          }
          break;
        }
        if (thisThis.stats !== null) {
          thisThis.stats.init(rules, udts);
        }
      };
      const initializeGrammar = function(grammar) {
        const functionName = `${thisFileName}initializeGrammar(): `;
        if (!grammar) {
          throw new Error(`${functionName}grammar object undefined`);
        }
        if (grammar.grammarObject !== "grammarObject") {
          throw new Error(`${functionName}bad grammar object`);
        }
        rules = grammar.rules;
        udts = grammar.udts;
      };
      const initializeStartRule = function(startRule) {
        const functionName = `${thisFileName}initializeStartRule(): `;
        let start = null;
        if (typeof startRule === "number") {
          if (startRule >= rules.length) {
            throw new Error(`${functionName}start rule index too large: max: ${rules.length}: index: ${startRule}`);
          }
          start = startRule;
        } else if (typeof startRule === "string") {
          const lower = startRule.toLowerCase();
          for (let i = 0; i < rules.length; i += 1) {
            if (lower === rules[i].lower) {
              start = rules[i].index;
              break;
            }
          }
          if (start === null) {
            throw new Error(`${functionName}start rule name '${startRule}' not recognized`);
          }
        } else {
          throw new Error(`${functionName}type of start rule '${typeof startRule}' not recognized`);
        }
        return start;
      };
      const initializeInputChars = function initializeInputChars2(inputArg, begArg, lenArg) {
        const functionName = `${thisFileName}initializeInputChars(): `;
        let input = inputArg;
        let beg = begArg;
        let len = lenArg;
        if (input === void 0) {
          throw new Error(`${functionName}input string is undefined`);
        }
        if (input === null) {
          throw new Error(`${functionName}input string is null`);
        }
        if (typeof input === "string") {
          input = utils.stringToChars(input);
        } else if (!Array.isArray(input)) {
          throw new Error(`${functionName}input string is not a string or array`);
        }
        if (input.length > 0) {
          if (typeof input[0] !== "number") {
            throw new Error(`${functionName}input string not an array of integers`);
          }
        }
        if (typeof beg !== "number") {
          beg = 0;
        } else {
          beg = Math.floor(beg);
          if (beg < 0 || beg > input.length) {
            throw new Error(`${functionName}input beginning index out of range: ${beg}`);
          }
        }
        if (typeof len !== "number") {
          len = input.length - beg;
        } else {
          len = Math.floor(len);
          if (len < 0 || len > input.length - beg) {
            throw new Error(`${functionName}input length out of range: ${len}`);
          }
        }
        chars = input;
        charsBegin = beg;
        charsLength = len;
        charsEnd = charsBegin + charsLength;
      };
      const initializeCallbacks = function() {
        const functionName = `${thisFileName}initializeCallbacks(): `;
        let i;
        ruleCallbacks = [];
        udtCallbacks = [];
        for (i = 0; i < rules.length; i += 1) {
          ruleCallbacks[i] = null;
        }
        for (i = 0; i < udts.length; i += 1) {
          udtCallbacks[i] = null;
        }
        let func;
        const list = [];
        for (i = 0; i < rules.length; i += 1) {
          list.push(rules[i].lower);
        }
        for (i = 0; i < udts.length; i += 1) {
          list.push(udts[i].lower);
        }
        for (const index in thisThis.callbacks) {
          i = list.indexOf(index.toLowerCase());
          if (i < 0) {
            throw new Error(`${functionName}syntax callback '${index}' not a rule or udt name`);
          }
          func = thisThis.callbacks[index];
          if (!func) {
            func = null;
          }
          if (typeof func === "function" || func === null) {
            if (i < rules.length) {
              ruleCallbacks[i] = func;
            } else {
              udtCallbacks[i - rules.length] = func;
            }
          } else {
            throw new Error(`${functionName}syntax callback[${index}] must be function reference or 'false' (false/null/undefined/etc.)`);
          }
        }
        for (i = 0; i < udts.length; i += 1) {
          if (udtCallbacks[i] === null) {
            throw new Error(`${functionName}all UDT callbacks must be defined. UDT callback[${udts[i].lower}] not a function reference`);
          }
        }
      };
      this.setMaxTreeDepth = function(depth) {
        if (typeof depth !== "number") {
          throw new Error(`parser: max tree depth must be integer > 0: ${depth}`);
        }
        limitTreeDepth = Math.floor(depth);
        if (limitTreeDepth <= 0) {
          throw new Error(`parser: max tree depth must be integer > 0: ${depth}`);
        }
      };
      this.setMaxNodeHits = function(hits) {
        if (typeof hits !== "number") {
          throw new Error(`parser: max node hits must be integer > 0: ${hits}`);
        }
        limitNodeHits = Math.floor(hits);
        if (limitNodeHits <= 0) {
          throw new Error(`parser: max node hits must be integer > 0: ${hits}`);
        }
      };
      const privateParse = function(grammar, startRuleArg, callbackData) {
        let success;
        const functionName = `${thisFileName}parse(): `;
        initializeGrammar(grammar);
        const startRule = initializeStartRule(startRuleArg);
        initializeCallbacks();
        initializeTrace();
        initializeStats();
        initializeAst();
        const sysData = new systemData();
        if (!(callbackData === void 0 || callbackData === null)) {
          syntaxData = callbackData;
        }
        opcodes = [
          {
            type: id.RNM,
            index: startRule
          }
        ];
        opExecute(0, charsBegin, sysData);
        opcodes = null;
        switch (sysData.state) {
          case id.ACTIVE:
            throw new Error(`${functionName}final state should never be 'ACTIVE'`);
          case id.NOMATCH:
            success = false;
            break;
          case id.EMPTY:
          case id.MATCH:
            if (sysData.phraseLength === charsLength) {
              success = true;
            } else {
              success = false;
            }
            break;
          default:
            throw new Error("unrecognized state");
        }
        return {
          success,
          state: sysData.state,
          length: charsLength,
          matched: sysData.phraseLength,
          maxMatched,
          maxTreeDepth,
          nodeHits,
          inputLength: chars.length,
          subBegin: charsBegin,
          subEnd: charsEnd,
          subLength: charsLength
        };
      };
      this.parseSubstring = function parseSubstring(grammar, startRule, inputChars, inputIndex, inputLength, callbackData) {
        clear();
        initializeInputChars(inputChars, inputIndex, inputLength);
        return privateParse(grammar, startRule, callbackData);
      };
      this.parse = function parse(grammar, startRule, inputChars, callbackData) {
        clear();
        initializeInputChars(inputChars, 0, inputChars.length);
        return privateParse(grammar, startRule, callbackData);
      };
      const opALT = function(opIndex, phraseIndex, sysData) {
        const op = opcodes[opIndex];
        for (let i = 0; i < op.children.length; i += 1) {
          opExecute(op.children[i], phraseIndex, sysData);
          if (sysData.state !== id.NOMATCH) {
            break;
          }
        }
      };
      const opCAT = function(opIndex, phraseIndex, sysData) {
        let success;
        let astLength;
        let catCharIndex;
        let catPhrase;
        const op = opcodes[opIndex];
        const ulen = sysData.uFrame.length();
        const plen = sysData.pFrame.length();
        if (thisThis.ast) {
          astLength = thisThis.ast.getLength();
        }
        success = true;
        catCharIndex = phraseIndex;
        catPhrase = 0;
        for (let i = 0; i < op.children.length; i += 1) {
          opExecute(op.children[i], catCharIndex, sysData);
          if (sysData.state === id.NOMATCH) {
            success = false;
            break;
          } else {
            catCharIndex += sysData.phraseLength;
            catPhrase += sysData.phraseLength;
          }
        }
        if (success) {
          sysData.state = catPhrase === 0 ? id.EMPTY : id.MATCH;
          sysData.phraseLength = catPhrase;
        } else {
          sysData.state = id.NOMATCH;
          sysData.phraseLength = 0;
          sysData.uFrame.pop(ulen);
          sysData.pFrame.pop(plen);
          if (thisThis.ast) {
            thisThis.ast.setLength(astLength);
          }
        }
      };
      const opREP = function(opIndex, phraseIndex, sysData) {
        let astLength;
        let repCharIndex;
        let repPhrase;
        let repCount;
        const op = opcodes[opIndex];
        repCharIndex = phraseIndex;
        repPhrase = 0;
        repCount = 0;
        const ulen = sysData.uFrame.length();
        const plen = sysData.pFrame.length();
        if (thisThis.ast) {
          astLength = thisThis.ast.getLength();
        }
        const TRUE = true;
        while (TRUE) {
          if (repCharIndex >= charsEnd) {
            break;
          }
          opExecute(opIndex + 1, repCharIndex, sysData);
          if (sysData.state === id.NOMATCH) {
            break;
          }
          if (sysData.state === id.EMPTY) {
            break;
          }
          repCount += 1;
          repPhrase += sysData.phraseLength;
          repCharIndex += sysData.phraseLength;
          if (repCount === op.max) {
            break;
          }
        }
        if (sysData.state === id.EMPTY) {
          sysData.state = repPhrase === 0 ? id.EMPTY : id.MATCH;
          sysData.phraseLength = repPhrase;
        } else if (repCount >= op.min) {
          sysData.state = repPhrase === 0 ? id.EMPTY : id.MATCH;
          sysData.phraseLength = repPhrase;
        } else {
          sysData.state = id.NOMATCH;
          sysData.phraseLength = 0;
          sysData.uFrame.pop(ulen);
          sysData.pFrame.pop(plen);
          if (thisThis.ast) {
            thisThis.ast.setLength(astLength);
          }
        }
      };
      const validateRnmCallbackResult = function(rule, sysData, charsLeft, down) {
        if (sysData.phraseLength > charsLeft) {
          let str = `${thisFileName}opRNM(${rule.name}): callback function error: `;
          str += `sysData.phraseLength: ${sysData.phraseLength}`;
          str += ` must be <= remaining chars: ${charsLeft}`;
          throw new Error(str);
        }
        switch (sysData.state) {
          case id.ACTIVE:
            if (down !== true) {
              throw new Error(`${thisFileName}opRNM(${rule.name}): callback function return error. ACTIVE state not allowed.`);
            }
            break;
          case id.EMPTY:
            sysData.phraseLength = 0;
            break;
          case id.MATCH:
            if (sysData.phraseLength === 0) {
              sysData.state = id.EMPTY;
            }
            break;
          case id.NOMATCH:
            sysData.phraseLength = 0;
            break;
          default:
            throw new Error(`${thisFileName}opRNM(${rule.name}): callback function return error. Unrecognized return state: ${sysData.state}`);
        }
      };
      const opRNM = function(opIndex, phraseIndex, sysData) {
        let astLength;
        let astDefined;
        let savedOpcodes;
        let ulen;
        let plen;
        let saveFrame;
        const op = opcodes[opIndex];
        const rule = rules[op.index];
        const callback = ruleCallbacks[rule.index];
        const notLookAround = !inLookAround();
        if (notLookAround) {
          astDefined = thisThis.ast && thisThis.ast.ruleDefined(op.index);
          if (astDefined) {
            astLength = thisThis.ast.getLength();
            thisThis.ast.down(op.index, rules[op.index].name);
          }
          ulen = sysData.uFrame.length();
          plen = sysData.pFrame.length();
          sysData.uFrame.push();
          sysData.pFrame.push();
          saveFrame = sysData.pFrame;
          sysData.pFrame = new backRef();
        }
        if (callback === null) {
          savedOpcodes = opcodes;
          opcodes = rule.opcodes;
          opExecute(0, phraseIndex, sysData);
          opcodes = savedOpcodes;
        } else {
          const charsLeft = charsEnd - phraseIndex;
          sysData.ruleIndex = rule.index;
          callback(sysData, chars, phraseIndex, syntaxData);
          validateRnmCallbackResult(rule, sysData, charsLeft, true);
          if (sysData.state === id.ACTIVE) {
            savedOpcodes = opcodes;
            opcodes = rule.opcodes;
            opExecute(0, phraseIndex, sysData);
            opcodes = savedOpcodes;
            sysData.ruleIndex = rule.index;
            callback(sysData, chars, phraseIndex, syntaxData);
            validateRnmCallbackResult(rule, sysData, charsLeft, false);
          }
        }
        if (notLookAround) {
          if (astDefined) {
            if (sysData.state === id.NOMATCH) {
              thisThis.ast.setLength(astLength);
            } else {
              thisThis.ast.up(op.index, rule.name, phraseIndex, sysData.phraseLength);
            }
          }
          sysData.pFrame = saveFrame;
          if (sysData.state === id.NOMATCH) {
            sysData.uFrame.pop(ulen);
            sysData.pFrame.pop(plen);
          } else if (rule.isBkr) {
            sysData.pFrame.savePhrase(rule.lower, phraseIndex, sysData.phraseLength);
            sysData.uFrame.savePhrase(rule.lower, phraseIndex, sysData.phraseLength);
          }
        }
      };
      const validateUdtCallbackResult = function(udt, sysData, charsLeft) {
        if (sysData.phraseLength > charsLeft) {
          let str = `${thisFileName}opUDT(${udt.name}): callback function error: `;
          str += `sysData.phraseLength: ${sysData.phraseLength}`;
          str += ` must be <= remaining chars: ${charsLeft}`;
          throw new Error(str);
        }
        switch (sysData.state) {
          case id.ACTIVE:
            throw new Error(`${thisFileName}opUDT(${udt.name}): callback function return error. ACTIVE state not allowed.`);
          case id.EMPTY:
            if (udt.empty === false) {
              throw new Error(`${thisFileName}opUDT(${udt.name}): callback function return error. May not return EMPTY.`);
            } else {
              sysData.phraseLength = 0;
            }
            break;
          case id.MATCH:
            if (sysData.phraseLength === 0) {
              if (udt.empty === false) {
                throw new Error(`${thisFileName}opUDT(${udt.name}): callback function return error. May not return EMPTY.`);
              } else {
                sysData.state = id.EMPTY;
              }
            }
            break;
          case id.NOMATCH:
            sysData.phraseLength = 0;
            break;
          default:
            throw new Error(`${thisFileName}opUDT(${udt.name}): callback function return error. Unrecognized return state: ${sysData.state}`);
        }
      };
      const opUDT = function(opIndex, phraseIndex, sysData) {
        let astLength;
        let astIndex;
        let astDefined;
        let ulen;
        let plen;
        let saveFrame;
        const op = opcodes[opIndex];
        const udt = udts[op.index];
        sysData.UdtIndex = udt.index;
        const notLookAround = !inLookAround();
        if (notLookAround) {
          astDefined = thisThis.ast && thisThis.ast.udtDefined(op.index);
          if (astDefined) {
            astIndex = rules.length + op.index;
            astLength = thisThis.ast.getLength();
            thisThis.ast.down(astIndex, udt.name);
          }
          ulen = sysData.uFrame.length();
          plen = sysData.pFrame.length();
          sysData.uFrame.push();
          sysData.pFrame.push();
          saveFrame = sysData.pFrame;
          sysData.pFrame = new backRef();
        }
        const charsLeft = charsEnd - phraseIndex;
        udtCallbacks[op.index](sysData, chars, phraseIndex, syntaxData);
        validateUdtCallbackResult(udt, sysData, charsLeft);
        if (notLookAround) {
          if (astDefined) {
            if (sysData.state === id.NOMATCH) {
              thisThis.ast.setLength(astLength);
            } else {
              thisThis.ast.up(astIndex, udt.name, phraseIndex, sysData.phraseLength);
            }
          }
          sysData.pFrame = saveFrame;
          if (sysData.state === id.NOMATCH) {
            sysData.uFrame.pop(ulen);
            sysData.pFrame.pop(plen);
          } else if (udt.isBkr) {
            sysData.pFrame.savePhrase(udt.lower, phraseIndex, sysData.phraseLength);
            sysData.uFrame.savePhrase(udt.lower, phraseIndex, sysData.phraseLength);
          }
        }
      };
      const opAND = function(opIndex, phraseIndex, sysData) {
        lookAround.push({
          lookAround: id.LOOKAROUND_AHEAD,
          anchor: phraseIndex,
          charsEnd,
          charsLength
        });
        charsEnd = chars.length;
        charsLength = chars.length - charsBegin;
        opExecute(opIndex + 1, phraseIndex, sysData);
        const pop = lookAround.pop();
        charsEnd = pop.charsEnd;
        charsLength = pop.charsLength;
        sysData.phraseLength = 0;
        switch (sysData.state) {
          case id.EMPTY:
            sysData.state = id.EMPTY;
            break;
          case id.MATCH:
            sysData.state = id.EMPTY;
            break;
          case id.NOMATCH:
            sysData.state = id.NOMATCH;
            break;
          default:
            throw new Error(`opAND: invalid state ${sysData.state}`);
        }
      };
      const opNOT = function(opIndex, phraseIndex, sysData) {
        lookAround.push({
          lookAround: id.LOOKAROUND_AHEAD,
          anchor: phraseIndex,
          charsEnd,
          charsLength
        });
        charsEnd = chars.length;
        charsLength = chars.length - charsBegin;
        opExecute(opIndex + 1, phraseIndex, sysData);
        const pop = lookAround.pop();
        charsEnd = pop.charsEnd;
        charsLength = pop.charsLength;
        sysData.phraseLength = 0;
        switch (sysData.state) {
          case id.EMPTY:
          case id.MATCH:
            sysData.state = id.NOMATCH;
            break;
          case id.NOMATCH:
            sysData.state = id.EMPTY;
            break;
          default:
            throw new Error(`opNOT: invalid state ${sysData.state}`);
        }
      };
      const opTRG = function(opIndex, phraseIndex, sysData) {
        const op = opcodes[opIndex];
        sysData.state = id.NOMATCH;
        if (phraseIndex < charsEnd) {
          if (op.min <= chars[phraseIndex] && chars[phraseIndex] <= op.max) {
            sysData.state = id.MATCH;
            sysData.phraseLength = 1;
          }
        }
      };
      const opTBS = function(opIndex, phraseIndex, sysData) {
        let i;
        const op = opcodes[opIndex];
        const len = op.string.length;
        sysData.state = id.NOMATCH;
        if (phraseIndex + len <= charsEnd) {
          for (i = 0; i < len; i += 1) {
            if (chars[phraseIndex + i] !== op.string[i]) {
              return;
            }
          }
          sysData.state = id.MATCH;
          sysData.phraseLength = len;
        }
      };
      const opTLS = function(opIndex, phraseIndex, sysData) {
        let i;
        let code;
        const op = opcodes[opIndex];
        sysData.state = id.NOMATCH;
        const len = op.string.length;
        if (len === 0) {
          sysData.state = id.EMPTY;
          return;
        }
        if (phraseIndex + len <= charsEnd) {
          for (i = 0; i < len; i += 1) {
            code = chars[phraseIndex + i];
            if (code >= 65 && code <= 90) {
              code += 32;
            }
            if (code !== op.string[i]) {
              return;
            }
          }
          sysData.state = id.MATCH;
          sysData.phraseLength = len;
        }
      };
      const opABG = function(opIndex, phraseIndex, sysData) {
        sysData.state = id.NOMATCH;
        sysData.phraseLength = 0;
        sysData.state = phraseIndex === 0 ? id.EMPTY : id.NOMATCH;
      };
      const opAEN = function(opIndex, phraseIndex, sysData) {
        sysData.state = id.NOMATCH;
        sysData.phraseLength = 0;
        sysData.state = phraseIndex === chars.length ? id.EMPTY : id.NOMATCH;
      };
      const opBKR = function(opIndex, phraseIndex, sysData) {
        let i;
        let code;
        let lmcode;
        let lower;
        const op = opcodes[opIndex];
        sysData.state = id.NOMATCH;
        if (op.index < rules.length) {
          lower = rules[op.index].lower;
        } else {
          lower = udts[op.index - rules.length].lower;
        }
        const frame = op.bkrMode === id.BKR_MODE_PM ? sysData.pFrame.getPhrase(lower) : sysData.uFrame.getPhrase(lower);
        const insensitive = op.bkrCase === id.BKR_MODE_CI;
        if (frame === null) {
          return;
        }
        const lmIndex = frame.phraseIndex;
        const len = frame.phraseLength;
        if (len === 0) {
          sysData.state = id.EMPTY;
          return;
        }
        if (phraseIndex + len <= charsEnd) {
          if (insensitive) {
            for (i = 0; i < len; i += 1) {
              code = chars[phraseIndex + i];
              lmcode = chars[lmIndex + i];
              if (code >= 65 && code <= 90) {
                code += 32;
              }
              if (lmcode >= 65 && lmcode <= 90) {
                lmcode += 32;
              }
              if (code !== lmcode) {
                return;
              }
            }
            sysData.state = id.MATCH;
            sysData.phraseLength = len;
          } else {
            for (i = 0; i < len; i += 1) {
              code = chars[phraseIndex + i];
              lmcode = chars[lmIndex + i];
              if (code !== lmcode) {
                return;
              }
            }
          }
          sysData.state = id.MATCH;
          sysData.phraseLength = len;
        }
      };
      const opBKA = function(opIndex, phraseIndex, sysData) {
        lookAround.push({
          lookAround: id.LOOKAROUND_BEHIND,
          anchor: phraseIndex
        });
        opExecute(opIndex + 1, phraseIndex, sysData);
        lookAround.pop();
        sysData.phraseLength = 0;
        switch (sysData.state) {
          case id.EMPTY:
            sysData.state = id.EMPTY;
            break;
          case id.MATCH:
            sysData.state = id.EMPTY;
            break;
          case id.NOMATCH:
            sysData.state = id.NOMATCH;
            break;
          default:
            throw new Error(`opBKA: invalid state ${sysData.state}`);
        }
      };
      const opBKN = function(opIndex, phraseIndex, sysData) {
        lookAround.push({
          lookAround: id.LOOKAROUND_BEHIND,
          anchor: phraseIndex
        });
        opExecute(opIndex + 1, phraseIndex, sysData);
        lookAround.pop();
        sysData.phraseLength = 0;
        switch (sysData.state) {
          case id.EMPTY:
          case id.MATCH:
            sysData.state = id.NOMATCH;
            break;
          case id.NOMATCH:
            sysData.state = id.EMPTY;
            break;
          default:
            throw new Error(`opBKN: invalid state ${sysData.state}`);
        }
      };
      const opCATBehind = function(opIndex, phraseIndex, sysData) {
        let success;
        let astLength;
        let catCharIndex;
        let catMatched;
        const op = opcodes[opIndex];
        const ulen = sysData.uFrame.length();
        const plen = sysData.pFrame.length();
        if (thisThis.ast) {
          astLength = thisThis.ast.getLength();
        }
        success = true;
        catCharIndex = phraseIndex;
        catMatched = 0;
        for (let i = op.children.length - 1; i >= 0; i -= 1) {
          opExecute(op.children[i], catCharIndex, sysData);
          catCharIndex -= sysData.phraseLength;
          catMatched += sysData.phraseLength;
          if (sysData.state === id.NOMATCH) {
            success = false;
            break;
          }
        }
        if (success) {
          sysData.state = catMatched === 0 ? id.EMPTY : id.MATCH;
          sysData.phraseLength = catMatched;
        } else {
          sysData.state = id.NOMATCH;
          sysData.phraseLength = 0;
          sysData.uFrame.pop(ulen);
          sysData.pFrame.pop(plen);
          if (thisThis.ast) {
            thisThis.ast.setLength(astLength);
          }
        }
      };
      const opREPBehind = function(opIndex, phraseIndex, sysData) {
        let astLength;
        let repCharIndex;
        let repPhrase;
        let repCount;
        const op = opcodes[opIndex];
        repCharIndex = phraseIndex;
        repPhrase = 0;
        repCount = 0;
        const ulen = sysData.uFrame.length();
        const plen = sysData.pFrame.length();
        if (thisThis.ast) {
          astLength = thisThis.ast.getLength();
        }
        const TRUE = true;
        while (TRUE) {
          if (repCharIndex <= 0) {
            break;
          }
          opExecute(opIndex + 1, repCharIndex, sysData);
          if (sysData.state === id.NOMATCH) {
            break;
          }
          if (sysData.state === id.EMPTY) {
            break;
          }
          repCount += 1;
          repPhrase += sysData.phraseLength;
          repCharIndex -= sysData.phraseLength;
          if (repCount === op.max) {
            break;
          }
        }
        if (sysData.state === id.EMPTY) {
          sysData.state = repPhrase === 0 ? id.EMPTY : id.MATCH;
          sysData.phraseLength = repPhrase;
        } else if (repCount >= op.min) {
          sysData.state = repPhrase === 0 ? id.EMPTY : id.MATCH;
          sysData.phraseLength = repPhrase;
        } else {
          sysData.state = id.NOMATCH;
          sysData.phraseLength = 0;
          sysData.uFrame.pop(ulen);
          sysData.pFrame.pop(plen);
          if (thisThis.ast) {
            thisThis.ast.setLength(astLength);
          }
        }
      };
      const opTRGBehind = function(opIndex, phraseIndex, sysData) {
        const op = opcodes[opIndex];
        sysData.state = id.NOMATCH;
        sysData.phraseLength = 0;
        if (phraseIndex > 0) {
          const char = chars[phraseIndex - 1];
          if (op.min <= char && char <= op.max) {
            sysData.state = id.MATCH;
            sysData.phraseLength = 1;
          }
        }
      };
      const opTBSBehind = function(opIndex, phraseIndex, sysData) {
        let i;
        const op = opcodes[opIndex];
        sysData.state = id.NOMATCH;
        const len = op.string.length;
        const beg = phraseIndex - len;
        if (beg >= 0) {
          for (i = 0; i < len; i += 1) {
            if (chars[beg + i] !== op.string[i]) {
              return;
            }
          }
          sysData.state = id.MATCH;
          sysData.phraseLength = len;
        }
      };
      const opTLSBehind = function(opIndex, phraseIndex, sysData) {
        let char;
        const op = opcodes[opIndex];
        sysData.state = id.NOMATCH;
        const len = op.string.length;
        if (len === 0) {
          sysData.state = id.EMPTY;
          return;
        }
        const beg = phraseIndex - len;
        if (beg >= 0) {
          for (let i = 0; i < len; i += 1) {
            char = chars[beg + i];
            if (char >= 65 && char <= 90) {
              char += 32;
            }
            if (char !== op.string[i]) {
              return;
            }
          }
          sysData.state = id.MATCH;
          sysData.phraseLength = len;
        }
      };
      const opBKRBehind = function(opIndex, phraseIndex, sysData) {
        let i;
        let code;
        let lmcode;
        let lower;
        const op = opcodes[opIndex];
        sysData.state = id.NOMATCH;
        sysData.phraseLength = 0;
        if (op.index < rules.length) {
          lower = rules[op.index].lower;
        } else {
          lower = udts[op.index - rules.length].lower;
        }
        const frame = op.bkrMode === id.BKR_MODE_PM ? sysData.pFrame.getPhrase(lower) : sysData.uFrame.getPhrase(lower);
        const insensitive = op.bkrCase === id.BKR_MODE_CI;
        if (frame === null) {
          return;
        }
        const lmIndex = frame.phraseIndex;
        const len = frame.phraseLength;
        if (len === 0) {
          sysData.state = id.EMPTY;
          sysData.phraseLength = 0;
          return;
        }
        const beg = phraseIndex - len;
        if (beg >= 0) {
          if (insensitive) {
            for (i = 0; i < len; i += 1) {
              code = chars[beg + i];
              lmcode = chars[lmIndex + i];
              if (code >= 65 && code <= 90) {
                code += 32;
              }
              if (lmcode >= 65 && lmcode <= 90) {
                lmcode += 32;
              }
              if (code !== lmcode) {
                return;
              }
            }
            sysData.state = id.MATCH;
            sysData.phraseLength = len;
          } else {
            for (i = 0; i < len; i += 1) {
              code = chars[beg + i];
              lmcode = chars[lmIndex + i];
              if (code !== lmcode) {
                return;
              }
            }
          }
          sysData.state = id.MATCH;
          sysData.phraseLength = len;
        }
      };
      opExecute = function opExecuteFunc(opIndex, phraseIndex, sysData) {
        let ret = true;
        const op = opcodes[opIndex];
        nodeHits += 1;
        if (nodeHits > limitNodeHits) {
          throw new Error(`parser: maximum number of node hits exceeded: ${limitNodeHits}`);
        }
        treeDepth += 1;
        if (treeDepth > maxTreeDepth) {
          maxTreeDepth = treeDepth;
          if (maxTreeDepth > limitTreeDepth) {
            throw new Error(`parser: maximum parse tree depth exceeded: ${limitTreeDepth}`);
          }
        }
        sysData.refresh();
        if (thisThis.trace !== null) {
          const lk = lookAroundValue();
          thisThis.trace.down(op, sysData.state, phraseIndex, sysData.phraseLength, lk.anchor, lk.lookAround);
        }
        if (inLookBehind()) {
          switch (op.type) {
            case id.ALT:
              opALT(opIndex, phraseIndex, sysData);
              break;
            case id.CAT:
              opCATBehind(opIndex, phraseIndex, sysData);
              break;
            case id.REP:
              opREPBehind(opIndex, phraseIndex, sysData);
              break;
            case id.RNM:
              opRNM(opIndex, phraseIndex, sysData);
              break;
            case id.UDT:
              opUDT(opIndex, phraseIndex, sysData);
              break;
            case id.AND:
              opAND(opIndex, phraseIndex, sysData);
              break;
            case id.NOT:
              opNOT(opIndex, phraseIndex, sysData);
              break;
            case id.TRG:
              opTRGBehind(opIndex, phraseIndex, sysData);
              break;
            case id.TBS:
              opTBSBehind(opIndex, phraseIndex, sysData);
              break;
            case id.TLS:
              opTLSBehind(opIndex, phraseIndex, sysData);
              break;
            case id.BKR:
              opBKRBehind(opIndex, phraseIndex, sysData);
              break;
            case id.BKA:
              opBKA(opIndex, phraseIndex, sysData);
              break;
            case id.BKN:
              opBKN(opIndex, phraseIndex, sysData);
              break;
            case id.ABG:
              opABG(opIndex, phraseIndex, sysData);
              break;
            case id.AEN:
              opAEN(opIndex, phraseIndex, sysData);
              break;
            default:
              ret = false;
              break;
          }
        } else {
          switch (op.type) {
            case id.ALT:
              opALT(opIndex, phraseIndex, sysData);
              break;
            case id.CAT:
              opCAT(opIndex, phraseIndex, sysData);
              break;
            case id.REP:
              opREP(opIndex, phraseIndex, sysData);
              break;
            case id.RNM:
              opRNM(opIndex, phraseIndex, sysData);
              break;
            case id.UDT:
              opUDT(opIndex, phraseIndex, sysData);
              break;
            case id.AND:
              opAND(opIndex, phraseIndex, sysData);
              break;
            case id.NOT:
              opNOT(opIndex, phraseIndex, sysData);
              break;
            case id.TRG:
              opTRG(opIndex, phraseIndex, sysData);
              break;
            case id.TBS:
              opTBS(opIndex, phraseIndex, sysData);
              break;
            case id.TLS:
              opTLS(opIndex, phraseIndex, sysData);
              break;
            case id.BKR:
              opBKR(opIndex, phraseIndex, sysData);
              break;
            case id.BKA:
              opBKA(opIndex, phraseIndex, sysData);
              break;
            case id.BKN:
              opBKN(opIndex, phraseIndex, sysData);
              break;
            case id.ABG:
              opABG(opIndex, phraseIndex, sysData);
              break;
            case id.AEN:
              opAEN(opIndex, phraseIndex, sysData);
              break;
            default:
              ret = false;
              break;
          }
        }
        if (!inLookAround() && phraseIndex + sysData.phraseLength > maxMatched) {
          maxMatched = phraseIndex + sysData.phraseLength;
        }
        if (thisThis.stats !== null) {
          thisThis.stats.collect(op, sysData);
        }
        if (thisThis.trace !== null) {
          const lk = lookAroundValue();
          thisThis.trace.up(op, sysData.state, phraseIndex, sysData.phraseLength, lk.anchor, lk.lookAround);
        }
        treeDepth -= 1;
        return ret;
      };
    };
  }
});

// ../../node_modules/apg-js/src/apg-lib/stats.js
var require_stats = __commonJS({
  "../../node_modules/apg-js/src/apg-lib/stats.js"(exports, module2) {
    init_esbuild_shims();
    module2.exports = function statsFunc() {
      const id = require_identifiers();
      const utils = require_utilities();
      const style = require_style();
      const thisFileName = "stats.js: ";
      let rules = [];
      let udts = [];
      const stats = [];
      let totals;
      const ruleStats = [];
      const udtStats = [];
      this.statsObject = "statsObject";
      const nameId = "stats";
      const sortAlpha = function sortAlpha2(lhs, rhs) {
        if (lhs.lower < rhs.lower) {
          return -1;
        }
        if (lhs.lower > rhs.lower) {
          return 1;
        }
        return 0;
      };
      const sortHits = function sortHits2(lhs, rhs) {
        if (lhs.total < rhs.total) {
          return 1;
        }
        if (lhs.total > rhs.total) {
          return -1;
        }
        return sortAlpha(lhs, rhs);
      };
      const sortIndex = function sortIndex2(lhs, rhs) {
        if (lhs.index < rhs.index) {
          return -1;
        }
        if (lhs.index > rhs.index) {
          return 1;
        }
        return 0;
      };
      const EmptyStat = function EmptyStat2() {
        this.empty = 0;
        this.match = 0;
        this.nomatch = 0;
        this.total = 0;
      };
      const clear = function clear2() {
        stats.length = 0;
        totals = new EmptyStat();
        stats[id.ALT] = new EmptyStat();
        stats[id.CAT] = new EmptyStat();
        stats[id.REP] = new EmptyStat();
        stats[id.RNM] = new EmptyStat();
        stats[id.TRG] = new EmptyStat();
        stats[id.TBS] = new EmptyStat();
        stats[id.TLS] = new EmptyStat();
        stats[id.UDT] = new EmptyStat();
        stats[id.AND] = new EmptyStat();
        stats[id.NOT] = new EmptyStat();
        stats[id.BKR] = new EmptyStat();
        stats[id.BKA] = new EmptyStat();
        stats[id.BKN] = new EmptyStat();
        stats[id.ABG] = new EmptyStat();
        stats[id.AEN] = new EmptyStat();
        ruleStats.length = 0;
        for (let i = 0; i < rules.length; i += 1) {
          ruleStats.push({
            empty: 0,
            match: 0,
            nomatch: 0,
            total: 0,
            name: rules[i].name,
            lower: rules[i].lower,
            index: rules[i].index
          });
        }
        if (udts.length > 0) {
          udtStats.length = 0;
          for (let i = 0; i < udts.length; i += 1) {
            udtStats.push({
              empty: 0,
              match: 0,
              nomatch: 0,
              total: 0,
              name: udts[i].name,
              lower: udts[i].lower,
              index: udts[i].index
            });
          }
        }
      };
      const incStat = function incStat2(stat, state) {
        stat.total += 1;
        switch (state) {
          case id.EMPTY:
            stat.empty += 1;
            break;
          case id.MATCH:
            stat.match += 1;
            break;
          case id.NOMATCH:
            stat.nomatch += 1;
            break;
          default:
            throw new Error(`${thisFileName}collect(): incStat(): unrecognized state: ${state}`);
        }
      };
      const displayRow = function displayRow2(name, stat) {
        let html = "";
        html += "<tr>";
        html += `<td class="${style.CLASS_ACTIVE}">${name}</td>`;
        html += `<td class="${style.CLASS_EMPTY}">${stat.empty}</td>`;
        html += `<td class="${style.CLASS_MATCH}">${stat.match}</td>`;
        html += `<td class="${style.CLASS_NOMATCH}">${stat.nomatch}</td>`;
        html += `<td class="${style.CLASS_ACTIVE}">${stat.total}</td>`;
        html += "</tr>\n";
        return html;
      };
      const displayOpsOnly = function displayOpsOnly2() {
        let html = "";
        html += displayRow("ALT", stats[id.ALT]);
        html += displayRow("CAT", stats[id.CAT]);
        html += displayRow("REP", stats[id.REP]);
        html += displayRow("RNM", stats[id.RNM]);
        html += displayRow("TRG", stats[id.TRG]);
        html += displayRow("TBS", stats[id.TBS]);
        html += displayRow("TLS", stats[id.TLS]);
        html += displayRow("UDT", stats[id.UDT]);
        html += displayRow("AND", stats[id.AND]);
        html += displayRow("NOT", stats[id.NOT]);
        html += displayRow("BKR", stats[id.BKR]);
        html += displayRow("BKA", stats[id.BKA]);
        html += displayRow("BKN", stats[id.BKN]);
        html += displayRow("ABG", stats[id.ABG]);
        html += displayRow("AEN", stats[id.AEN]);
        html += displayRow("totals", totals);
        return html;
      };
      const displayRules = function displayRules2() {
        let html = "";
        html += "<tr><th></th><th></th><th></th><th></th><th></th></tr>\n";
        html += "<tr><th>rules</th><th></th><th></th><th></th><th></th></tr>\n";
        for (let i = 0; i < rules.length; i += 1) {
          if (ruleStats[i].total > 0) {
            html += "<tr>";
            html += `<td class="${style.CLASS_ACTIVE}">${ruleStats[i].name}</td>`;
            html += `<td class="${style.CLASS_EMPTY}">${ruleStats[i].empty}</td>`;
            html += `<td class="${style.CLASS_MATCH}">${ruleStats[i].match}</td>`;
            html += `<td class="${style.CLASS_NOMATCH}">${ruleStats[i].nomatch}</td>`;
            html += `<td class="${style.CLASS_ACTIVE}">${ruleStats[i].total}</td>`;
            html += "</tr>\n";
          }
        }
        if (udts.length > 0) {
          html += "<tr><th></th><th></th><th></th><th></th><th></th></tr>\n";
          html += "<tr><th>udts</th><th></th><th></th><th></th><th></th></tr>\n";
          for (let i = 0; i < udts.length; i += 1) {
            if (udtStats[i].total > 0) {
              html += "<tr>";
              html += `<td class="${style.CLASS_ACTIVE}">${udtStats[i].name}</td>`;
              html += `<td class="${style.CLASS_EMPTY}">${udtStats[i].empty}</td>`;
              html += `<td class="${style.CLASS_MATCH}">${udtStats[i].match}</td>`;
              html += `<td class="${style.CLASS_NOMATCH}">${udtStats[i].nomatch}</td>`;
              html += `<td class="${style.CLASS_ACTIVE}">${udtStats[i].total}</td>`;
              html += "</tr>\n";
            }
          }
        }
        return html;
      };
      this.validate = function validate(name) {
        let ret = false;
        if (typeof name === "string" && nameId === name) {
          ret = true;
        }
        return ret;
      };
      this.init = function init(inputRules, inputUdts) {
        rules = inputRules;
        udts = inputUdts;
        clear();
      };
      this.collect = function collect(op, result) {
        incStat(totals, result.state, result.phraseLength);
        incStat(stats[op.type], result.state, result.phraseLength);
        if (op.type === id.RNM) {
          incStat(ruleStats[op.index], result.state, result.phraseLength);
        }
        if (op.type === id.UDT) {
          incStat(udtStats[op.index], result.state, result.phraseLength);
        }
      };
      this.toHtml = function toHtml(type, caption) {
        let html = "";
        html += `<table class="${style.CLASS_STATS}">
`;
        if (typeof caption === "string") {
          html += `<caption>${caption}</caption>
`;
        }
        html += `<tr><th class="${style.CLASS_ACTIVE}">ops</th>
`;
        html += `<th class="${style.CLASS_EMPTY}">EMPTY</th>
`;
        html += `<th class="${style.CLASS_MATCH}">MATCH</th>
`;
        html += `<th class="${style.CLASS_NOMATCH}">NOMATCH</th>
`;
        html += `<th class="${style.CLASS_ACTIVE}">totals</th></tr>
`;
        const test = true;
        while (test) {
          if (type === void 0) {
            html += displayOpsOnly();
            break;
          }
          if (type === null) {
            html += displayOpsOnly();
            break;
          }
          if (type === "ops") {
            html += displayOpsOnly();
            break;
          }
          if (type === "index") {
            ruleStats.sort(sortIndex);
            if (udtStats.length > 0) {
              udtStats.sort(sortIndex);
            }
            html += displayOpsOnly();
            html += displayRules();
            break;
          }
          if (type === "hits") {
            ruleStats.sort(sortHits);
            if (udtStats.length > 0) {
              udtStats.sort(sortIndex);
            }
            html += displayOpsOnly();
            html += displayRules();
            break;
          }
          if (type === "alpha") {
            ruleStats.sort(sortAlpha);
            if (udtStats.length > 0) {
              udtStats.sort(sortAlpha);
            }
            html += displayOpsOnly();
            html += displayRules();
            break;
          }
          break;
        }
        html += "</table>\n";
        return html;
      };
      this.toHtmlPage = function toHtmlPage(type, caption, title) {
        return utils.htmlToPage(this.toHtml(type, caption), title);
      };
    };
  }
});

// ../../node_modules/apg-js/src/apg-lib/trace.js
var require_trace = __commonJS({
  "../../node_modules/apg-js/src/apg-lib/trace.js"(exports, module2) {
    init_esbuild_shims();
    module2.exports = function exportTrace() {
      const utils = require_utilities();
      const style = require_style();
      const circular = new (require_circular_buffer())();
      const id = require_identifiers();
      const thisFileName = "trace.js: ";
      const that = this;
      const MODE_HEX = 16;
      const MODE_DEC = 10;
      const MODE_ASCII = 8;
      const MODE_UNICODE = 32;
      const MAX_PHRASE = 80;
      const MAX_TLS = 5;
      const records = [];
      let maxRecords = 5e3;
      let lastRecord = -1;
      let filteredRecords = 0;
      let treeDepth = 0;
      const recordStack = [];
      let chars = null;
      let rules = null;
      let udts = null;
      const operatorFilter = [];
      const ruleFilter = [];
      const PHRASE_END = `<span class="${style.CLASS_LINEEND}">&bull;</span>`;
      const PHRASE_CONTINUE = `<span class="${style.CLASS_LINEEND}">&hellip;</span>`;
      const PHRASE_EMPTY = `<span class="${style.CLASS_EMPTY}">&#120634;</span>`;
      const initOperatorFilter = function() {
        const setOperators = function(set) {
          operatorFilter[id.ALT] = set;
          operatorFilter[id.CAT] = set;
          operatorFilter[id.REP] = set;
          operatorFilter[id.TLS] = set;
          operatorFilter[id.TBS] = set;
          operatorFilter[id.TRG] = set;
          operatorFilter[id.AND] = set;
          operatorFilter[id.NOT] = set;
          operatorFilter[id.BKR] = set;
          operatorFilter[id.BKA] = set;
          operatorFilter[id.BKN] = set;
          operatorFilter[id.ABG] = set;
          operatorFilter[id.AEN] = set;
        };
        let items = 0;
        for (const name in that.filter.operators) {
          items += 1;
        }
        if (items === 0) {
          setOperators(false);
          return;
        }
        for (const name in that.filter.operators) {
          const upper = name.toUpperCase();
          if (upper === "<ALL>") {
            setOperators(true);
            return;
          }
          if (upper === "<NONE>") {
            setOperators(false);
            return;
          }
        }
        setOperators(false);
        for (const name in that.filter.operators) {
          const upper = name.toUpperCase();
          if (upper === "ALT") {
            operatorFilter[id.ALT] = that.filter.operators[name] === true;
          } else if (upper === "CAT") {
            operatorFilter[id.CAT] = that.filter.operators[name] === true;
          } else if (upper === "REP") {
            operatorFilter[id.REP] = that.filter.operators[name] === true;
          } else if (upper === "AND") {
            operatorFilter[id.AND] = that.filter.operators[name] === true;
          } else if (upper === "NOT") {
            operatorFilter[id.NOT] = that.filter.operators[name] === true;
          } else if (upper === "TLS") {
            operatorFilter[id.TLS] = that.filter.operators[name] === true;
          } else if (upper === "TBS") {
            operatorFilter[id.TBS] = that.filter.operators[name] === true;
          } else if (upper === "TRG") {
            operatorFilter[id.TRG] = that.filter.operators[name] === true;
          } else if (upper === "BKR") {
            operatorFilter[id.BKR] = that.filter.operators[name] === true;
          } else if (upper === "BKA") {
            operatorFilter[id.BKA] = that.filter.operators[name] === true;
          } else if (upper === "BKN") {
            operatorFilter[id.BKN] = that.filter.operators[name] === true;
          } else if (upper === "ABG") {
            operatorFilter[id.ABG] = that.filter.operators[name] === true;
          } else if (upper === "AEN") {
            operatorFilter[id.AEN] = that.filter.operators[name] === true;
          } else {
            throw new Error(`${thisFileName}initOpratorFilter: '${name}' not a valid operator name. Must be <all>, <none>, alt, cat, rep, tls, tbs, trg, and, not, bkr, bka or bkn`);
          }
        }
      };
      const initRuleFilter = function() {
        const setRules = function(set) {
          operatorFilter[id.RNM] = set;
          operatorFilter[id.UDT] = set;
          const count = rules.length + udts.length;
          ruleFilter.length = 0;
          for (let i2 = 0; i2 < count; i2 += 1) {
            ruleFilter.push(set);
          }
        };
        let items;
        let i;
        const list = [];
        for (i = 0; i < rules.length; i += 1) {
          list.push(rules[i].lower);
        }
        for (i = 0; i < udts.length; i += 1) {
          list.push(udts[i].lower);
        }
        ruleFilter.length = 0;
        items = 0;
        for (const name in that.filter.rules) {
          items += 1;
        }
        if (items === 0) {
          setRules(true);
          return;
        }
        for (const name in that.filter.rules) {
          const lower = name.toLowerCase();
          if (lower === "<all>") {
            setRules(true);
            return;
          }
          if (lower === "<none>") {
            setRules(false);
            return;
          }
        }
        setRules(false);
        operatorFilter[id.RNM] = true;
        operatorFilter[id.UDT] = true;
        for (const name in that.filter.rules) {
          const lower = name.toLowerCase();
          i = list.indexOf(lower);
          if (i < 0) {
            throw new Error(`${thisFileName}initRuleFilter: '${name}' not a valid rule or udt name`);
          }
          ruleFilter[i] = that.filter.rules[name] === true;
        }
      };
      this.traceObject = "traceObject";
      this.filter = {
        operators: [],
        rules: []
      };
      this.setMaxRecords = function(max, last) {
        lastRecord = -1;
        if (typeof max === "number" && max > 0) {
          maxRecords = Math.ceil(max);
        } else {
          maxRecords = 0;
          return;
        }
        if (typeof last === "number") {
          lastRecord = Math.floor(last);
          if (lastRecord < 0) {
            lastRecord = -1;
          }
        }
      };
      this.getMaxRecords = function() {
        return maxRecords;
      };
      this.getLastRecord = function() {
        return lastRecord;
      };
      this.init = function(rulesIn, udtsIn, charsIn) {
        records.length = 0;
        recordStack.length = 0;
        filteredRecords = 0;
        treeDepth = 0;
        chars = charsIn;
        rules = rulesIn;
        udts = udtsIn;
        initOperatorFilter();
        initRuleFilter();
        circular.init(maxRecords);
      };
      const filterOps = function(op) {
        let ret = false;
        if (op.type === id.RNM) {
          if (operatorFilter[op.type] && ruleFilter[op.index]) {
            ret = true;
          } else {
            ret = false;
          }
        } else if (op.type === id.UDT) {
          if (operatorFilter[op.type] && ruleFilter[rules.length + op.index]) {
            ret = true;
          } else {
            ret = false;
          }
        } else {
          ret = operatorFilter[op.type];
        }
        return ret;
      };
      const filterRecords = function(record) {
        if (lastRecord === -1) {
          return true;
        }
        if (record <= lastRecord) {
          return true;
        }
        return false;
      };
      this.down = function(op, state, offset, length, anchor, lookAround) {
        if (filterRecords(filteredRecords) && filterOps(op)) {
          recordStack.push(filteredRecords);
          records[circular.increment()] = {
            dirUp: false,
            depth: treeDepth,
            thisLine: filteredRecords,
            thatLine: void 0,
            opcode: op,
            state,
            phraseIndex: offset,
            phraseLength: length,
            lookAnchor: anchor,
            lookAround
          };
          filteredRecords += 1;
          treeDepth += 1;
        }
      };
      this.up = function(op, state, offset, length, anchor, lookAround) {
        if (filterRecords(filteredRecords) && filterOps(op)) {
          const thisLine = filteredRecords;
          const thatLine = recordStack.pop();
          const thatRecord = circular.getListIndex(thatLine);
          if (thatRecord !== -1) {
            records[thatRecord].thatLine = thisLine;
          }
          treeDepth -= 1;
          records[circular.increment()] = {
            dirUp: true,
            depth: treeDepth,
            thisLine,
            thatLine,
            opcode: op,
            state,
            phraseIndex: offset,
            phraseLength: length,
            lookAnchor: anchor,
            lookAround
          };
          filteredRecords += 1;
        }
      };
      const toTreeObj = function() {
        function nodeOpcode(node2, opcode) {
          let name;
          let casetype;
          let modetype;
          if (opcode) {
            node2.op = { id: opcode.type, name: utils.opcodeToString(opcode.type) };
            node2.opData = void 0;
            switch (opcode.type) {
              case id.RNM:
                node2.opData = rules[opcode.index].name;
                break;
              case id.UDT:
                node2.opData = udts[opcode.index].name;
                break;
              case id.BKR:
                if (opcode.index < rules.length) {
                  name = rules[opcode.index].name;
                } else {
                  name = udts[opcode.index - rules.length].name;
                }
                casetype = opcode.bkrCase === id.BKR_MODE_CI ? "%i" : "%s";
                modetype = opcode.bkrMode === id.BKR_MODE_UM ? "%u" : "%p";
                node2.opData = `\\\\${casetype}${modetype}${name}`;
                break;
              case id.TLS:
                node2.opData = [];
                for (let i = 0; i < opcode.string.length; i += 1) {
                  node2.opData.push(opcode.string[i]);
                }
                break;
              case id.TBS:
                node2.opData = [];
                for (let i = 0; i < opcode.string.length; i += 1) {
                  node2.opData.push(opcode.string[i]);
                }
                break;
              case id.TRG:
                node2.opData = [opcode.min, opcode.max];
                break;
              case id.REP:
                node2.opData = [opcode.min, opcode.max];
                break;
              default:
                throw new Error("unrecognized opcode");
            }
          } else {
            node2.op = { id: void 0, name: void 0 };
            node2.opData = void 0;
          }
        }
        function nodePhrase(state, index, length) {
          if (state === id.MATCH) {
            return {
              index,
              length
            };
          }
          if (state === id.NOMATCH) {
            return {
              index,
              length: 0
            };
          }
          if (state === id.EMPTY) {
            return {
              index,
              length: 0
            };
          }
          return null;
        }
        let nodeId = -1;
        function nodeDown(parent2, record2, depth2) {
          const node2 = {
            id: nodeId++,
            branch: -1,
            parent: parent2,
            up: false,
            down: false,
            depth: depth2,
            children: []
          };
          if (record2) {
            node2.down = true;
            node2.state = { id: record2.state, name: utils.stateToString(record2.state) };
            node2.phrase = null;
            nodeOpcode(node2, record2.opcode);
          } else {
            node2.state = { id: void 0, name: void 0 };
            node2.phrase = nodePhrase();
            nodeOpcode(node2, void 0);
          }
          return node2;
        }
        function nodeUp(node2, record2) {
          if (record2) {
            node2.up = true;
            node2.state = { id: record2.state, name: utils.stateToString(record2.state) };
            node2.phrase = nodePhrase(record2.state, record2.phraseIndex, record2.phraseLength);
            if (!node2.down) {
              nodeOpcode(node2, record2.opcode);
            }
          }
        }
        let leafNodes = 0;
        let depth = -1;
        let branchCount = 1;
        function walk(node2) {
          depth += 1;
          node2.branch = branchCount;
          if (depth > treeDepth) {
            treeDepth = depth;
          }
          if (node2.children.length === 0) {
            leafNodes += 1;
          } else {
            for (let i = 0; i < node2.children.length; i += 1) {
              if (i > 0) {
                branchCount += 1;
              }
              node2.children[i].leftMost = false;
              node2.children[i].rightMost = false;
              if (node2.leftMost) {
                node2.children[i].leftMost = i === 0;
              }
              if (node2.rightMost) {
                node2.children[i].rightMost = i === node2.children.length - 1;
              }
              walk(node2.children[i]);
            }
          }
          depth -= 1;
        }
        function display(node2, offset) {
          let name;
          const obj2 = {};
          obj2.id = node2.id;
          obj2.branch = node2.branch;
          obj2.leftMost = node2.leftMost;
          obj2.rightMost = node2.rightMost;
          name = node2.state.name ? node2.state.name : "ACTIVE";
          obj2.state = { id: node2.state.id, name };
          name = node2.op.name ? node2.op.name : "?";
          obj2.op = { id: node2.op.id, name };
          if (typeof node2.opData === "string") {
            obj2.opData = node2.opData;
          } else if (Array.isArray(node2.opData)) {
            obj2.opData = [];
            for (let i = 0; i < node2.opData.length; i += 1) {
              obj2.opData[i] = node2.opData[i];
            }
          } else {
            obj2.opData = void 0;
          }
          if (node2.phrase) {
            obj2.phrase = { index: node2.phrase.index, length: node2.phrase.length };
          } else {
            obj2.phrase = null;
          }
          obj2.depth = node2.depth;
          obj2.children = [];
          for (let i = 0; i < node2.children.length; i += 1) {
            const c = i !== node2.children.length - 1;
            obj2.children[i] = display(node2.children[i], offset, c);
          }
          return obj2;
        }
        const branch = [];
        let root;
        let node;
        let parent;
        let record;
        let firstRecord = true;
        const dummy = nodeDown(null, null, -1);
        branch.push(dummy);
        node = dummy;
        circular.forEach((lineIndex) => {
          record = records[lineIndex];
          if (firstRecord) {
            firstRecord = false;
            if (record.depth > 0) {
              const num = record.dirUp ? record.depth + 1 : record.depth;
              for (let i = 0; i < num; i += 1) {
                parent = node;
                node = nodeDown(node, null, i);
                branch.push(node);
                parent.children.push(node);
              }
            }
          }
          if (record.dirUp) {
            node = branch.pop();
            nodeUp(node, record);
            node = branch[branch.length - 1];
          } else {
            parent = node;
            node = nodeDown(node, record, record.depth);
            branch.push(node);
            parent.children.push(node);
          }
        });
        while (branch.length > 1) {
          node = branch.pop();
          nodeUp(node, null);
        }
        if (dummy.children.length === 0) {
          throw new Error("trace.toTree(): parse tree has no nodes");
        }
        if (branch.length === 0) {
          throw new Error("trace.toTree(): integrity check: dummy root node disappeared?");
        }
        root = dummy.children[0];
        let prev = root;
        while (root && !root.down && !root.up) {
          prev = root;
          root = root.children[0];
        }
        root = prev;
        root.leftMost = true;
        root.rightMost = true;
        walk(root);
        root.branch = 0;
        const obj = {};
        obj.string = [];
        for (let i = 0; i < chars.length; i += 1) {
          obj.string[i] = chars[i];
        }
        obj.rules = [];
        for (let i = 0; i < rules.length; i += 1) {
          obj.rules[i] = rules[i].name;
        }
        obj.udts = [];
        for (let i = 0; i < udts.length; i += 1) {
          obj.udts[i] = udts[i].name;
        }
        obj.id = {};
        obj.id.ALT = { id: id.ALT, name: "ALT" };
        obj.id.CAT = { id: id.CAT, name: "CAT" };
        obj.id.REP = { id: id.REP, name: "REP" };
        obj.id.RNM = { id: id.RNM, name: "RNM" };
        obj.id.TLS = { id: id.TLS, name: "TLS" };
        obj.id.TBS = { id: id.TBS, name: "TBS" };
        obj.id.TRG = { id: id.TRG, name: "TRG" };
        obj.id.UDT = { id: id.UDT, name: "UDT" };
        obj.id.AND = { id: id.AND, name: "AND" };
        obj.id.NOT = { id: id.NOT, name: "NOT" };
        obj.id.BKR = { id: id.BKR, name: "BKR" };
        obj.id.BKA = { id: id.BKA, name: "BKA" };
        obj.id.BKN = { id: id.BKN, name: "BKN" };
        obj.id.ABG = { id: id.ABG, name: "ABG" };
        obj.id.AEN = { id: id.AEN, name: "AEN" };
        obj.id.ACTIVE = { id: id.ACTIVE, name: "ACTIVE" };
        obj.id.MATCH = { id: id.MATCH, name: "MATCH" };
        obj.id.EMPTY = { id: id.EMPTY, name: "EMPTY" };
        obj.id.NOMATCH = { id: id.NOMATCH, name: "NOMATCH" };
        obj.treeDepth = treeDepth;
        obj.leafNodes = leafNodes;
        let branchesIncomplete;
        if (root.down) {
          if (root.up) {
            branchesIncomplete = "none";
          } else {
            branchesIncomplete = "right";
          }
        } else if (root.up) {
          branchesIncomplete = "left";
        } else {
          branchesIncomplete = "both";
        }
        obj.branchesIncomplete = branchesIncomplete;
        obj.tree = display(root, root.depth, false);
        return obj;
      };
      this.toTree = function(stringify) {
        const obj = toTreeObj();
        if (stringify) {
          return JSON.stringify(obj);
        }
        return obj;
      };
      this.toHtmlPage = function(mode2, caption, title) {
        return utils.htmlToPage(this.toHtml(mode2, caption), title);
      };
      const htmlHeader = function(mode2, caption) {
        let modeName;
        switch (mode2) {
          case MODE_HEX:
            modeName = "hexidecimal";
            break;
          case MODE_DEC:
            modeName = "decimal";
            break;
          case MODE_ASCII:
            modeName = "ASCII";
            break;
          case MODE_UNICODE:
            modeName = "UNICODE";
            break;
          default:
            throw new Error(`${thisFileName}htmlHeader: unrecognized mode: ${mode2}`);
        }
        let header = "";
        header += `<p>display mode: ${modeName}</p>
`;
        header += `<table class="${style.CLASS_TRACE}">
`;
        if (typeof caption === "string") {
          header += `<caption>${caption}</caption>`;
        }
        return header;
      };
      const htmlFooter = function() {
        let footer = "";
        footer += "</table>\n";
        footer += `<p class="${style.CLASS_MONOSPACE}">legend:<br>
`;
        footer += "(a)&nbsp;-&nbsp;line number<br>\n";
        footer += "(b)&nbsp;-&nbsp;matching line number<br>\n";
        footer += "(c)&nbsp;-&nbsp;phrase offset<br>\n";
        footer += "(d)&nbsp;-&nbsp;phrase length<br>\n";
        footer += "(e)&nbsp;-&nbsp;tree depth<br>\n";
        footer += "(f)&nbsp;-&nbsp;operator state<br>\n";
        footer += `&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;<span class="${style.CLASS_ACTIVE}">&darr;</span>&nbsp;&nbsp;phrase opened<br>
`;
        footer += `&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;<span class="${style.CLASS_MATCH}">&uarr;M</span> phrase matched<br>
`;
        footer += `&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;<span class="${style.CLASS_EMPTY}">&uarr;E</span> empty phrase matched<br>
`;
        footer += `&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;<span class="${style.CLASS_NOMATCH}">&uarr;N</span> phrase not matched<br>
`;
        footer += "operator&nbsp;-&nbsp;ALT, CAT, REP, RNM, TRG, TLS, TBS<sup>&dagger;</sup>, UDT, AND, NOT, BKA, BKN, BKR, ABG, AEN<sup>&Dagger;</sup><br>\n";
        footer += `phrase&nbsp;&nbsp;&nbsp;-&nbsp;up to ${MAX_PHRASE} characters of the phrase being matched<br>
`;
        footer += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;<span class="${style.CLASS_MATCH}">matched characters</span><br>
`;
        footer += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;<span class="${style.CLASS_LOOKAHEAD}">matched characters in look ahead mode</span><br>
`;
        footer += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;<span class="${style.CLASS_LOOKBEHIND}">matched characters in look behind mode</span><br>
`;
        footer += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;<span class="${style.CLASS_REMAINDER}">remainder characters(not yet examined by parser)</span><br>
`;
        footer += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;<span class="${style.CLASS_CTRLCHAR}">control characters, TAB, LF, CR, etc. (ASCII mode only)</span><br>
`;
        footer += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;${PHRASE_EMPTY} empty string<br>
`;
        footer += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;${PHRASE_END} end of input string<br>
`;
        footer += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;${PHRASE_CONTINUE} input string display truncated<br>
`;
        footer += "</p>\n";
        footer += `<p class="${style.CLASS_MONOSPACE}">
`;
        footer += "<sup>&dagger;</sup>original ABNF operators:<br>\n";
        footer += "ALT - alternation<br>\n";
        footer += "CAT - concatenation<br>\n";
        footer += "REP - repetition<br>\n";
        footer += "RNM - rule name<br>\n";
        footer += "TRG - terminal range<br>\n";
        footer += "TLS - terminal literal string (case insensitive)<br>\n";
        footer += "TBS - terminal binary string (case sensitive)<br>\n";
        footer += "<br>\n";
        footer += "<sup>&Dagger;</sup>super set SABNF operators:<br>\n";
        footer += "UDT - user-defined terminal<br>\n";
        footer += "AND - positive look ahead<br>\n";
        footer += "NOT - negative look ahead<br>\n";
        footer += "BKA - positive look behind<br>\n";
        footer += "BKN - negative look behind<br>\n";
        footer += "BKR - back reference<br>\n";
        footer += "ABG - anchor - begin of input string<br>\n";
        footer += "AEN - anchor - end of input string<br>\n";
        footer += "</p>\n";
        return footer;
      };
      this.indent = function(depth) {
        let html = "";
        for (let i = 0; i < depth; i += 1) {
          html += ".";
        }
        return html;
      };
      const displayTrg = function(mode2, op) {
        let html = "";
        if (op.type === id.TRG) {
          if (mode2 === MODE_HEX || mode2 === MODE_UNICODE) {
            let hex = op.min.toString(16).toUpperCase();
            if (hex.length % 2 !== 0) {
              hex = `0${hex}`;
            }
            html += mode2 === MODE_HEX ? "%x" : "U+";
            html += hex;
            hex = op.max.toString(16).toUpperCase();
            if (hex.length % 2 !== 0) {
              hex = `0${hex}`;
            }
            html += `&ndash;${hex}`;
          } else {
            html = `%d${op.min.toString(10)}&ndash;${op.max.toString(10)}`;
          }
        }
        return html;
      };
      const displayRep = function(mode2, op) {
        let html = "";
        if (op.type === id.REP) {
          if (mode2 === MODE_HEX) {
            let hex = op.min.toString(16).toUpperCase();
            if (hex.length % 2 !== 0) {
              hex = `0${hex}`;
            }
            html = `x${hex}`;
            if (op.max < Infinity) {
              hex = op.max.toString(16).toUpperCase();
              if (hex.length % 2 !== 0) {
                hex = `0${hex}`;
              }
            } else {
              hex = "inf";
            }
            html += `&ndash;${hex}`;
          } else if (op.max < Infinity) {
            html = `${op.min.toString(10)}&ndash;${op.max.toString(10)}`;
          } else {
            html = `${op.min.toString(10)}&ndash;inf`;
          }
        }
        return html;
      };
      const displayTbs = function(mode2, op) {
        let html = "";
        if (op.type === id.TBS) {
          const len = Math.min(op.string.length, MAX_TLS * 2);
          if (mode2 === MODE_HEX || mode2 === MODE_UNICODE) {
            html += mode2 === MODE_HEX ? "%x" : "U+";
            for (let i = 0; i < len; i += 1) {
              let hex;
              if (i > 0) {
                html += ".";
              }
              hex = op.string[i].toString(16).toUpperCase();
              if (hex.length % 2 !== 0) {
                hex = `0${hex}`;
              }
              html += hex;
            }
          } else {
            html = "%d";
            for (let i = 0; i < len; i += 1) {
              if (i > 0) {
                html += ".";
              }
              html += op.string[i].toString(10);
            }
          }
          if (len < op.string.length) {
            html += PHRASE_CONTINUE;
          }
        }
        return html;
      };
      const displayTls = function(mode2, op) {
        let html = "";
        if (op.type === id.TLS) {
          const len = Math.min(op.string.length, MAX_TLS);
          if (mode2 === MODE_HEX || mode2 === MODE_DEC) {
            let charu;
            let charl;
            let base;
            if (mode2 === MODE_HEX) {
              html = "%x";
              base = 16;
            } else {
              html = "%d";
              base = 10;
            }
            for (let i = 0; i < len; i += 1) {
              if (i > 0) {
                html += ".";
              }
              charl = op.string[i];
              if (charl >= 97 && charl <= 122) {
                charu = charl - 32;
                html += `${charu.toString(base)}/${charl.toString(base)}`.toUpperCase();
              } else if (charl >= 65 && charl <= 90) {
                charu = charl;
                charl += 32;
                html += `${charu.toString(base)}/${charl.toString(base)}`.toUpperCase();
              } else {
                html += charl.toString(base).toUpperCase();
              }
            }
            if (len < op.string.length) {
              html += PHRASE_CONTINUE;
            }
          } else {
            html = '"';
            for (let i = 0; i < len; i += 1) {
              html += utils.asciiChars[op.string[i]];
            }
            if (len < op.string.length) {
              html += PHRASE_CONTINUE;
            }
            html += '"';
          }
        }
        return html;
      };
      const subPhrase = function(mode2, charsArg, index, length, prev) {
        if (length === 0) {
          return "";
        }
        let phrase = "";
        const comma = prev ? "," : "";
        switch (mode2) {
          case MODE_HEX:
            phrase = comma + utils.charsToHex(charsArg, index, length);
            break;
          case MODE_DEC:
            if (prev) {
              return `,${utils.charsToDec(charsArg, index, length)}`;
            }
            phrase = comma + utils.charsToDec(charsArg, index, length);
            break;
          case MODE_UNICODE:
            phrase = utils.charsToUnicode(charsArg, index, length);
            break;
          case MODE_ASCII:
          default:
            phrase = utils.charsToAsciiHtml(charsArg, index, length);
            break;
        }
        return phrase;
      };
      const displayBehind = function(mode2, charsArg, state, index, length, anchor) {
        let html = "";
        let beg1;
        let len1;
        let beg2;
        let len2;
        let lastchar = PHRASE_END;
        const spanBehind = `<span class="${style.CLASS_LOOKBEHIND}">`;
        const spanRemainder = `<span class="${style.CLASS_REMAINDER}">`;
        const spanend = "</span>";
        let prev = false;
        switch (state) {
          case id.EMPTY:
            html += PHRASE_EMPTY;
          case id.NOMATCH:
          case id.MATCH:
          case id.ACTIVE:
            beg1 = index - length;
            len1 = anchor - beg1;
            beg2 = anchor;
            len2 = charsArg.length - beg2;
            break;
          default:
            throw new Error("unrecognized state");
        }
        lastchar = PHRASE_END;
        if (len1 > MAX_PHRASE) {
          len1 = MAX_PHRASE;
          lastchar = PHRASE_CONTINUE;
          len2 = 0;
        } else if (len1 + len2 > MAX_PHRASE) {
          lastchar = PHRASE_CONTINUE;
          len2 = MAX_PHRASE - len1;
        }
        if (len1 > 0) {
          html += spanBehind;
          html += subPhrase(mode2, charsArg, beg1, len1, prev);
          html += spanend;
          prev = true;
        }
        if (len2 > 0) {
          html += spanRemainder;
          html += subPhrase(mode2, charsArg, beg2, len2, prev);
          html += spanend;
        }
        return html + lastchar;
      };
      const displayForward = function(mode2, charsArg, state, index, length, spanAhead) {
        let html = "";
        let beg1;
        let len1;
        let beg2;
        let len2;
        let lastchar = PHRASE_END;
        const spanRemainder = `<span class="${style.CLASS_REMAINDER}">`;
        const spanend = "</span>";
        let prev = false;
        switch (state) {
          case id.EMPTY:
            html += PHRASE_EMPTY;
          case id.NOMATCH:
          case id.ACTIVE:
            beg1 = index;
            len1 = 0;
            beg2 = index;
            len2 = charsArg.length - beg2;
            break;
          case id.MATCH:
            beg1 = index;
            len1 = length;
            beg2 = index + len1;
            len2 = charsArg.length - beg2;
            break;
          default:
            throw new Error("unrecognized state");
        }
        lastchar = PHRASE_END;
        if (len1 > MAX_PHRASE) {
          len1 = MAX_PHRASE;
          lastchar = PHRASE_CONTINUE;
          len2 = 0;
        } else if (len1 + len2 > MAX_PHRASE) {
          lastchar = PHRASE_CONTINUE;
          len2 = MAX_PHRASE - len1;
        }
        if (len1 > 0) {
          html += spanAhead;
          html += subPhrase(mode2, charsArg, beg1, len1, prev);
          html += spanend;
          prev = true;
        }
        if (len2 > 0) {
          html += spanRemainder;
          html += subPhrase(mode2, charsArg, beg2, len2, prev);
          html += spanend;
        }
        return html + lastchar;
      };
      const displayAhead = function(mode2, charsArg, state, index, length) {
        const spanAhead = `<span class="${style.CLASS_LOOKAHEAD}">`;
        return displayForward(mode2, charsArg, state, index, length, spanAhead);
      };
      const displayNone = function(mode2, charsArg, state, index, length) {
        const spanAhead = `<span class="${style.CLASS_MATCH}">`;
        return displayForward(mode2, charsArg, state, index, length, spanAhead);
      };
      const htmlTable = function(mode2) {
        if (rules === null) {
          return "";
        }
        let html = "";
        let thisLine;
        let thatLine;
        let lookAhead;
        let lookBehind;
        let lookAround;
        let anchor;
        html += "<tr><th>(a)</th><th>(b)</th><th>(c)</th><th>(d)</th><th>(e)</th><th>(f)</th>";
        html += "<th>operator</th><th>phrase</th></tr>\n";
        circular.forEach((lineIndex) => {
          const line = records[lineIndex];
          thisLine = line.thisLine;
          thatLine = line.thatLine !== void 0 ? line.thatLine : "--";
          lookAhead = false;
          lookBehind = false;
          lookAround = false;
          if (line.lookAround === id.LOOKAROUND_AHEAD) {
            lookAhead = true;
            lookAround = true;
            anchor = line.lookAnchor;
          }
          if (line.opcode.type === id.AND || line.opcode.type === id.NOT) {
            lookAhead = true;
            lookAround = true;
            anchor = line.phraseIndex;
          }
          if (line.lookAround === id.LOOKAROUND_BEHIND) {
            lookBehind = true;
            lookAround = true;
            anchor = line.lookAnchor;
          }
          if (line.opcode.type === id.BKA || line.opcode.type === id.BKN) {
            lookBehind = true;
            lookAround = true;
            anchor = line.phraseIndex;
          }
          html += "<tr>";
          html += `<td>${thisLine}</td><td>${thatLine}</td>`;
          html += `<td>${line.phraseIndex}</td>`;
          html += `<td>${line.phraseLength}</td>`;
          html += `<td>${line.depth}</td>`;
          html += "<td>";
          switch (line.state) {
            case id.ACTIVE:
              html += `<span class="${style.CLASS_ACTIVE}">&darr;&nbsp;</span>`;
              break;
            case id.MATCH:
              html += `<span class="${style.CLASS_MATCH}">&uarr;M</span>`;
              break;
            case id.NOMATCH:
              html += `<span class="${style.CLASS_NOMATCH}">&uarr;N</span>`;
              break;
            case id.EMPTY:
              html += `<span class="${style.CLASS_EMPTY}">&uarr;E</span>`;
              break;
            default:
              html += `<span class="${style.CLASS_ACTIVE}">--</span>`;
              break;
          }
          html += "</td>";
          html += "<td>";
          html += that.indent(line.depth);
          if (lookAhead) {
            html += `<span class="${style.CLASS_LOOKAHEAD}">`;
          } else if (lookBehind) {
            html += `<span class="${style.CLASS_LOOKBEHIND}">`;
          }
          html += utils.opcodeToString(line.opcode.type);
          if (line.opcode.type === id.RNM) {
            html += `(${rules[line.opcode.index].name}) `;
          }
          if (line.opcode.type === id.BKR) {
            const casetype = line.opcode.bkrCase === id.BKR_MODE_CI ? "%i" : "%s";
            const modetype = line.opcode.bkrMode === id.BKR_MODE_UM ? "%u" : "%p";
            html += `(\\${casetype}${modetype}${rules[line.opcode.index].name}) `;
          }
          if (line.opcode.type === id.UDT) {
            html += `(${udts[line.opcode.index].name}) `;
          }
          if (line.opcode.type === id.TRG) {
            html += `(${displayTrg(mode2, line.opcode)}) `;
          }
          if (line.opcode.type === id.TBS) {
            html += `(${displayTbs(mode2, line.opcode)}) `;
          }
          if (line.opcode.type === id.TLS) {
            html += `(${displayTls(mode2, line.opcode)}) `;
          }
          if (line.opcode.type === id.REP) {
            html += `(${displayRep(mode2, line.opcode)}) `;
          }
          if (lookAround) {
            html += "</span>";
          }
          html += "</td>";
          html += "<td>";
          if (lookBehind) {
            html += displayBehind(mode2, chars, line.state, line.phraseIndex, line.phraseLength, anchor);
          } else if (lookAhead) {
            html += displayAhead(mode2, chars, line.state, line.phraseIndex, line.phraseLength);
          } else {
            html += displayNone(mode2, chars, line.state, line.phraseIndex, line.phraseLength);
          }
          html += "</td></tr>\n";
        });
        html += "<tr><th>(a)</th><th>(b)</th><th>(c)</th><th>(d)</th><th>(e)</th><th>(f)</th>";
        html += "<th>operator</th><th>phrase</th></tr>\n";
        html += "</table>\n";
        return html;
      };
      this.toHtml = function(modearg, caption) {
        let mode2 = MODE_ASCII;
        if (typeof modearg === "string" && modearg.length >= 3) {
          const modein = modearg.toLowerCase().slice(0, 3);
          if (modein === "hex") {
            mode2 = MODE_HEX;
          } else if (modein === "dec") {
            mode2 = MODE_DEC;
          } else if (modein === "uni") {
            mode2 = MODE_UNICODE;
          }
        }
        let html = "";
        html += htmlHeader(mode2, caption);
        html += htmlTable(mode2);
        html += htmlFooter();
        return html;
      };
    };
  }
});

// ../../node_modules/apg-js/src/apg-lib/node-exports.js
var require_node_exports = __commonJS({
  "../../node_modules/apg-js/src/apg-lib/node-exports.js"(exports, module2) {
    init_esbuild_shims();
    module2.exports = {
      ast: require_ast(),
      circular: require_circular_buffer(),
      ids: require_identifiers(),
      parser: require_parser(),
      stats: require_stats(),
      trace: require_trace(),
      utils: require_utilities(),
      emitcss: require_emitcss(),
      style: require_style()
    };
  }
});

// ../../node_modules/apg-js/src/apg-api/scanner-grammar.js
var require_scanner_grammar = __commonJS({
  "../../node_modules/apg-js/src/apg-api/scanner-grammar.js"(exports, module2) {
    init_esbuild_shims();
    module2.exports = function grammar() {
      this.grammarObject = "grammarObject";
      this.rules = [];
      this.rules[0] = { name: "file", lower: "file", index: 0, isBkr: false };
      this.rules[1] = { name: "line", lower: "line", index: 1, isBkr: false };
      this.rules[2] = { name: "line-text", lower: "line-text", index: 2, isBkr: false };
      this.rules[3] = { name: "last-line", lower: "last-line", index: 3, isBkr: false };
      this.rules[4] = { name: "valid", lower: "valid", index: 4, isBkr: false };
      this.rules[5] = { name: "invalid", lower: "invalid", index: 5, isBkr: false };
      this.rules[6] = { name: "end", lower: "end", index: 6, isBkr: false };
      this.rules[7] = { name: "CRLF", lower: "crlf", index: 7, isBkr: false };
      this.rules[8] = { name: "LF", lower: "lf", index: 8, isBkr: false };
      this.rules[9] = { name: "CR", lower: "cr", index: 9, isBkr: false };
      this.udts = [];
      this.rules[0].opcodes = [];
      this.rules[0].opcodes[0] = { type: 2, children: [1, 3] };
      this.rules[0].opcodes[1] = { type: 3, min: 0, max: Infinity };
      this.rules[0].opcodes[2] = { type: 4, index: 1 };
      this.rules[0].opcodes[3] = { type: 3, min: 0, max: 1 };
      this.rules[0].opcodes[4] = { type: 4, index: 3 };
      this.rules[1].opcodes = [];
      this.rules[1].opcodes[0] = { type: 2, children: [1, 2] };
      this.rules[1].opcodes[1] = { type: 4, index: 2 };
      this.rules[1].opcodes[2] = { type: 4, index: 6 };
      this.rules[2].opcodes = [];
      this.rules[2].opcodes[0] = { type: 3, min: 0, max: Infinity };
      this.rules[2].opcodes[1] = { type: 1, children: [2, 3] };
      this.rules[2].opcodes[2] = { type: 4, index: 4 };
      this.rules[2].opcodes[3] = { type: 4, index: 5 };
      this.rules[3].opcodes = [];
      this.rules[3].opcodes[0] = { type: 3, min: 1, max: Infinity };
      this.rules[3].opcodes[1] = { type: 1, children: [2, 3] };
      this.rules[3].opcodes[2] = { type: 4, index: 4 };
      this.rules[3].opcodes[3] = { type: 4, index: 5 };
      this.rules[4].opcodes = [];
      this.rules[4].opcodes[0] = { type: 1, children: [1, 2] };
      this.rules[4].opcodes[1] = { type: 5, min: 32, max: 126 };
      this.rules[4].opcodes[2] = { type: 6, string: [9] };
      this.rules[5].opcodes = [];
      this.rules[5].opcodes[0] = { type: 1, children: [1, 2, 3, 4] };
      this.rules[5].opcodes[1] = { type: 5, min: 0, max: 8 };
      this.rules[5].opcodes[2] = { type: 5, min: 11, max: 12 };
      this.rules[5].opcodes[3] = { type: 5, min: 14, max: 31 };
      this.rules[5].opcodes[4] = { type: 5, min: 127, max: 4294967295 };
      this.rules[6].opcodes = [];
      this.rules[6].opcodes[0] = { type: 1, children: [1, 2, 3] };
      this.rules[6].opcodes[1] = { type: 4, index: 7 };
      this.rules[6].opcodes[2] = { type: 4, index: 8 };
      this.rules[6].opcodes[3] = { type: 4, index: 9 };
      this.rules[7].opcodes = [];
      this.rules[7].opcodes[0] = { type: 6, string: [13, 10] };
      this.rules[8].opcodes = [];
      this.rules[8].opcodes[0] = { type: 6, string: [10] };
      this.rules[9].opcodes = [];
      this.rules[9].opcodes[0] = { type: 6, string: [13] };
      this.toString = function toString() {
        let str = "";
        str += "file = *line [last-line]\n";
        str += "line = line-text end\n";
        str += "line-text = *(valid/invalid)\n";
        str += "last-line = 1*(valid/invalid)\n";
        str += "valid = %d32-126 / %d9\n";
        str += "invalid = %d0-8 / %d11-12 /%d14-31 / %x7f-ffffffff\n";
        str += "end = CRLF / LF / CR\n";
        str += "CRLF = %d13.10\n";
        str += "LF = %d10\n";
        str += "CR = %d13\n";
        return str;
      };
    };
  }
});

// ../../node_modules/apg-js/src/apg-api/scanner-callbacks.js
var require_scanner_callbacks = __commonJS({
  "../../node_modules/apg-js/src/apg-api/scanner-callbacks.js"(exports) {
    init_esbuild_shims();
    var ids = require_identifiers();
    var utils = require_utilities();
    function semLine(state, chars, phraseIndex, phraseCount, data) {
      if (state === ids.SEM_PRE) {
        data.endLength = 0;
        data.textLength = 0;
        data.invalidCount = 0;
      } else {
        data.lines.push({
          lineNo: data.lines.length,
          beginChar: phraseIndex,
          length: phraseCount,
          textLength: data.textLength,
          endType: data.endType,
          invalidChars: data.invalidCount
        });
      }
      return ids.SEM_OK;
    }
    function semLineText(state, chars, phraseIndex, phraseCount, data) {
      if (state === ids.SEM_PRE) {
        data.textLength = phraseCount;
      }
      return ids.SEM_OK;
    }
    function semLastLine(state, chars, phraseIndex, phraseCount, data) {
      if (state === ids.SEM_PRE) {
        data.endLength = 0;
        data.textLength = 0;
        data.invalidCount = 0;
      } else if (data.strict) {
        data.lines.push({
          lineNo: data.lines.length,
          beginChar: phraseIndex,
          length: phraseCount,
          textLength: phraseCount,
          endType: "none",
          invalidChars: data.invalidCount
        });
        data.errors.push({
          line: data.lineNo,
          char: phraseIndex + phraseCount,
          msg: "no line end on last line - strict ABNF specifies CRLF(\\r\\n, \\x0D\\x0A)"
        });
      } else {
        chars.push(10);
        data.lines.push({
          lineNo: data.lines.length,
          beginChar: phraseIndex,
          length: phraseCount + 1,
          textLength: phraseCount,
          endType: "LF",
          invalidChars: data.invalidCount
        });
      }
      return ids.SEM_OK;
    }
    function semInvalid(state, chars, phraseIndex, phraseCount, data) {
      if (state === ids.SEM_PRE) {
        data.errors.push({
          line: data.lineNo,
          char: phraseIndex,
          msg: `invalid character found '\\x${utils.charToHex(chars[phraseIndex])}'`
        });
      }
      return ids.SEM_OK;
    }
    function semEnd(state, chars, phraseIndex, phraseCount, data) {
      if (state === ids.SEM_POST) {
        data.lineNo += 1;
      }
      return ids.SEM_OK;
    }
    function semLF(state, chars, phraseIndex, phraseCount, data) {
      if (state === ids.SEM_PRE) {
        data.endType = "LF";
        if (data.strict) {
          data.errors.push({
            line: data.lineNo,
            char: phraseIndex,
            msg: "line end character LF(\\n, \\x0A) - strict ABNF specifies CRLF(\\r\\n, \\x0D\\x0A)"
          });
        }
      }
      return ids.SEM_OK;
    }
    function semCR(state, chars, phraseIndex, phraseCount, data) {
      if (state === ids.SEM_PRE) {
        data.endType = "CR";
        if (data.strict) {
          data.errors.push({
            line: data.lineNo,
            char: phraseIndex,
            msg: "line end character CR(\\r, \\x0D) - strict ABNF specifies CRLF(\\r\\n, \\x0D\\x0A)"
          });
        }
      }
      return ids.SEM_OK;
    }
    function semCRLF(state, chars, phraseIndex, phraseCount, data) {
      if (state === ids.SEM_PRE) {
        data.endType = "CRLF";
      }
      return ids.SEM_OK;
    }
    var callbacks = [];
    callbacks.line = semLine;
    callbacks["line-text"] = semLineText;
    callbacks["last-line"] = semLastLine;
    callbacks.invalid = semInvalid;
    callbacks.end = semEnd;
    callbacks.lf = semLF;
    callbacks.cr = semCR;
    callbacks.crlf = semCRLF;
    exports.callbacks = callbacks;
  }
});

// ../../node_modules/apg-js/src/apg-api/scanner.js
var require_scanner = __commonJS({
  "../../node_modules/apg-js/src/apg-api/scanner.js"(exports, module2) {
    init_esbuild_shims();
    module2.exports = function exports2(chars, errors, strict, trace) {
      const thisFileName = "scanner.js: ";
      const apglib = require_node_exports();
      const grammar = new (require_scanner_grammar())();
      const { callbacks } = require_scanner_callbacks();
      const lines = [];
      const parser = new apglib.parser();
      parser.ast = new apglib.ast();
      parser.ast.callbacks = callbacks;
      if (trace) {
        if (trace.traceObject !== "traceObject") {
          throw new TypeError(`${thisFileName}trace argument is not a trace object`);
        }
        parser.trace = trace;
      }
      const test = parser.parse(grammar, "file", chars);
      if (test.success !== true) {
        errors.push({
          line: 0,
          char: 0,
          msg: "syntax analysis error analyzing input SABNF grammar"
        });
        return;
      }
      const data = {
        lines,
        lineNo: 0,
        errors,
        strict: !!strict
      };
      parser.ast.translate(data);
      return lines;
    };
  }
});

// ../../node_modules/apg-js/src/apg-api/syntax-callbacks.js
var require_syntax_callbacks = __commonJS({
  "../../node_modules/apg-js/src/apg-api/syntax-callbacks.js"(exports, module2) {
    init_esbuild_shims();
    module2.exports = function exports2() {
      const thisFileName = "syntax-callbacks.js: ";
      const apglib = require_node_exports();
      const id = apglib.ids;
      let topAlt;
      const synFile = function synFile2(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            data.altStack = [];
            data.repCount = 0;
            break;
          case id.EMPTY:
            data.errors.push({
              line: 0,
              char: 0,
              msg: "grammar file is empty"
            });
            break;
          case id.MATCH:
            if (data.ruleCount === 0) {
              data.errors.push({
                line: 0,
                char: 0,
                msg: "no rules defined"
              });
            }
            break;
          case id.NOMATCH:
            throw new Error(`${thisFileName}synFile: grammar file NOMATCH: design error: should never happen.`);
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synRule = function(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            data.altStack.length = 0;
            topAlt = {
              groupOpen: null,
              groupError: false,
              optionOpen: null,
              optionError: false,
              tlsOpen: null,
              clsOpen: null,
              prosValOpen: null,
              basicError: false
            };
            data.altStack.push(topAlt);
            break;
          case id.EMPTY:
            throw new Error(`${thisFileName}synRule: EMPTY: rule cannot be empty`);
          case id.NOMATCH:
            break;
          case id.MATCH:
            data.ruleCount += 1;
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synRuleError = function(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            break;
          case id.MATCH:
            data.errors.push({
              line: data.findLine(data.lines, phraseIndex, data.charsLength),
              char: phraseIndex,
              msg: "Unrecognized SABNF line. Invalid rule, comment or blank line."
            });
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synRuleNameError = function(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            break;
          case id.MATCH:
            data.errors.push({
              line: data.findLine(data.lines, phraseIndex, data.charsLength),
              char: phraseIndex,
              msg: "Rule names must be alphanum and begin with alphabetic character."
            });
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synDefinedAsError = function(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            break;
          case id.MATCH:
            data.errors.push({
              line: data.findLine(data.lines, phraseIndex, data.charsLength),
              char: phraseIndex,
              msg: "Expected '=' or '=/'. Not found."
            });
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synAndOp = function(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            break;
          case id.MATCH:
            if (data.strict) {
              data.errors.push({
                line: data.findLine(data.lines, phraseIndex, data.charsLength),
                char: phraseIndex,
                msg: "AND operator(&) found - strict ABNF specified."
              });
            }
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synNotOp = function(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            break;
          case id.MATCH:
            if (data.strict) {
              data.errors.push({
                line: data.findLine(data.lines, phraseIndex, data.charsLength),
                char: phraseIndex,
                msg: "NOT operator(!) found - strict ABNF specified."
              });
            }
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synBkaOp = function(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            break;
          case id.MATCH:
            if (data.strict) {
              data.errors.push({
                line: data.findLine(data.lines, phraseIndex, data.charsLength),
                char: phraseIndex,
                msg: "Positive look-behind operator(&&) found - strict ABNF specified."
              });
            }
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synBknOp = function(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            break;
          case id.MATCH:
            if (data.strict) {
              data.errors.push({
                line: data.findLine(data.lines, phraseIndex, data.charsLength),
                char: phraseIndex,
                msg: "Negative look-behind operator(!!) found - strict ABNF specified."
              });
            }
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synAbgOp = function(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            break;
          case id.MATCH:
            if (data.strict) {
              data.errors.push({
                line: data.findLine(data.lines, phraseIndex, data.charsLength),
                char: phraseIndex,
                msg: "Beginning of string anchor(%^) found - strict ABNF specified."
              });
            }
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synAenOp = function(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            break;
          case id.MATCH:
            if (data.strict) {
              data.errors.push({
                line: data.findLine(data.lines, phraseIndex, data.charsLength),
                char: phraseIndex,
                msg: "End of string anchor(%$) found - strict ABNF specified."
              });
            }
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synBkrOp = function(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            break;
          case id.MATCH:
            if (data.strict) {
              const name = apglib.utils.charsToString(chars, phraseIndex, result.phraseLength);
              data.errors.push({
                line: data.findLine(data.lines, phraseIndex, data.charsLength),
                char: phraseIndex,
                msg: `Back reference operator(${name}) found - strict ABNF specified.`
              });
            }
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synUdtOp = function(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            break;
          case id.MATCH:
            if (data.strict) {
              const name = apglib.utils.charsToString(chars, phraseIndex, result.phraseLength);
              data.errors.push({
                line: data.findLine(data.lines, phraseIndex, data.charsLength),
                char: phraseIndex,
                msg: `UDT operator found(${name}) - strict ABNF specified.`
              });
            }
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synTlsOpen = function(result, chars, phraseIndex) {
        switch (result.state) {
          case id.ACTIVE:
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            break;
          case id.MATCH:
            topAlt.tlsOpen = phraseIndex;
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synTlsString = function(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            data.stringTabChar = false;
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            break;
          case id.MATCH:
            if (data.stringTabChar !== false) {
              data.errors.push({
                line: data.findLine(data.lines, data.stringTabChar),
                char: data.stringTabChar,
                msg: "Tab character (\\t, x09) not allowed in literal string (see 'quoted-string' definition, RFC 7405.)"
              });
            }
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synStringTab = function(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            break;
          case id.MATCH:
            data.stringTabChar = phraseIndex;
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synTlsClose = function(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            data.errors.push({
              line: data.findLine(data.lines, topAlt.tlsOpen),
              char: topAlt.tlsOpen,
              msg: 'Case-insensitive literal string("...") opened but not closed.'
            });
            topAlt.basicError = true;
            topAlt.tlsOpen = null;
            break;
          case id.MATCH:
            topAlt.tlsOpen = null;
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synClsOpen = function(result, chars, phraseIndex) {
        switch (result.state) {
          case id.ACTIVE:
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            break;
          case id.MATCH:
            topAlt.clsOpen = phraseIndex;
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synClsString = function(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            data.stringTabChar = false;
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            break;
          case id.MATCH:
            if (data.stringTabChar !== false) {
              data.errors.push({
                line: data.findLine(data.lines, data.stringTabChar),
                char: data.stringTabChar,
                msg: "Tab character (\\t, x09) not allowed in literal string."
              });
            }
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synClsClose = function(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            data.errors.push({
              line: data.findLine(data.lines, topAlt.clsOpen),
              char: topAlt.clsOpen,
              msg: "Case-sensitive literal string('...') opened but not closed."
            });
            topAlt.clsOpen = null;
            topAlt.basicError = true;
            break;
          case id.MATCH:
            if (data.strict) {
              data.errors.push({
                line: data.findLine(data.lines, topAlt.clsOpen),
                char: topAlt.clsOpen,
                msg: "Case-sensitive string operator('...') found - strict ABNF specified."
              });
            }
            topAlt.clsOpen = null;
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synProsValOpen = function(result, chars, phraseIndex) {
        switch (result.state) {
          case id.ACTIVE:
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            break;
          case id.MATCH:
            topAlt.prosValOpen = phraseIndex;
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synProsValString = function(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            data.stringTabChar = false;
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            break;
          case id.MATCH:
            if (data.stringTabChar !== false) {
              data.errors.push({
                line: data.findLine(data.lines, data.stringTabChar),
                char: data.stringTabChar,
                msg: "Tab character (\\t, x09) not allowed in prose value string."
              });
            }
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synProsValClose = function(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            data.errors.push({
              line: data.findLine(data.lines, topAlt.prosValOpen),
              char: topAlt.prosValOpen,
              msg: "Prose value operator(<...>) opened but not closed."
            });
            topAlt.basicError = true;
            topAlt.prosValOpen = null;
            break;
          case id.MATCH:
            data.errors.push({
              line: data.findLine(data.lines, topAlt.prosValOpen),
              char: topAlt.prosValOpen,
              msg: "Prose value operator(<...>) found. The ABNF syntax is valid, but a parser cannot be generated from this grammar."
            });
            topAlt.prosValOpen = null;
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synGroupOpen = function(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            break;
          case id.MATCH:
            topAlt = {
              groupOpen: phraseIndex,
              groupError: false,
              optionOpen: null,
              optionError: false,
              tlsOpen: null,
              clsOpen: null,
              prosValOpen: null,
              basicError: false
            };
            data.altStack.push(topAlt);
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synGroupClose = function(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            data.errors.push({
              line: data.findLine(data.lines, topAlt.groupOpen),
              char: topAlt.groupOpen,
              msg: 'Group "(...)" opened but not closed.'
            });
            topAlt = data.altStack.pop();
            topAlt.groupError = true;
            break;
          case id.MATCH:
            topAlt = data.altStack.pop();
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synOptionOpen = function(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            break;
          case id.MATCH:
            topAlt = {
              groupOpen: null,
              groupError: false,
              optionOpen: phraseIndex,
              optionError: false,
              tlsOpen: null,
              clsOpen: null,
              prosValOpen: null,
              basicError: false
            };
            data.altStack.push(topAlt);
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synOptionClose = function(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            data.errors.push({
              line: data.findLine(data.lines, topAlt.optionOpen),
              char: topAlt.optionOpen,
              msg: 'Option "[...]" opened but not closed.'
            });
            topAlt = data.altStack.pop();
            topAlt.optionError = true;
            break;
          case id.MATCH:
            topAlt = data.altStack.pop();
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synBasicElementError = function(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            break;
          case id.MATCH:
            if (topAlt.basicError === false) {
              data.errors.push({
                line: data.findLine(data.lines, phraseIndex, data.charsLength),
                char: phraseIndex,
                msg: "Unrecognized SABNF element."
              });
            }
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synLineEnd = function(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            break;
          case id.MATCH:
            if (result.phraseLength === 1 && data.strict) {
              const end = chars[phraseIndex] === 13 ? "CR" : "LF";
              data.errors.push({
                line: data.findLine(data.lines, phraseIndex, data.charsLength),
                char: phraseIndex,
                msg: `Line end '${end}' found - strict ABNF specified, only CRLF allowed.`
              });
            }
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synLineEndError = function(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            break;
          case id.MATCH:
            data.errors.push({
              line: data.findLine(data.lines, phraseIndex, data.charsLength),
              char: phraseIndex,
              msg: "Unrecognized grammar element or characters."
            });
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      const synRepetition = function(result, chars, phraseIndex, data) {
        switch (result.state) {
          case id.ACTIVE:
            break;
          case id.EMPTY:
            break;
          case id.NOMATCH:
            data.repCount += 1;
            break;
          case id.MATCH:
            data.repCount += 1;
            break;
          default:
            throw new Error(`${thisFileName}synFile: unrecognized case.`);
        }
      };
      this.callbacks = [];
      this.callbacks.andop = synAndOp;
      this.callbacks.basicelementerr = synBasicElementError;
      this.callbacks.clsclose = synClsClose;
      this.callbacks.clsopen = synClsOpen;
      this.callbacks.clsstring = synClsString;
      this.callbacks.definedaserror = synDefinedAsError;
      this.callbacks.file = synFile;
      this.callbacks.groupclose = synGroupClose;
      this.callbacks.groupopen = synGroupOpen;
      this.callbacks.lineenderror = synLineEndError;
      this.callbacks.lineend = synLineEnd;
      this.callbacks.notop = synNotOp;
      this.callbacks.optionclose = synOptionClose;
      this.callbacks.optionopen = synOptionOpen;
      this.callbacks.prosvalclose = synProsValClose;
      this.callbacks.prosvalopen = synProsValOpen;
      this.callbacks.prosvalstring = synProsValString;
      this.callbacks.repetition = synRepetition;
      this.callbacks.rule = synRule;
      this.callbacks.ruleerror = synRuleError;
      this.callbacks.rulenameerror = synRuleNameError;
      this.callbacks.stringtab = synStringTab;
      this.callbacks.tlsclose = synTlsClose;
      this.callbacks.tlsopen = synTlsOpen;
      this.callbacks.tlsstring = synTlsString;
      this.callbacks.udtop = synUdtOp;
      this.callbacks.bkaop = synBkaOp;
      this.callbacks.bknop = synBknOp;
      this.callbacks.bkrop = synBkrOp;
      this.callbacks.abgop = synAbgOp;
      this.callbacks.aenop = synAenOp;
    };
  }
});

// ../../node_modules/apg-js/src/apg-api/semantic-callbacks.js
var require_semantic_callbacks = __commonJS({
  "../../node_modules/apg-js/src/apg-api/semantic-callbacks.js"(exports, module2) {
    init_esbuild_shims();
    module2.exports = function exports2() {
      const apglib = require_node_exports();
      const id = apglib.ids;
      const NameList = function NameList2() {
        this.names = [];
        this.add = function add(name) {
          let ret = -1;
          const find = this.get(name);
          if (find === -1) {
            ret = {
              name,
              lower: name.toLowerCase(),
              index: this.names.length
            };
            this.names.push(ret);
          }
          return ret;
        };
        this.get = function get(name) {
          let ret = -1;
          const lower = name.toLowerCase();
          for (let i = 0; i < this.names.length; i += 1) {
            if (this.names[i].lower === lower) {
              ret = this.names[i];
              break;
            }
          }
          return ret;
        };
      };
      const decnum = function decnum2(chars, beg, len) {
        let num = 0;
        for (let i = beg; i < beg + len; i += 1) {
          num = 10 * num + chars[i] - 48;
        }
        return num;
      };
      const binnum = function binnum2(chars, beg, len) {
        let num = 0;
        for (let i = beg; i < beg + len; i += 1) {
          num = 2 * num + chars[i] - 48;
        }
        return num;
      };
      const hexnum = function hexnum2(chars, beg, len) {
        let num = 0;
        for (let i = beg; i < beg + len; i += 1) {
          let digit = chars[i];
          if (digit >= 48 && digit <= 57) {
            digit -= 48;
          } else if (digit >= 65 && digit <= 70) {
            digit -= 55;
          } else if (digit >= 97 && digit <= 102) {
            digit -= 87;
          } else {
            throw new Error("hexnum out of range");
          }
          num = 16 * num + digit;
        }
        return num;
      };
      function semFile(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_PRE) {
          data.ruleNames = new NameList();
          data.udtNames = new NameList();
          data.rules = [];
          data.udts = [];
          data.rulesLineMap = [];
          data.opcodes = [];
          data.altStack = [];
          data.topStack = null;
          data.topRule = null;
        } else if (state === id.SEM_POST) {
          let nameObj;
          data.rules.forEach((rule) => {
            rule.isBkr = false;
            rule.opcodes.forEach((op) => {
              if (op.type === id.RNM) {
                nameObj = data.ruleNames.get(op.index.name);
                if (nameObj === -1) {
                  data.errors.push({
                    line: data.findLine(data.lines, op.index.phraseIndex, data.charsLength),
                    char: op.index.phraseIndex,
                    msg: `Rule name '${op.index.name}' used but not defined.`
                  });
                  op.index = -1;
                } else {
                  op.index = nameObj.index;
                }
              }
            });
          });
          data.udts.forEach((udt) => {
            udt.isBkr = false;
          });
          data.rules.forEach((rule) => {
            rule.opcodes.forEach((op) => {
              if (op.type === id.BKR) {
                rule.hasBkr = true;
                nameObj = data.ruleNames.get(op.index.name);
                if (nameObj !== -1) {
                  data.rules[nameObj.index].isBkr = true;
                  op.index = nameObj.index;
                } else {
                  nameObj = data.udtNames.get(op.index.name);
                  if (nameObj !== -1) {
                    data.udts[nameObj.index].isBkr = true;
                    op.index = data.rules.length + nameObj.index;
                  } else {
                    data.errors.push({
                      line: data.findLine(data.lines, op.index.phraseIndex, data.charsLength),
                      char: op.index.phraseIndex,
                      msg: `Back reference name '${op.index.name}' refers to undefined rule or unamed UDT.`
                    });
                    op.index = -1;
                  }
                }
              }
            });
          });
        }
        return ret;
      }
      function semRule(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_PRE) {
          data.altStack.length = 0;
          data.topStack = null;
          data.rulesLineMap.push({
            line: data.findLine(data.lines, phraseIndex, data.charsLength),
            char: phraseIndex
          });
        }
        return ret;
      }
      function semRuleLookup(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_PRE) {
          data.ruleName = "";
          data.definedas = "";
        } else if (state === id.SEM_POST) {
          let ruleName;
          if (data.definedas === "=") {
            ruleName = data.ruleNames.add(data.ruleName);
            if (ruleName === -1) {
              data.definedas = null;
              data.errors.push({
                line: data.findLine(data.lines, phraseIndex, data.charsLength),
                char: phraseIndex,
                msg: `Rule name '${data.ruleName}' previously defined.`
              });
            } else {
              data.topRule = {
                name: ruleName.name,
                lower: ruleName.lower,
                opcodes: [],
                index: ruleName.index
              };
              data.rules.push(data.topRule);
              data.opcodes = data.topRule.opcodes;
            }
          } else {
            ruleName = data.ruleNames.get(data.ruleName);
            if (ruleName === -1) {
              data.definedas = null;
              data.errors.push({
                line: data.findLine(data.lines, phraseIndex, data.charsLength),
                char: phraseIndex,
                msg: `Rule name '${data.ruleName}' for incremental alternate not previously defined.`
              });
            } else {
              data.topRule = data.rules[ruleName.index];
              data.opcodes = data.topRule.opcodes;
            }
          }
        }
        return ret;
      }
      function semAlternation(state, chars, phraseIndex, phraseCount, data) {
        let ret = id.SEM_OK;
        if (state === id.SEM_PRE) {
          const TRUE = true;
          while (TRUE) {
            if (data.definedas === null) {
              ret = id.SEM_SKIP;
              break;
            }
            if (data.topStack === null) {
              if (data.definedas === "=") {
                data.topStack = {
                  alt: {
                    type: id.ALT,
                    children: []
                  },
                  cat: null
                };
                data.altStack.push(data.topStack);
                data.opcodes.push(data.topStack.alt);
                break;
              }
              data.topStack = {
                alt: data.opcodes[0],
                cat: null
              };
              data.altStack.push(data.topStack);
              break;
            }
            data.topStack = {
              alt: {
                type: id.ALT,
                children: []
              },
              cat: null
            };
            data.altStack.push(data.topStack);
            data.opcodes.push(data.topStack.alt);
            break;
          }
        } else if (state === id.SEM_POST) {
          data.altStack.pop();
          if (data.altStack.length > 0) {
            data.topStack = data.altStack[data.altStack.length - 1];
          } else {
            data.topStack = null;
          }
        }
        return ret;
      }
      function semConcatenation(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_PRE) {
          data.topStack.alt.children.push(data.opcodes.length);
          data.topStack.cat = {
            type: id.CAT,
            children: []
          };
          data.opcodes.push(data.topStack.cat);
        } else if (state === id.SEM_POST) {
          data.topStack.cat = null;
        }
        return ret;
      }
      function semRepetition(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_PRE) {
          data.topStack.cat.children.push(data.opcodes.length);
        }
        return ret;
      }
      function semOptionOpen(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          data.opcodes.push({
            type: id.REP,
            min: 0,
            max: 1,
            char: phraseIndex
          });
        }
        return ret;
      }
      function semRuleName(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_PRE) {
          data.ruleName = apglib.utils.charsToString(chars, phraseIndex, phraseCount);
        }
        return ret;
      }
      function semDefined(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          data.definedas = "=";
        }
        return ret;
      }
      function semIncAlt(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          data.definedas = "=/";
        }
        return ret;
      }
      function semRepOp(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_PRE) {
          data.min = 0;
          data.max = Infinity;
          data.topRep = {
            type: id.REP,
            min: 0,
            max: Infinity
          };
          data.opcodes.push(data.topRep);
        } else if (state === id.SEM_POST) {
          if (data.min > data.max) {
            data.errors.push({
              line: data.findLine(data.lines, phraseIndex, data.charsLength),
              char: phraseIndex,
              msg: `repetition min cannot be greater than max: min: ${data.min}: max: ${data.max}`
            });
          }
          data.topRep.min = data.min;
          data.topRep.max = data.max;
        }
        return ret;
      }
      function semRepMin(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          data.min = decnum(chars, phraseIndex, phraseCount);
        }
        return ret;
      }
      function semRepMax(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          data.max = decnum(chars, phraseIndex, phraseCount);
        }
        return ret;
      }
      function semRepMinMax(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          data.max = decnum(chars, phraseIndex, phraseCount);
          data.min = data.max;
        }
        return ret;
      }
      function semAndOp(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          data.opcodes.push({
            type: id.AND
          });
        }
        return ret;
      }
      function semNotOp(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          data.opcodes.push({
            type: id.NOT
          });
        }
        return ret;
      }
      function semRnmOp(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          data.opcodes.push({
            type: id.RNM,
            index: {
              phraseIndex,
              name: apglib.utils.charsToString(chars, phraseIndex, phraseCount)
            }
          });
        }
        return ret;
      }
      function semAbgOp(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          data.opcodes.push({
            type: id.ABG
          });
        }
        return ret;
      }
      function semAenOp(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          data.opcodes.push({
            type: id.AEN
          });
        }
        return ret;
      }
      function semBkaOp(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          data.opcodes.push({
            type: id.BKA
          });
        }
        return ret;
      }
      function semBknOp(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          data.opcodes.push({
            type: id.BKN
          });
        }
        return ret;
      }
      function semBkrOp(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_PRE) {
          data.ci = true;
          data.cs = false;
          data.um = true;
          data.pm = false;
        } else if (state === id.SEM_POST) {
          data.opcodes.push({
            type: id.BKR,
            bkrCase: data.cs === true ? id.BKR_MODE_CS : id.BKR_MODE_CI,
            bkrMode: data.pm === true ? id.BKR_MODE_PM : id.BKR_MODE_UM,
            index: {
              phraseIndex: data.bkrname.phraseIndex,
              name: apglib.utils.charsToString(chars, data.bkrname.phraseIndex, data.bkrname.phraseLength)
            }
          });
        }
        return ret;
      }
      function semBkrCi(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          data.ci = true;
        }
        return ret;
      }
      function semBkrCs(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          data.cs = true;
        }
        return ret;
      }
      function semBkrUm(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          data.um = true;
        }
        return ret;
      }
      function semBkrPm(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          data.pm = true;
        }
        return ret;
      }
      function semBkrName(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          data.bkrname = {
            phraseIndex,
            phraseLength: phraseCount
          };
        }
        return ret;
      }
      function semUdtEmpty(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          const name = apglib.utils.charsToString(chars, phraseIndex, phraseCount);
          let udtName = data.udtNames.add(name);
          if (udtName === -1) {
            udtName = data.udtNames.get(name);
            if (udtName === -1) {
              throw new Error("semUdtEmpty: name look up error");
            }
          } else {
            data.udts.push({
              name: udtName.name,
              lower: udtName.lower,
              index: udtName.index,
              empty: true
            });
          }
          data.opcodes.push({
            type: id.UDT,
            empty: true,
            index: udtName.index
          });
        }
        return ret;
      }
      function semUdtNonEmpty(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          const name = apglib.utils.charsToString(chars, phraseIndex, phraseCount);
          let udtName = data.udtNames.add(name);
          if (udtName === -1) {
            udtName = data.udtNames.get(name);
            if (udtName === -1) {
              throw new Error("semUdtNonEmpty: name look up error");
            }
          } else {
            data.udts.push({
              name: udtName.name,
              lower: udtName.lower,
              index: udtName.index,
              empty: false
            });
          }
          data.opcodes.push({
            type: id.UDT,
            empty: false,
            index: udtName.index,
            syntax: null,
            semantic: null
          });
        }
        return ret;
      }
      function semTlsOp(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_PRE) {
          data.tlscase = true;
        }
        return ret;
      }
      function semTlsCase(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          if (phraseCount > 0 && (chars[phraseIndex + 1] === 83 || chars[phraseIndex + 1] === 115)) {
            data.tlscase = false;
          }
        }
        return ret;
      }
      function semTlsString(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          if (data.tlscase) {
            const str = chars.slice(phraseIndex, phraseIndex + phraseCount);
            for (let i = 0; i < str.length; i += 1) {
              if (str[i] >= 65 && str[i] <= 90) {
                str[i] += 32;
              }
            }
            data.opcodes.push({
              type: id.TLS,
              string: str
            });
          } else {
            data.opcodes.push({
              type: id.TBS,
              string: chars.slice(phraseIndex, phraseIndex + phraseCount)
            });
          }
        }
        return ret;
      }
      function semClsOp(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          if (phraseCount <= 2) {
            data.opcodes.push({
              type: id.TLS,
              string: []
            });
          } else {
            data.opcodes.push({
              type: id.TBS,
              string: chars.slice(phraseIndex + 1, phraseIndex + phraseCount - 1)
            });
          }
        }
        return ret;
      }
      function semTbsOp(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_PRE) {
          data.tbsstr = [];
        } else if (state === id.SEM_POST) {
          data.opcodes.push({
            type: id.TBS,
            string: data.tbsstr
          });
        }
        return ret;
      }
      function semTrgOp(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_PRE) {
          data.min = 0;
          data.max = 0;
        } else if (state === id.SEM_POST) {
          if (data.min > data.max) {
            data.errors.push({
              line: data.findLine(data.lines, phraseIndex, data.charsLength),
              char: phraseIndex,
              msg: `TRG, (%dmin-max), min cannot be greater than max: min: ${data.min}: max: ${data.max}`
            });
          }
          data.opcodes.push({
            type: id.TRG,
            min: data.min,
            max: data.max
          });
        }
        return ret;
      }
      function semDmin(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          data.min = decnum(chars, phraseIndex, phraseCount);
        }
        return ret;
      }
      function semDmax(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          data.max = decnum(chars, phraseIndex, phraseCount);
        }
        return ret;
      }
      function semBmin(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          data.min = binnum(chars, phraseIndex, phraseCount);
        }
        return ret;
      }
      function semBmax(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          data.max = binnum(chars, phraseIndex, phraseCount);
        }
        return ret;
      }
      function semXmin(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          data.min = hexnum(chars, phraseIndex, phraseCount);
        }
        return ret;
      }
      function semXmax(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          data.max = hexnum(chars, phraseIndex, phraseCount);
        }
        return ret;
      }
      function semDstring(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          data.tbsstr.push(decnum(chars, phraseIndex, phraseCount));
        }
        return ret;
      }
      function semBstring(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          data.tbsstr.push(binnum(chars, phraseIndex, phraseCount));
        }
        return ret;
      }
      function semXstring(state, chars, phraseIndex, phraseCount, data) {
        const ret = id.SEM_OK;
        if (state === id.SEM_POST) {
          data.tbsstr.push(hexnum(chars, phraseIndex, phraseCount));
        }
        return ret;
      }
      this.callbacks = [];
      this.callbacks.abgop = semAbgOp;
      this.callbacks.aenop = semAenOp;
      this.callbacks.alternation = semAlternation;
      this.callbacks.andop = semAndOp;
      this.callbacks.bmax = semBmax;
      this.callbacks.bmin = semBmin;
      this.callbacks.bkaop = semBkaOp;
      this.callbacks.bknop = semBknOp;
      this.callbacks.bkrop = semBkrOp;
      this.callbacks["bkr-name"] = semBkrName;
      this.callbacks.bstring = semBstring;
      this.callbacks.clsop = semClsOp;
      this.callbacks.ci = semBkrCi;
      this.callbacks.cs = semBkrCs;
      this.callbacks.um = semBkrUm;
      this.callbacks.pm = semBkrPm;
      this.callbacks.concatenation = semConcatenation;
      this.callbacks.defined = semDefined;
      this.callbacks.dmax = semDmax;
      this.callbacks.dmin = semDmin;
      this.callbacks.dstring = semDstring;
      this.callbacks.file = semFile;
      this.callbacks.incalt = semIncAlt;
      this.callbacks.notop = semNotOp;
      this.callbacks.optionopen = semOptionOpen;
      this.callbacks["rep-max"] = semRepMax;
      this.callbacks["rep-min"] = semRepMin;
      this.callbacks["rep-min-max"] = semRepMinMax;
      this.callbacks.repetition = semRepetition;
      this.callbacks.repop = semRepOp;
      this.callbacks.rnmop = semRnmOp;
      this.callbacks.rule = semRule;
      this.callbacks.rulelookup = semRuleLookup;
      this.callbacks.rulename = semRuleName;
      this.callbacks.tbsop = semTbsOp;
      this.callbacks.tlscase = semTlsCase;
      this.callbacks.tlsstring = semTlsString;
      this.callbacks.tlsop = semTlsOp;
      this.callbacks.trgop = semTrgOp;
      this.callbacks["udt-empty"] = semUdtEmpty;
      this.callbacks["udt-non-empty"] = semUdtNonEmpty;
      this.callbacks.xmax = semXmax;
      this.callbacks.xmin = semXmin;
      this.callbacks.xstring = semXstring;
    };
  }
});

// ../../node_modules/apg-js/src/apg-api/sabnf-grammar.js
var require_sabnf_grammar = __commonJS({
  "../../node_modules/apg-js/src/apg-api/sabnf-grammar.js"(exports, module2) {
    init_esbuild_shims();
    module2.exports = function grammar() {
      this.grammarObject = "grammarObject";
      this.rules = [];
      this.rules[0] = { name: "File", lower: "file", index: 0, isBkr: false };
      this.rules[1] = { name: "BlankLine", lower: "blankline", index: 1, isBkr: false };
      this.rules[2] = { name: "Rule", lower: "rule", index: 2, isBkr: false };
      this.rules[3] = { name: "RuleLookup", lower: "rulelookup", index: 3, isBkr: false };
      this.rules[4] = { name: "RuleNameTest", lower: "rulenametest", index: 4, isBkr: false };
      this.rules[5] = { name: "RuleName", lower: "rulename", index: 5, isBkr: false };
      this.rules[6] = { name: "RuleNameError", lower: "rulenameerror", index: 6, isBkr: false };
      this.rules[7] = { name: "DefinedAsTest", lower: "definedastest", index: 7, isBkr: false };
      this.rules[8] = { name: "DefinedAsError", lower: "definedaserror", index: 8, isBkr: false };
      this.rules[9] = { name: "DefinedAs", lower: "definedas", index: 9, isBkr: false };
      this.rules[10] = { name: "Defined", lower: "defined", index: 10, isBkr: false };
      this.rules[11] = { name: "IncAlt", lower: "incalt", index: 11, isBkr: false };
      this.rules[12] = { name: "RuleError", lower: "ruleerror", index: 12, isBkr: false };
      this.rules[13] = { name: "LineEndError", lower: "lineenderror", index: 13, isBkr: false };
      this.rules[14] = { name: "Alternation", lower: "alternation", index: 14, isBkr: false };
      this.rules[15] = { name: "Concatenation", lower: "concatenation", index: 15, isBkr: false };
      this.rules[16] = { name: "Repetition", lower: "repetition", index: 16, isBkr: false };
      this.rules[17] = { name: "Modifier", lower: "modifier", index: 17, isBkr: false };
      this.rules[18] = { name: "Predicate", lower: "predicate", index: 18, isBkr: false };
      this.rules[19] = { name: "BasicElement", lower: "basicelement", index: 19, isBkr: false };
      this.rules[20] = { name: "BasicElementErr", lower: "basicelementerr", index: 20, isBkr: false };
      this.rules[21] = { name: "Group", lower: "group", index: 21, isBkr: false };
      this.rules[22] = { name: "GroupError", lower: "grouperror", index: 22, isBkr: false };
      this.rules[23] = { name: "GroupOpen", lower: "groupopen", index: 23, isBkr: false };
      this.rules[24] = { name: "GroupClose", lower: "groupclose", index: 24, isBkr: false };
      this.rules[25] = { name: "Option", lower: "option", index: 25, isBkr: false };
      this.rules[26] = { name: "OptionError", lower: "optionerror", index: 26, isBkr: false };
      this.rules[27] = { name: "OptionOpen", lower: "optionopen", index: 27, isBkr: false };
      this.rules[28] = { name: "OptionClose", lower: "optionclose", index: 28, isBkr: false };
      this.rules[29] = { name: "RnmOp", lower: "rnmop", index: 29, isBkr: false };
      this.rules[30] = { name: "BkrOp", lower: "bkrop", index: 30, isBkr: false };
      this.rules[31] = { name: "bkrModifier", lower: "bkrmodifier", index: 31, isBkr: false };
      this.rules[32] = { name: "cs", lower: "cs", index: 32, isBkr: false };
      this.rules[33] = { name: "ci", lower: "ci", index: 33, isBkr: false };
      this.rules[34] = { name: "um", lower: "um", index: 34, isBkr: false };
      this.rules[35] = { name: "pm", lower: "pm", index: 35, isBkr: false };
      this.rules[36] = { name: "bkr-name", lower: "bkr-name", index: 36, isBkr: false };
      this.rules[37] = { name: "rname", lower: "rname", index: 37, isBkr: false };
      this.rules[38] = { name: "uname", lower: "uname", index: 38, isBkr: false };
      this.rules[39] = { name: "ename", lower: "ename", index: 39, isBkr: false };
      this.rules[40] = { name: "UdtOp", lower: "udtop", index: 40, isBkr: false };
      this.rules[41] = { name: "udt-non-empty", lower: "udt-non-empty", index: 41, isBkr: false };
      this.rules[42] = { name: "udt-empty", lower: "udt-empty", index: 42, isBkr: false };
      this.rules[43] = { name: "RepOp", lower: "repop", index: 43, isBkr: false };
      this.rules[44] = { name: "AltOp", lower: "altop", index: 44, isBkr: false };
      this.rules[45] = { name: "CatOp", lower: "catop", index: 45, isBkr: false };
      this.rules[46] = { name: "StarOp", lower: "starop", index: 46, isBkr: false };
      this.rules[47] = { name: "AndOp", lower: "andop", index: 47, isBkr: false };
      this.rules[48] = { name: "NotOp", lower: "notop", index: 48, isBkr: false };
      this.rules[49] = { name: "BkaOp", lower: "bkaop", index: 49, isBkr: false };
      this.rules[50] = { name: "BknOp", lower: "bknop", index: 50, isBkr: false };
      this.rules[51] = { name: "AbgOp", lower: "abgop", index: 51, isBkr: false };
      this.rules[52] = { name: "AenOp", lower: "aenop", index: 52, isBkr: false };
      this.rules[53] = { name: "TrgOp", lower: "trgop", index: 53, isBkr: false };
      this.rules[54] = { name: "TbsOp", lower: "tbsop", index: 54, isBkr: false };
      this.rules[55] = { name: "TlsOp", lower: "tlsop", index: 55, isBkr: false };
      this.rules[56] = { name: "TlsCase", lower: "tlscase", index: 56, isBkr: false };
      this.rules[57] = { name: "TlsOpen", lower: "tlsopen", index: 57, isBkr: false };
      this.rules[58] = { name: "TlsClose", lower: "tlsclose", index: 58, isBkr: false };
      this.rules[59] = { name: "TlsString", lower: "tlsstring", index: 59, isBkr: false };
      this.rules[60] = { name: "StringTab", lower: "stringtab", index: 60, isBkr: false };
      this.rules[61] = { name: "ClsOp", lower: "clsop", index: 61, isBkr: false };
      this.rules[62] = { name: "ClsOpen", lower: "clsopen", index: 62, isBkr: false };
      this.rules[63] = { name: "ClsClose", lower: "clsclose", index: 63, isBkr: false };
      this.rules[64] = { name: "ClsString", lower: "clsstring", index: 64, isBkr: false };
      this.rules[65] = { name: "ProsVal", lower: "prosval", index: 65, isBkr: false };
      this.rules[66] = { name: "ProsValOpen", lower: "prosvalopen", index: 66, isBkr: false };
      this.rules[67] = { name: "ProsValString", lower: "prosvalstring", index: 67, isBkr: false };
      this.rules[68] = { name: "ProsValClose", lower: "prosvalclose", index: 68, isBkr: false };
      this.rules[69] = { name: "rep-min", lower: "rep-min", index: 69, isBkr: false };
      this.rules[70] = { name: "rep-min-max", lower: "rep-min-max", index: 70, isBkr: false };
      this.rules[71] = { name: "rep-max", lower: "rep-max", index: 71, isBkr: false };
      this.rules[72] = { name: "rep-num", lower: "rep-num", index: 72, isBkr: false };
      this.rules[73] = { name: "dString", lower: "dstring", index: 73, isBkr: false };
      this.rules[74] = { name: "xString", lower: "xstring", index: 74, isBkr: false };
      this.rules[75] = { name: "bString", lower: "bstring", index: 75, isBkr: false };
      this.rules[76] = { name: "Dec", lower: "dec", index: 76, isBkr: false };
      this.rules[77] = { name: "Hex", lower: "hex", index: 77, isBkr: false };
      this.rules[78] = { name: "Bin", lower: "bin", index: 78, isBkr: false };
      this.rules[79] = { name: "dmin", lower: "dmin", index: 79, isBkr: false };
      this.rules[80] = { name: "dmax", lower: "dmax", index: 80, isBkr: false };
      this.rules[81] = { name: "bmin", lower: "bmin", index: 81, isBkr: false };
      this.rules[82] = { name: "bmax", lower: "bmax", index: 82, isBkr: false };
      this.rules[83] = { name: "xmin", lower: "xmin", index: 83, isBkr: false };
      this.rules[84] = { name: "xmax", lower: "xmax", index: 84, isBkr: false };
      this.rules[85] = { name: "dnum", lower: "dnum", index: 85, isBkr: false };
      this.rules[86] = { name: "bnum", lower: "bnum", index: 86, isBkr: false };
      this.rules[87] = { name: "xnum", lower: "xnum", index: 87, isBkr: false };
      this.rules[88] = { name: "alphanum", lower: "alphanum", index: 88, isBkr: false };
      this.rules[89] = { name: "owsp", lower: "owsp", index: 89, isBkr: false };
      this.rules[90] = { name: "wsp", lower: "wsp", index: 90, isBkr: false };
      this.rules[91] = { name: "space", lower: "space", index: 91, isBkr: false };
      this.rules[92] = { name: "comment", lower: "comment", index: 92, isBkr: false };
      this.rules[93] = { name: "LineEnd", lower: "lineend", index: 93, isBkr: false };
      this.rules[94] = { name: "LineContinue", lower: "linecontinue", index: 94, isBkr: false };
      this.udts = [];
      this.rules[0].opcodes = [];
      this.rules[0].opcodes[0] = { type: 3, min: 0, max: Infinity };
      this.rules[0].opcodes[1] = { type: 1, children: [2, 3, 4] };
      this.rules[0].opcodes[2] = { type: 4, index: 1 };
      this.rules[0].opcodes[3] = { type: 4, index: 2 };
      this.rules[0].opcodes[4] = { type: 4, index: 12 };
      this.rules[1].opcodes = [];
      this.rules[1].opcodes[0] = { type: 2, children: [1, 5, 7] };
      this.rules[1].opcodes[1] = { type: 3, min: 0, max: Infinity };
      this.rules[1].opcodes[2] = { type: 1, children: [3, 4] };
      this.rules[1].opcodes[3] = { type: 6, string: [32] };
      this.rules[1].opcodes[4] = { type: 6, string: [9] };
      this.rules[1].opcodes[5] = { type: 3, min: 0, max: 1 };
      this.rules[1].opcodes[6] = { type: 4, index: 92 };
      this.rules[1].opcodes[7] = { type: 4, index: 93 };
      this.rules[2].opcodes = [];
      this.rules[2].opcodes[0] = { type: 2, children: [1, 2, 3, 4] };
      this.rules[2].opcodes[1] = { type: 4, index: 3 };
      this.rules[2].opcodes[2] = { type: 4, index: 89 };
      this.rules[2].opcodes[3] = { type: 4, index: 14 };
      this.rules[2].opcodes[4] = { type: 1, children: [5, 8] };
      this.rules[2].opcodes[5] = { type: 2, children: [6, 7] };
      this.rules[2].opcodes[6] = { type: 4, index: 89 };
      this.rules[2].opcodes[7] = { type: 4, index: 93 };
      this.rules[2].opcodes[8] = { type: 2, children: [9, 10] };
      this.rules[2].opcodes[9] = { type: 4, index: 13 };
      this.rules[2].opcodes[10] = { type: 4, index: 93 };
      this.rules[3].opcodes = [];
      this.rules[3].opcodes[0] = { type: 2, children: [1, 2, 3] };
      this.rules[3].opcodes[1] = { type: 4, index: 4 };
      this.rules[3].opcodes[2] = { type: 4, index: 89 };
      this.rules[3].opcodes[3] = { type: 4, index: 7 };
      this.rules[4].opcodes = [];
      this.rules[4].opcodes[0] = { type: 1, children: [1, 2] };
      this.rules[4].opcodes[1] = { type: 4, index: 5 };
      this.rules[4].opcodes[2] = { type: 4, index: 6 };
      this.rules[5].opcodes = [];
      this.rules[5].opcodes[0] = { type: 4, index: 88 };
      this.rules[6].opcodes = [];
      this.rules[6].opcodes[0] = { type: 3, min: 1, max: Infinity };
      this.rules[6].opcodes[1] = { type: 1, children: [2, 3] };
      this.rules[6].opcodes[2] = { type: 5, min: 33, max: 60 };
      this.rules[6].opcodes[3] = { type: 5, min: 62, max: 126 };
      this.rules[7].opcodes = [];
      this.rules[7].opcodes[0] = { type: 1, children: [1, 2] };
      this.rules[7].opcodes[1] = { type: 4, index: 9 };
      this.rules[7].opcodes[2] = { type: 4, index: 8 };
      this.rules[8].opcodes = [];
      this.rules[8].opcodes[0] = { type: 3, min: 1, max: 2 };
      this.rules[8].opcodes[1] = { type: 5, min: 33, max: 126 };
      this.rules[9].opcodes = [];
      this.rules[9].opcodes[0] = { type: 1, children: [1, 2] };
      this.rules[9].opcodes[1] = { type: 4, index: 11 };
      this.rules[9].opcodes[2] = { type: 4, index: 10 };
      this.rules[10].opcodes = [];
      this.rules[10].opcodes[0] = { type: 6, string: [61] };
      this.rules[11].opcodes = [];
      this.rules[11].opcodes[0] = { type: 6, string: [61, 47] };
      this.rules[12].opcodes = [];
      this.rules[12].opcodes[0] = { type: 2, children: [1, 6] };
      this.rules[12].opcodes[1] = { type: 3, min: 1, max: Infinity };
      this.rules[12].opcodes[2] = { type: 1, children: [3, 4, 5] };
      this.rules[12].opcodes[3] = { type: 5, min: 32, max: 126 };
      this.rules[12].opcodes[4] = { type: 6, string: [9] };
      this.rules[12].opcodes[5] = { type: 4, index: 94 };
      this.rules[12].opcodes[6] = { type: 4, index: 93 };
      this.rules[13].opcodes = [];
      this.rules[13].opcodes[0] = { type: 3, min: 1, max: Infinity };
      this.rules[13].opcodes[1] = { type: 1, children: [2, 3, 4] };
      this.rules[13].opcodes[2] = { type: 5, min: 32, max: 126 };
      this.rules[13].opcodes[3] = { type: 6, string: [9] };
      this.rules[13].opcodes[4] = { type: 4, index: 94 };
      this.rules[14].opcodes = [];
      this.rules[14].opcodes[0] = { type: 2, children: [1, 2] };
      this.rules[14].opcodes[1] = { type: 4, index: 15 };
      this.rules[14].opcodes[2] = { type: 3, min: 0, max: Infinity };
      this.rules[14].opcodes[3] = { type: 2, children: [4, 5, 6] };
      this.rules[14].opcodes[4] = { type: 4, index: 89 };
      this.rules[14].opcodes[5] = { type: 4, index: 44 };
      this.rules[14].opcodes[6] = { type: 4, index: 15 };
      this.rules[15].opcodes = [];
      this.rules[15].opcodes[0] = { type: 2, children: [1, 2] };
      this.rules[15].opcodes[1] = { type: 4, index: 16 };
      this.rules[15].opcodes[2] = { type: 3, min: 0, max: Infinity };
      this.rules[15].opcodes[3] = { type: 2, children: [4, 5] };
      this.rules[15].opcodes[4] = { type: 4, index: 45 };
      this.rules[15].opcodes[5] = { type: 4, index: 16 };
      this.rules[16].opcodes = [];
      this.rules[16].opcodes[0] = { type: 2, children: [1, 3] };
      this.rules[16].opcodes[1] = { type: 3, min: 0, max: 1 };
      this.rules[16].opcodes[2] = { type: 4, index: 17 };
      this.rules[16].opcodes[3] = { type: 1, children: [4, 5, 6, 7] };
      this.rules[16].opcodes[4] = { type: 4, index: 21 };
      this.rules[16].opcodes[5] = { type: 4, index: 25 };
      this.rules[16].opcodes[6] = { type: 4, index: 19 };
      this.rules[16].opcodes[7] = { type: 4, index: 20 };
      this.rules[17].opcodes = [];
      this.rules[17].opcodes[0] = { type: 1, children: [1, 5] };
      this.rules[17].opcodes[1] = { type: 2, children: [2, 3] };
      this.rules[17].opcodes[2] = { type: 4, index: 18 };
      this.rules[17].opcodes[3] = { type: 3, min: 0, max: 1 };
      this.rules[17].opcodes[4] = { type: 4, index: 43 };
      this.rules[17].opcodes[5] = { type: 4, index: 43 };
      this.rules[18].opcodes = [];
      this.rules[18].opcodes[0] = { type: 1, children: [1, 2, 3, 4] };
      this.rules[18].opcodes[1] = { type: 4, index: 49 };
      this.rules[18].opcodes[2] = { type: 4, index: 50 };
      this.rules[18].opcodes[3] = { type: 4, index: 47 };
      this.rules[18].opcodes[4] = { type: 4, index: 48 };
      this.rules[19].opcodes = [];
      this.rules[19].opcodes[0] = { type: 1, children: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] };
      this.rules[19].opcodes[1] = { type: 4, index: 40 };
      this.rules[19].opcodes[2] = { type: 4, index: 29 };
      this.rules[19].opcodes[3] = { type: 4, index: 53 };
      this.rules[19].opcodes[4] = { type: 4, index: 54 };
      this.rules[19].opcodes[5] = { type: 4, index: 55 };
      this.rules[19].opcodes[6] = { type: 4, index: 61 };
      this.rules[19].opcodes[7] = { type: 4, index: 30 };
      this.rules[19].opcodes[8] = { type: 4, index: 51 };
      this.rules[19].opcodes[9] = { type: 4, index: 52 };
      this.rules[19].opcodes[10] = { type: 4, index: 65 };
      this.rules[20].opcodes = [];
      this.rules[20].opcodes[0] = { type: 3, min: 1, max: Infinity };
      this.rules[20].opcodes[1] = { type: 1, children: [2, 3, 4, 5] };
      this.rules[20].opcodes[2] = { type: 5, min: 33, max: 40 };
      this.rules[20].opcodes[3] = { type: 5, min: 42, max: 46 };
      this.rules[20].opcodes[4] = { type: 5, min: 48, max: 92 };
      this.rules[20].opcodes[5] = { type: 5, min: 94, max: 126 };
      this.rules[21].opcodes = [];
      this.rules[21].opcodes[0] = { type: 2, children: [1, 2, 3] };
      this.rules[21].opcodes[1] = { type: 4, index: 23 };
      this.rules[21].opcodes[2] = { type: 4, index: 14 };
      this.rules[21].opcodes[3] = { type: 1, children: [4, 5] };
      this.rules[21].opcodes[4] = { type: 4, index: 24 };
      this.rules[21].opcodes[5] = { type: 4, index: 22 };
      this.rules[22].opcodes = [];
      this.rules[22].opcodes[0] = { type: 3, min: 1, max: Infinity };
      this.rules[22].opcodes[1] = { type: 1, children: [2, 3, 4, 5] };
      this.rules[22].opcodes[2] = { type: 5, min: 33, max: 40 };
      this.rules[22].opcodes[3] = { type: 5, min: 42, max: 46 };
      this.rules[22].opcodes[4] = { type: 5, min: 48, max: 92 };
      this.rules[22].opcodes[5] = { type: 5, min: 94, max: 126 };
      this.rules[23].opcodes = [];
      this.rules[23].opcodes[0] = { type: 2, children: [1, 2] };
      this.rules[23].opcodes[1] = { type: 6, string: [40] };
      this.rules[23].opcodes[2] = { type: 4, index: 89 };
      this.rules[24].opcodes = [];
      this.rules[24].opcodes[0] = { type: 2, children: [1, 2] };
      this.rules[24].opcodes[1] = { type: 4, index: 89 };
      this.rules[24].opcodes[2] = { type: 6, string: [41] };
      this.rules[25].opcodes = [];
      this.rules[25].opcodes[0] = { type: 2, children: [1, 2, 3] };
      this.rules[25].opcodes[1] = { type: 4, index: 27 };
      this.rules[25].opcodes[2] = { type: 4, index: 14 };
      this.rules[25].opcodes[3] = { type: 1, children: [4, 5] };
      this.rules[25].opcodes[4] = { type: 4, index: 28 };
      this.rules[25].opcodes[5] = { type: 4, index: 26 };
      this.rules[26].opcodes = [];
      this.rules[26].opcodes[0] = { type: 3, min: 1, max: Infinity };
      this.rules[26].opcodes[1] = { type: 1, children: [2, 3, 4, 5] };
      this.rules[26].opcodes[2] = { type: 5, min: 33, max: 40 };
      this.rules[26].opcodes[3] = { type: 5, min: 42, max: 46 };
      this.rules[26].opcodes[4] = { type: 5, min: 48, max: 92 };
      this.rules[26].opcodes[5] = { type: 5, min: 94, max: 126 };
      this.rules[27].opcodes = [];
      this.rules[27].opcodes[0] = { type: 2, children: [1, 2] };
      this.rules[27].opcodes[1] = { type: 6, string: [91] };
      this.rules[27].opcodes[2] = { type: 4, index: 89 };
      this.rules[28].opcodes = [];
      this.rules[28].opcodes[0] = { type: 2, children: [1, 2] };
      this.rules[28].opcodes[1] = { type: 4, index: 89 };
      this.rules[28].opcodes[2] = { type: 6, string: [93] };
      this.rules[29].opcodes = [];
      this.rules[29].opcodes[0] = { type: 4, index: 88 };
      this.rules[30].opcodes = [];
      this.rules[30].opcodes[0] = { type: 2, children: [1, 2, 4] };
      this.rules[30].opcodes[1] = { type: 6, string: [92] };
      this.rules[30].opcodes[2] = { type: 3, min: 0, max: 1 };
      this.rules[30].opcodes[3] = { type: 4, index: 31 };
      this.rules[30].opcodes[4] = { type: 4, index: 36 };
      this.rules[31].opcodes = [];
      this.rules[31].opcodes[0] = { type: 1, children: [1, 7, 13, 19] };
      this.rules[31].opcodes[1] = { type: 2, children: [2, 3] };
      this.rules[31].opcodes[2] = { type: 4, index: 32 };
      this.rules[31].opcodes[3] = { type: 3, min: 0, max: 1 };
      this.rules[31].opcodes[4] = { type: 1, children: [5, 6] };
      this.rules[31].opcodes[5] = { type: 4, index: 34 };
      this.rules[31].opcodes[6] = { type: 4, index: 35 };
      this.rules[31].opcodes[7] = { type: 2, children: [8, 9] };
      this.rules[31].opcodes[8] = { type: 4, index: 33 };
      this.rules[31].opcodes[9] = { type: 3, min: 0, max: 1 };
      this.rules[31].opcodes[10] = { type: 1, children: [11, 12] };
      this.rules[31].opcodes[11] = { type: 4, index: 34 };
      this.rules[31].opcodes[12] = { type: 4, index: 35 };
      this.rules[31].opcodes[13] = { type: 2, children: [14, 15] };
      this.rules[31].opcodes[14] = { type: 4, index: 34 };
      this.rules[31].opcodes[15] = { type: 3, min: 0, max: 1 };
      this.rules[31].opcodes[16] = { type: 1, children: [17, 18] };
      this.rules[31].opcodes[17] = { type: 4, index: 32 };
      this.rules[31].opcodes[18] = { type: 4, index: 33 };
      this.rules[31].opcodes[19] = { type: 2, children: [20, 21] };
      this.rules[31].opcodes[20] = { type: 4, index: 35 };
      this.rules[31].opcodes[21] = { type: 3, min: 0, max: 1 };
      this.rules[31].opcodes[22] = { type: 1, children: [23, 24] };
      this.rules[31].opcodes[23] = { type: 4, index: 32 };
      this.rules[31].opcodes[24] = { type: 4, index: 33 };
      this.rules[32].opcodes = [];
      this.rules[32].opcodes[0] = { type: 6, string: [37, 115] };
      this.rules[33].opcodes = [];
      this.rules[33].opcodes[0] = { type: 6, string: [37, 105] };
      this.rules[34].opcodes = [];
      this.rules[34].opcodes[0] = { type: 6, string: [37, 117] };
      this.rules[35].opcodes = [];
      this.rules[35].opcodes[0] = { type: 6, string: [37, 112] };
      this.rules[36].opcodes = [];
      this.rules[36].opcodes[0] = { type: 1, children: [1, 2, 3] };
      this.rules[36].opcodes[1] = { type: 4, index: 38 };
      this.rules[36].opcodes[2] = { type: 4, index: 39 };
      this.rules[36].opcodes[3] = { type: 4, index: 37 };
      this.rules[37].opcodes = [];
      this.rules[37].opcodes[0] = { type: 4, index: 88 };
      this.rules[38].opcodes = [];
      this.rules[38].opcodes[0] = { type: 2, children: [1, 2] };
      this.rules[38].opcodes[1] = { type: 6, string: [117, 95] };
      this.rules[38].opcodes[2] = { type: 4, index: 88 };
      this.rules[39].opcodes = [];
      this.rules[39].opcodes[0] = { type: 2, children: [1, 2] };
      this.rules[39].opcodes[1] = { type: 6, string: [101, 95] };
      this.rules[39].opcodes[2] = { type: 4, index: 88 };
      this.rules[40].opcodes = [];
      this.rules[40].opcodes[0] = { type: 1, children: [1, 2] };
      this.rules[40].opcodes[1] = { type: 4, index: 42 };
      this.rules[40].opcodes[2] = { type: 4, index: 41 };
      this.rules[41].opcodes = [];
      this.rules[41].opcodes[0] = { type: 2, children: [1, 2] };
      this.rules[41].opcodes[1] = { type: 6, string: [117, 95] };
      this.rules[41].opcodes[2] = { type: 4, index: 88 };
      this.rules[42].opcodes = [];
      this.rules[42].opcodes[0] = { type: 2, children: [1, 2] };
      this.rules[42].opcodes[1] = { type: 6, string: [101, 95] };
      this.rules[42].opcodes[2] = { type: 4, index: 88 };
      this.rules[43].opcodes = [];
      this.rules[43].opcodes[0] = { type: 1, children: [1, 5, 8, 11, 12] };
      this.rules[43].opcodes[1] = { type: 2, children: [2, 3, 4] };
      this.rules[43].opcodes[2] = { type: 4, index: 69 };
      this.rules[43].opcodes[3] = { type: 4, index: 46 };
      this.rules[43].opcodes[4] = { type: 4, index: 71 };
      this.rules[43].opcodes[5] = { type: 2, children: [6, 7] };
      this.rules[43].opcodes[6] = { type: 4, index: 69 };
      this.rules[43].opcodes[7] = { type: 4, index: 46 };
      this.rules[43].opcodes[8] = { type: 2, children: [9, 10] };
      this.rules[43].opcodes[9] = { type: 4, index: 46 };
      this.rules[43].opcodes[10] = { type: 4, index: 71 };
      this.rules[43].opcodes[11] = { type: 4, index: 46 };
      this.rules[43].opcodes[12] = { type: 4, index: 70 };
      this.rules[44].opcodes = [];
      this.rules[44].opcodes[0] = { type: 2, children: [1, 2] };
      this.rules[44].opcodes[1] = { type: 6, string: [47] };
      this.rules[44].opcodes[2] = { type: 4, index: 89 };
      this.rules[45].opcodes = [];
      this.rules[45].opcodes[0] = { type: 4, index: 90 };
      this.rules[46].opcodes = [];
      this.rules[46].opcodes[0] = { type: 6, string: [42] };
      this.rules[47].opcodes = [];
      this.rules[47].opcodes[0] = { type: 6, string: [38] };
      this.rules[48].opcodes = [];
      this.rules[48].opcodes[0] = { type: 6, string: [33] };
      this.rules[49].opcodes = [];
      this.rules[49].opcodes[0] = { type: 6, string: [38, 38] };
      this.rules[50].opcodes = [];
      this.rules[50].opcodes[0] = { type: 6, string: [33, 33] };
      this.rules[51].opcodes = [];
      this.rules[51].opcodes[0] = { type: 6, string: [37, 94] };
      this.rules[52].opcodes = [];
      this.rules[52].opcodes[0] = { type: 6, string: [37, 36] };
      this.rules[53].opcodes = [];
      this.rules[53].opcodes[0] = { type: 2, children: [1, 2] };
      this.rules[53].opcodes[1] = { type: 6, string: [37] };
      this.rules[53].opcodes[2] = { type: 1, children: [3, 8, 13] };
      this.rules[53].opcodes[3] = { type: 2, children: [4, 5, 6, 7] };
      this.rules[53].opcodes[4] = { type: 4, index: 76 };
      this.rules[53].opcodes[5] = { type: 4, index: 79 };
      this.rules[53].opcodes[6] = { type: 6, string: [45] };
      this.rules[53].opcodes[7] = { type: 4, index: 80 };
      this.rules[53].opcodes[8] = { type: 2, children: [9, 10, 11, 12] };
      this.rules[53].opcodes[9] = { type: 4, index: 77 };
      this.rules[53].opcodes[10] = { type: 4, index: 83 };
      this.rules[53].opcodes[11] = { type: 6, string: [45] };
      this.rules[53].opcodes[12] = { type: 4, index: 84 };
      this.rules[53].opcodes[13] = { type: 2, children: [14, 15, 16, 17] };
      this.rules[53].opcodes[14] = { type: 4, index: 78 };
      this.rules[53].opcodes[15] = { type: 4, index: 81 };
      this.rules[53].opcodes[16] = { type: 6, string: [45] };
      this.rules[53].opcodes[17] = { type: 4, index: 82 };
      this.rules[54].opcodes = [];
      this.rules[54].opcodes[0] = { type: 2, children: [1, 2] };
      this.rules[54].opcodes[1] = { type: 6, string: [37] };
      this.rules[54].opcodes[2] = { type: 1, children: [3, 10, 17] };
      this.rules[54].opcodes[3] = { type: 2, children: [4, 5, 6] };
      this.rules[54].opcodes[4] = { type: 4, index: 76 };
      this.rules[54].opcodes[5] = { type: 4, index: 73 };
      this.rules[54].opcodes[6] = { type: 3, min: 0, max: Infinity };
      this.rules[54].opcodes[7] = { type: 2, children: [8, 9] };
      this.rules[54].opcodes[8] = { type: 6, string: [46] };
      this.rules[54].opcodes[9] = { type: 4, index: 73 };
      this.rules[54].opcodes[10] = { type: 2, children: [11, 12, 13] };
      this.rules[54].opcodes[11] = { type: 4, index: 77 };
      this.rules[54].opcodes[12] = { type: 4, index: 74 };
      this.rules[54].opcodes[13] = { type: 3, min: 0, max: Infinity };
      this.rules[54].opcodes[14] = { type: 2, children: [15, 16] };
      this.rules[54].opcodes[15] = { type: 6, string: [46] };
      this.rules[54].opcodes[16] = { type: 4, index: 74 };
      this.rules[54].opcodes[17] = { type: 2, children: [18, 19, 20] };
      this.rules[54].opcodes[18] = { type: 4, index: 78 };
      this.rules[54].opcodes[19] = { type: 4, index: 75 };
      this.rules[54].opcodes[20] = { type: 3, min: 0, max: Infinity };
      this.rules[54].opcodes[21] = { type: 2, children: [22, 23] };
      this.rules[54].opcodes[22] = { type: 6, string: [46] };
      this.rules[54].opcodes[23] = { type: 4, index: 75 };
      this.rules[55].opcodes = [];
      this.rules[55].opcodes[0] = { type: 2, children: [1, 2, 3, 4] };
      this.rules[55].opcodes[1] = { type: 4, index: 56 };
      this.rules[55].opcodes[2] = { type: 4, index: 57 };
      this.rules[55].opcodes[3] = { type: 4, index: 59 };
      this.rules[55].opcodes[4] = { type: 4, index: 58 };
      this.rules[56].opcodes = [];
      this.rules[56].opcodes[0] = { type: 3, min: 0, max: 1 };
      this.rules[56].opcodes[1] = { type: 1, children: [2, 3] };
      this.rules[56].opcodes[2] = { type: 7, string: [37, 105] };
      this.rules[56].opcodes[3] = { type: 7, string: [37, 115] };
      this.rules[57].opcodes = [];
      this.rules[57].opcodes[0] = { type: 6, string: [34] };
      this.rules[58].opcodes = [];
      this.rules[58].opcodes[0] = { type: 6, string: [34] };
      this.rules[59].opcodes = [];
      this.rules[59].opcodes[0] = { type: 3, min: 0, max: Infinity };
      this.rules[59].opcodes[1] = { type: 1, children: [2, 3, 4] };
      this.rules[59].opcodes[2] = { type: 5, min: 32, max: 33 };
      this.rules[59].opcodes[3] = { type: 5, min: 35, max: 126 };
      this.rules[59].opcodes[4] = { type: 4, index: 60 };
      this.rules[60].opcodes = [];
      this.rules[60].opcodes[0] = { type: 6, string: [9] };
      this.rules[61].opcodes = [];
      this.rules[61].opcodes[0] = { type: 2, children: [1, 2, 3] };
      this.rules[61].opcodes[1] = { type: 4, index: 62 };
      this.rules[61].opcodes[2] = { type: 4, index: 64 };
      this.rules[61].opcodes[3] = { type: 4, index: 63 };
      this.rules[62].opcodes = [];
      this.rules[62].opcodes[0] = { type: 6, string: [39] };
      this.rules[63].opcodes = [];
      this.rules[63].opcodes[0] = { type: 6, string: [39] };
      this.rules[64].opcodes = [];
      this.rules[64].opcodes[0] = { type: 3, min: 0, max: Infinity };
      this.rules[64].opcodes[1] = { type: 1, children: [2, 3, 4] };
      this.rules[64].opcodes[2] = { type: 5, min: 32, max: 38 };
      this.rules[64].opcodes[3] = { type: 5, min: 40, max: 126 };
      this.rules[64].opcodes[4] = { type: 4, index: 60 };
      this.rules[65].opcodes = [];
      this.rules[65].opcodes[0] = { type: 2, children: [1, 2, 3] };
      this.rules[65].opcodes[1] = { type: 4, index: 66 };
      this.rules[65].opcodes[2] = { type: 4, index: 67 };
      this.rules[65].opcodes[3] = { type: 4, index: 68 };
      this.rules[66].opcodes = [];
      this.rules[66].opcodes[0] = { type: 6, string: [60] };
      this.rules[67].opcodes = [];
      this.rules[67].opcodes[0] = { type: 3, min: 0, max: Infinity };
      this.rules[67].opcodes[1] = { type: 1, children: [2, 3, 4] };
      this.rules[67].opcodes[2] = { type: 5, min: 32, max: 61 };
      this.rules[67].opcodes[3] = { type: 5, min: 63, max: 126 };
      this.rules[67].opcodes[4] = { type: 4, index: 60 };
      this.rules[68].opcodes = [];
      this.rules[68].opcodes[0] = { type: 6, string: [62] };
      this.rules[69].opcodes = [];
      this.rules[69].opcodes[0] = { type: 4, index: 72 };
      this.rules[70].opcodes = [];
      this.rules[70].opcodes[0] = { type: 4, index: 72 };
      this.rules[71].opcodes = [];
      this.rules[71].opcodes[0] = { type: 4, index: 72 };
      this.rules[72].opcodes = [];
      this.rules[72].opcodes[0] = { type: 3, min: 1, max: Infinity };
      this.rules[72].opcodes[1] = { type: 5, min: 48, max: 57 };
      this.rules[73].opcodes = [];
      this.rules[73].opcodes[0] = { type: 4, index: 85 };
      this.rules[74].opcodes = [];
      this.rules[74].opcodes[0] = { type: 4, index: 87 };
      this.rules[75].opcodes = [];
      this.rules[75].opcodes[0] = { type: 4, index: 86 };
      this.rules[76].opcodes = [];
      this.rules[76].opcodes[0] = { type: 1, children: [1, 2] };
      this.rules[76].opcodes[1] = { type: 6, string: [68] };
      this.rules[76].opcodes[2] = { type: 6, string: [100] };
      this.rules[77].opcodes = [];
      this.rules[77].opcodes[0] = { type: 1, children: [1, 2] };
      this.rules[77].opcodes[1] = { type: 6, string: [88] };
      this.rules[77].opcodes[2] = { type: 6, string: [120] };
      this.rules[78].opcodes = [];
      this.rules[78].opcodes[0] = { type: 1, children: [1, 2] };
      this.rules[78].opcodes[1] = { type: 6, string: [66] };
      this.rules[78].opcodes[2] = { type: 6, string: [98] };
      this.rules[79].opcodes = [];
      this.rules[79].opcodes[0] = { type: 4, index: 85 };
      this.rules[80].opcodes = [];
      this.rules[80].opcodes[0] = { type: 4, index: 85 };
      this.rules[81].opcodes = [];
      this.rules[81].opcodes[0] = { type: 4, index: 86 };
      this.rules[82].opcodes = [];
      this.rules[82].opcodes[0] = { type: 4, index: 86 };
      this.rules[83].opcodes = [];
      this.rules[83].opcodes[0] = { type: 4, index: 87 };
      this.rules[84].opcodes = [];
      this.rules[84].opcodes[0] = { type: 4, index: 87 };
      this.rules[85].opcodes = [];
      this.rules[85].opcodes[0] = { type: 3, min: 1, max: Infinity };
      this.rules[85].opcodes[1] = { type: 5, min: 48, max: 57 };
      this.rules[86].opcodes = [];
      this.rules[86].opcodes[0] = { type: 3, min: 1, max: Infinity };
      this.rules[86].opcodes[1] = { type: 5, min: 48, max: 49 };
      this.rules[87].opcodes = [];
      this.rules[87].opcodes[0] = { type: 3, min: 1, max: Infinity };
      this.rules[87].opcodes[1] = { type: 1, children: [2, 3, 4] };
      this.rules[87].opcodes[2] = { type: 5, min: 48, max: 57 };
      this.rules[87].opcodes[3] = { type: 5, min: 65, max: 70 };
      this.rules[87].opcodes[4] = { type: 5, min: 97, max: 102 };
      this.rules[88].opcodes = [];
      this.rules[88].opcodes[0] = { type: 2, children: [1, 4] };
      this.rules[88].opcodes[1] = { type: 1, children: [2, 3] };
      this.rules[88].opcodes[2] = { type: 5, min: 97, max: 122 };
      this.rules[88].opcodes[3] = { type: 5, min: 65, max: 90 };
      this.rules[88].opcodes[4] = { type: 3, min: 0, max: Infinity };
      this.rules[88].opcodes[5] = { type: 1, children: [6, 7, 8, 9] };
      this.rules[88].opcodes[6] = { type: 5, min: 97, max: 122 };
      this.rules[88].opcodes[7] = { type: 5, min: 65, max: 90 };
      this.rules[88].opcodes[8] = { type: 5, min: 48, max: 57 };
      this.rules[88].opcodes[9] = { type: 6, string: [45] };
      this.rules[89].opcodes = [];
      this.rules[89].opcodes[0] = { type: 3, min: 0, max: Infinity };
      this.rules[89].opcodes[1] = { type: 4, index: 91 };
      this.rules[90].opcodes = [];
      this.rules[90].opcodes[0] = { type: 3, min: 1, max: Infinity };
      this.rules[90].opcodes[1] = { type: 4, index: 91 };
      this.rules[91].opcodes = [];
      this.rules[91].opcodes[0] = { type: 1, children: [1, 2, 3, 4] };
      this.rules[91].opcodes[1] = { type: 6, string: [32] };
      this.rules[91].opcodes[2] = { type: 6, string: [9] };
      this.rules[91].opcodes[3] = { type: 4, index: 92 };
      this.rules[91].opcodes[4] = { type: 4, index: 94 };
      this.rules[92].opcodes = [];
      this.rules[92].opcodes[0] = { type: 2, children: [1, 2] };
      this.rules[92].opcodes[1] = { type: 6, string: [59] };
      this.rules[92].opcodes[2] = { type: 3, min: 0, max: Infinity };
      this.rules[92].opcodes[3] = { type: 1, children: [4, 5] };
      this.rules[92].opcodes[4] = { type: 5, min: 32, max: 126 };
      this.rules[92].opcodes[5] = { type: 6, string: [9] };
      this.rules[93].opcodes = [];
      this.rules[93].opcodes[0] = { type: 1, children: [1, 2, 3] };
      this.rules[93].opcodes[1] = { type: 6, string: [13, 10] };
      this.rules[93].opcodes[2] = { type: 6, string: [10] };
      this.rules[93].opcodes[3] = { type: 6, string: [13] };
      this.rules[94].opcodes = [];
      this.rules[94].opcodes[0] = { type: 2, children: [1, 5] };
      this.rules[94].opcodes[1] = { type: 1, children: [2, 3, 4] };
      this.rules[94].opcodes[2] = { type: 6, string: [13, 10] };
      this.rules[94].opcodes[3] = { type: 6, string: [10] };
      this.rules[94].opcodes[4] = { type: 6, string: [13] };
      this.rules[94].opcodes[5] = { type: 1, children: [6, 7] };
      this.rules[94].opcodes[6] = { type: 6, string: [32] };
      this.rules[94].opcodes[7] = { type: 6, string: [9] };
      this.toString = function toString() {
        let str = "";
        str += ";\n";
        str += "; ABNF for JavaScript APG 2.0 SABNF\n";
        str += "; RFC 5234 with some restrictions and additions.\n";
        str += "; Updated 11/24/2015 for RFC 7405 case-sensitive literal string notation\n";
        str += ';  - accepts %s"string" as a case-sensitive string\n';
        str += ';  - accepts %i"string" as a case-insensitive string\n';
        str += ';  - accepts "string" as a case-insensitive string\n';
        str += ";\n";
        str += "; Some restrictions:\n";
        str += ";   1. Rules must begin at first character of each line.\n";
        str += ";      Indentations on first rule and rules thereafter are not allowed.\n";
        str += ";   2. Relaxed line endings. CRLF, LF or CR are accepted as valid line ending.\n";
        str += ";   3. Prose values, i.e. <prose value>, are accepted as valid grammar syntax.\n";
        str += ";      However, a working parser cannot be generated from them.\n";
        str += ";\n";
        str += "; Super set (SABNF) additions:\n";
        str += ";   1. Look-ahead (syntactic predicate) operators are accepted as element prefixes.\n";
        str += ";      & is the positive look-ahead operator, succeeds and backtracks if the look-ahead phrase is found\n";
        str += ";      ! is the negative look-ahead operator, succeeds and backtracks if the look-ahead phrase is NOT found\n";
        str += ";      e.g. &%d13 or &rule or !(A / B)\n";
        str += ";   2. User-Defined Terminals (UDT) of the form, u_name and e_name are accepted.\n";
        str += ";      'name' is alpha followed by alpha/num/hyphen just like a rule name.\n";
        str += ";      u_name may be used as an element but no rule definition is given.\n";
        str += ";      e.g. rule = A / u_myUdt\n";
        str += ';           A = "a"\n';
        str += ";      would be a valid grammar.\n";
        str += ";   3. Case-sensitive, single-quoted strings are accepted.\n";
        str += ";      e.g. 'abc' would be equivalent to %d97.98.99\n";
        str += ';      (kept for backward compatibility, but superseded by %s"abc")  \n';
        str += "; New 12/26/2015\n";
        str += ";   4. Look-behind operators are accepted as element prefixes.\n";
        str += ";      && is the positive look-behind operator, succeeds and backtracks if the look-behind phrase is found\n";
        str += ";      !! is the negative look-behind operator, succeeds and backtracks if the look-behind phrase is NOT found\n";
        str += ";      e.g. &&%d13 or &&rule or !!(A / B)\n";
        str += ";   5. Back reference operators, i.e. \\rulename, are accepted.\n";
        str += ";      A back reference operator acts like a TLS or TBS terminal except that the phrase it attempts\n";
        str += ";      to match is a phrase previously matched by the rule 'rulename'.\n";
        str += ";      There are two modes of previous phrase matching - the parent-frame mode and the universal mode.\n";
        str += ";      In universal mode, \\rulename matches the last match to 'rulename' regardless of where it was found.\n";
        str += ";      In parent-frame mode, \\rulename matches only the last match found on the parent's frame or parse tree level.\n";
        str += ";      Back reference modifiers can be used to specify case and mode.\n";
        str += ";      \\A defaults to case-insensitive and universal mode, e.g. \\A === \\%i%uA\n";
        str += ";      Modifiers %i and %s determine case-insensitive and case-sensitive mode, respectively.\n";
        str += ";      Modifiers %u and %p determine universal mode and parent frame mode, respectively.\n";
        str += ";      Case and mode modifiers can appear in any order, e.g. \\%s%pA === \\%p%sA. \n";
        str += ";   7. String begin anchor, ABG(%^) matches the beginning of the input string location.\n";
        str += ";      Returns EMPTY or NOMATCH. Never consumes any characters.\n";
        str += ";   8. String end anchor, AEN(%$) matches the end of the input string location.\n";
        str += ";      Returns EMPTY or NOMATCH. Never consumes any characters.\n";
        str += ";\n";
        str += "File            = *(BlankLine / Rule / RuleError)\n";
        str += "BlankLine       = *(%d32/%d9) [comment] LineEnd\n";
        str += "Rule            = RuleLookup owsp Alternation ((owsp LineEnd)\n";
        str += "                / (LineEndError LineEnd))\n";
        str += "RuleLookup      = RuleNameTest owsp DefinedAsTest\n";
        str += "RuleNameTest    = RuleName/RuleNameError\n";
        str += "RuleName        = alphanum\n";
        str += "RuleNameError   = 1*(%d33-60/%d62-126)\n";
        str += "DefinedAsTest   = DefinedAs / DefinedAsError\n";
        str += "DefinedAsError  = 1*2%d33-126\n";
        str += "DefinedAs       = IncAlt / Defined\n";
        str += "Defined         = %d61\n";
        str += "IncAlt          = %d61.47\n";
        str += "RuleError       = 1*(%d32-126 / %d9  / LineContinue) LineEnd\n";
        str += "LineEndError    = 1*(%d32-126 / %d9  / LineContinue)\n";
        str += "Alternation     = Concatenation *(owsp AltOp Concatenation)\n";
        str += "Concatenation   = Repetition *(CatOp Repetition)\n";
        str += "Repetition      = [Modifier] (Group / Option / BasicElement / BasicElementErr)\n";
        str += "Modifier        = (Predicate [RepOp])\n";
        str += "                / RepOp\n";
        str += "Predicate       = BkaOp\n";
        str += "                / BknOp\n";
        str += "                / AndOp\n";
        str += "                / NotOp\n";
        str += "BasicElement    = UdtOp\n";
        str += "                / RnmOp\n";
        str += "                / TrgOp\n";
        str += "                / TbsOp\n";
        str += "                / TlsOp\n";
        str += "                / ClsOp\n";
        str += "                / BkrOp\n";
        str += "                / AbgOp\n";
        str += "                / AenOp\n";
        str += "                / ProsVal\n";
        str += "BasicElementErr = 1*(%d33-40/%d42-46/%d48-92/%d94-126)\n";
        str += "Group           = GroupOpen  Alternation (GroupClose / GroupError)\n";
        str += "GroupError      = 1*(%d33-40/%d42-46/%d48-92/%d94-126) ; same as BasicElementErr\n";
        str += "GroupOpen       = %d40 owsp\n";
        str += "GroupClose      = owsp %d41\n";
        str += "Option          = OptionOpen Alternation (OptionClose / OptionError)\n";
        str += "OptionError     = 1*(%d33-40/%d42-46/%d48-92/%d94-126) ; same as BasicElementErr\n";
        str += "OptionOpen      = %d91 owsp\n";
        str += "OptionClose     = owsp %d93\n";
        str += "RnmOp           = alphanum\n";
        str += "BkrOp           = %d92 [bkrModifier] bkr-name\n";
        str += "bkrModifier     = (cs [um / pm]) / (ci [um / pm]) / (um [cs /ci]) / (pm [cs / ci])\n";
        str += "cs              = '%s'\n";
        str += "ci              = '%i'\n";
        str += "um              = '%u'\n";
        str += "pm              = '%p'\n";
        str += "bkr-name        = uname / ename / rname\n";
        str += "rname           = alphanum\n";
        str += "uname           = %d117.95 alphanum\n";
        str += "ename           = %d101.95 alphanum\n";
        str += "UdtOp           = udt-empty\n";
        str += "                / udt-non-empty\n";
        str += "udt-non-empty   = %d117.95 alphanum\n";
        str += "udt-empty       = %d101.95 alphanum\n";
        str += "RepOp           = (rep-min StarOp rep-max)\n";
        str += "                / (rep-min StarOp)\n";
        str += "                / (StarOp rep-max)\n";
        str += "                / StarOp\n";
        str += "                / rep-min-max\n";
        str += "AltOp           = %d47 owsp\n";
        str += "CatOp           = wsp\n";
        str += "StarOp          = %d42\n";
        str += "AndOp           = %d38\n";
        str += "NotOp           = %d33\n";
        str += "BkaOp           = %d38.38\n";
        str += "BknOp           = %d33.33\n";
        str += "AbgOp           = %d37.94\n";
        str += "AenOp           = %d37.36\n";
        str += "TrgOp           = %d37 ((Dec dmin %d45 dmax) / (Hex xmin %d45 xmax) / (Bin bmin %d45 bmax))\n";
        str += "TbsOp           = %d37 ((Dec dString *(%d46 dString)) / (Hex xString *(%d46 xString)) / (Bin bString *(%d46 bString)))\n";
        str += "TlsOp           = TlsCase TlsOpen TlsString TlsClose\n";
        str += 'TlsCase         = ["%i" / "%s"]\n';
        str += "TlsOpen         = %d34\n";
        str += "TlsClose        = %d34\n";
        str += "TlsString       = *(%d32-33/%d35-126/StringTab)\n";
        str += "StringTab       = %d9\n";
        str += "ClsOp           = ClsOpen ClsString ClsClose\n";
        str += "ClsOpen         = %d39\n";
        str += "ClsClose        = %d39\n";
        str += "ClsString       = *(%d32-38/%d40-126/StringTab)\n";
        str += "ProsVal         = ProsValOpen ProsValString ProsValClose\n";
        str += "ProsValOpen     = %d60\n";
        str += "ProsValString   = *(%d32-61/%d63-126/StringTab)\n";
        str += "ProsValClose    = %d62\n";
        str += "rep-min         = rep-num\n";
        str += "rep-min-max     = rep-num\n";
        str += "rep-max         = rep-num\n";
        str += "rep-num         = 1*(%d48-57)\n";
        str += "dString         = dnum\n";
        str += "xString         = xnum\n";
        str += "bString         = bnum\n";
        str += "Dec             = (%d68/%d100)\n";
        str += "Hex             = (%d88/%d120)\n";
        str += "Bin             = (%d66/%d98)\n";
        str += "dmin            = dnum\n";
        str += "dmax            = dnum\n";
        str += "bmin            = bnum\n";
        str += "bmax            = bnum\n";
        str += "xmin            = xnum\n";
        str += "xmax            = xnum\n";
        str += "dnum            = 1*(%d48-57)\n";
        str += "bnum            = 1*%d48-49\n";
        str += "xnum            = 1*(%d48-57 / %d65-70 / %d97-102)\n";
        str += ";\n";
        str += "; Basics\n";
        str += "alphanum        = (%d97-122/%d65-90) *(%d97-122/%d65-90/%d48-57/%d45)\n";
        str += "owsp            = *space\n";
        str += "wsp             = 1*space\n";
        str += "space           = %d32\n";
        str += "                / %d9\n";
        str += "                / comment\n";
        str += "                / LineContinue\n";
        str += "comment         = %d59 *(%d32-126 / %d9)\n";
        str += "LineEnd         = %d13.10\n";
        str += "                / %d10\n";
        str += "                / %d13\n";
        str += "LineContinue    = (%d13.10 / %d10 / %d13) (%d32 / %d9)\n";
        return str;
      };
    };
  }
});

// ../../node_modules/apg-js/src/apg-api/parser.js
var require_parser2 = __commonJS({
  "../../node_modules/apg-js/src/apg-api/parser.js"(exports, module2) {
    init_esbuild_shims();
    module2.exports = function exportParser() {
      const thisFileName = "parser: ";
      const ApgLib = require_node_exports();
      const id = ApgLib.ids;
      const syn = new (require_syntax_callbacks())();
      const sem = new (require_semantic_callbacks())();
      const sabnfGrammar = new (require_sabnf_grammar())();
      const parser = new ApgLib.parser();
      parser.ast = new ApgLib.ast();
      parser.callbacks = syn.callbacks;
      parser.ast.callbacks = sem.callbacks;
      const findLine = function findLine2(lines, charIndex, charLength) {
        if (charIndex < 0 || charIndex >= charLength) {
          return -1;
        }
        for (let i = 0; i < lines.length; i += 1) {
          if (charIndex >= lines[i].beginChar && charIndex < lines[i].beginChar + lines[i].length) {
            return i;
          }
        }
        return -1;
      };
      const translateIndex = function translateIndex2(map, index) {
        let ret = -1;
        if (index < map.length) {
          for (let i = index; i < map.length; i += 1) {
            if (map[i] !== null) {
              ret = map[i];
              break;
            }
          }
        }
        return ret;
      };
      const reduceOpcodes = function reduceOpcodes2(rules) {
        rules.forEach((rule) => {
          const opcodes = [];
          const map = [];
          let reducedIndex = 0;
          rule.opcodes.forEach((op) => {
            if (op.type === id.ALT && op.children.length === 1) {
              map.push(null);
            } else if (op.type === id.CAT && op.children.length === 1) {
              map.push(null);
            } else if (op.type === id.REP && op.min === 1 && op.max === 1) {
              map.push(null);
            } else {
              map.push(reducedIndex);
              opcodes.push(op);
              reducedIndex += 1;
            }
          });
          map.push(reducedIndex);
          opcodes.forEach((op) => {
            if (op.type === id.ALT || op.type === id.CAT) {
              for (let i = 0; i < op.children.length; i += 1) {
                op.children[i] = translateIndex(map, op.children[i]);
              }
            }
          });
          rule.opcodes = opcodes;
        });
      };
      this.syntax = function syntax(chars, lines, errors, strict, trace) {
        if (trace) {
          if (trace.traceObject !== "traceObject") {
            throw new TypeError(`${thisFileName}trace argument is not a trace object`);
          }
          parser.trace = trace;
        }
        const data = {};
        data.errors = errors;
        data.strict = !!strict;
        data.lines = lines;
        data.findLine = findLine;
        data.charsLength = chars.length;
        data.ruleCount = 0;
        const result = parser.parse(sabnfGrammar, "file", chars, data);
        if (!result.success) {
          errors.push({
            line: 0,
            char: 0,
            msg: "syntax analysis of input grammar failed"
          });
        }
      };
      this.semantic = function semantic(chars, lines, errors) {
        const data = {};
        data.errors = errors;
        data.lines = lines;
        data.findLine = findLine;
        data.charsLength = chars.length;
        parser.ast.translate(data);
        if (errors.length) {
          return null;
        }
        reduceOpcodes(data.rules);
        return {
          rules: data.rules,
          udts: data.udts,
          lineMap: data.rulesLineMap
        };
      };
      this.generateSource = function generateSource(chars, lines, rules, udts, name) {
        let source = "";
        let i;
        let bkrname;
        let bkrlower;
        let opcodeCount = 0;
        let charCodeMin = Infinity;
        let charCodeMax = 0;
        const ruleNames = [];
        const udtNames = [];
        let alt = 0;
        let cat = 0;
        let rnm = 0;
        let udt = 0;
        let rep = 0;
        let and = 0;
        let not = 0;
        let tls = 0;
        let tbs = 0;
        let trg = 0;
        let bkr = 0;
        let bka = 0;
        let bkn = 0;
        let abg = 0;
        let aen = 0;
        rules.forEach((rule) => {
          ruleNames.push(rule.lower);
          opcodeCount += rule.opcodes.length;
          rule.opcodes.forEach((op) => {
            switch (op.type) {
              case id.ALT:
                alt += 1;
                break;
              case id.CAT:
                cat += 1;
                break;
              case id.RNM:
                rnm += 1;
                break;
              case id.UDT:
                udt += 1;
                break;
              case id.REP:
                rep += 1;
                break;
              case id.AND:
                and += 1;
                break;
              case id.NOT:
                not += 1;
                break;
              case id.BKA:
                bka += 1;
                break;
              case id.BKN:
                bkn += 1;
                break;
              case id.BKR:
                bkr += 1;
                break;
              case id.ABG:
                abg += 1;
                break;
              case id.AEN:
                aen += 1;
                break;
              case id.TLS:
                tls += 1;
                for (i = 0; i < op.string.length; i += 1) {
                  if (op.string[i] < charCodeMin) {
                    charCodeMin = op.string[i];
                  }
                  if (op.string[i] > charCodeMax) {
                    charCodeMax = op.string[i];
                  }
                }
                break;
              case id.TBS:
                tbs += 1;
                for (i = 0; i < op.string.length; i += 1) {
                  if (op.string[i] < charCodeMin) {
                    charCodeMin = op.string[i];
                  }
                  if (op.string[i] > charCodeMax) {
                    charCodeMax = op.string[i];
                  }
                }
                break;
              case id.TRG:
                trg += 1;
                if (op.min < charCodeMin) {
                  charCodeMin = op.min;
                }
                if (op.max > charCodeMax) {
                  charCodeMax = op.max;
                }
                break;
              default:
                throw new Error("generateSource: unrecognized opcode");
            }
          });
        });
        ruleNames.sort();
        if (udts.length > 0) {
          udts.forEach((udtFunc) => {
            udtNames.push(udtFunc.lower);
          });
          udtNames.sort();
        }
        let funcname = "module.exports";
        if (name && typeof name === "string") {
          funcname = `let ${name}`;
        }
        source += "// copyright: Copyright (c) 2021 Lowell D. Thomas, all rights reserved<br>\n";
        source += "//   license: BSD-2-Clause (https://opensource.org/licenses/BSD-2-Clause)<br>\n";
        source += "//\n";
        source += "// Generated by apg-js, Version 4.0.0 [apg-js](https://github.com/ldthomas/apg-js)\n";
        source += `${funcname} = function grammar(){
`;
        source += "  // ```\n";
        source += "  // SUMMARY\n";
        source += `  //      rules = ${rules.length}
`;
        source += `  //       udts = ${udts.length}
`;
        source += `  //    opcodes = ${opcodeCount}
`;
        source += "  //        ---   ABNF original opcodes\n";
        source += `  //        ALT = ${alt}
`;
        source += `  //        CAT = ${cat}
`;
        source += `  //        REP = ${rep}
`;
        source += `  //        RNM = ${rnm}
`;
        source += `  //        TLS = ${tls}
`;
        source += `  //        TBS = ${tbs}
`;
        source += `  //        TRG = ${trg}
`;
        source += "  //        ---   SABNF superset opcodes\n";
        source += `  //        UDT = ${udt}
`;
        source += `  //        AND = ${and}
`;
        source += `  //        NOT = ${not}
`;
        source += `  //        BKA = ${bka}
`;
        source += `  //        BKN = ${bkn}
`;
        source += `  //        BKR = ${bkr}
`;
        source += `  //        ABG = ${abg}
`;
        source += `  //        AEN = ${aen}
`;
        source += "  // characters = [";
        if (tls + tbs + trg === 0) {
          source += " none defined ]";
        } else {
          source += `${charCodeMin} - ${charCodeMax}]`;
        }
        if (udt > 0) {
          source += " + user defined";
        }
        source += "\n";
        source += "  // ```\n";
        source += "  /* OBJECT IDENTIFIER (for internal parser use) */\n";
        source += "  this.grammarObject = 'grammarObject';\n";
        source += "\n";
        source += "  /* RULES */\n";
        source += "  this.rules = [];\n";
        rules.forEach((rule, ii) => {
          let thisRule = "  this.rules[";
          thisRule += ii;
          thisRule += "] = {name: '";
          thisRule += rule.name;
          thisRule += "', lower: '";
          thisRule += rule.lower;
          thisRule += "', index: ";
          thisRule += rule.index;
          thisRule += ", isBkr: ";
          thisRule += rule.isBkr;
          thisRule += "};\n";
          source += thisRule;
        });
        source += "\n";
        source += "  /* UDTS */\n";
        source += "  this.udts = [];\n";
        if (udts.length > 0) {
          udts.forEach((udtFunc, ii) => {
            let thisUdt = "  this.udts[";
            thisUdt += ii;
            thisUdt += "] = {name: '";
            thisUdt += udtFunc.name;
            thisUdt += "', lower: '";
            thisUdt += udtFunc.lower;
            thisUdt += "', index: ";
            thisUdt += udtFunc.index;
            thisUdt += ", empty: ";
            thisUdt += udtFunc.empty;
            thisUdt += ", isBkr: ";
            thisUdt += udtFunc.isBkr;
            thisUdt += "};\n";
            source += thisUdt;
          });
        }
        source += "\n";
        source += "  /* OPCODES */\n";
        rules.forEach((rule, ruleIndex) => {
          if (ruleIndex > 0) {
            source += "\n";
          }
          source += `  /* ${rule.name} */
`;
          source += `  this.rules[${ruleIndex}].opcodes = [];
`;
          rule.opcodes.forEach((op, opIndex) => {
            let prefix;
            switch (op.type) {
              case id.ALT:
                source += `  this.rules[${ruleIndex}].opcodes[${opIndex}] = {type: ${op.type}, children: [${op.children.toString()}]};// ALT
`;
                break;
              case id.CAT:
                source += `  this.rules[${ruleIndex}].opcodes[${opIndex}] = {type: ${op.type}, children: [${op.children.toString()}]};// CAT
`;
                break;
              case id.RNM:
                source += `  this.rules[${ruleIndex}].opcodes[${opIndex}] = {type: ${op.type}, index: ${op.index}};// RNM(${rules[op.index].name})
`;
                break;
              case id.BKR:
                if (op.index >= rules.length) {
                  bkrname = udts[op.index - rules.length].name;
                  bkrlower = udts[op.index - rules.length].lower;
                } else {
                  bkrname = rules[op.index].name;
                  bkrlower = rules[op.index].lower;
                }
                prefix = "%i";
                if (op.bkrCase === id.BKR_MODE_CS) {
                  prefix = "%s";
                }
                if (op.bkrMode === id.BKR_MODE_UM) {
                  prefix += "%u";
                } else {
                  prefix += "%p";
                }
                bkrname = prefix + bkrname;
                source += `  this.rules[${ruleIndex}].opcodes[${opIndex}] = {type: ${op.type}, index: ${op.index}, lower: '${bkrlower}', bkrCase: ${op.bkrCase}, bkrMode: ${op.bkrMode}};// BKR(\\${bkrname})
`;
                break;
              case id.UDT:
                source += `  this.rules[${ruleIndex}].opcodes[${opIndex}] = {type: ${op.type}, empty: ${op.empty}, index: ${op.index}};// UDT(${udts[op.index].name})
`;
                break;
              case id.REP:
                source += `  this.rules[${ruleIndex}].opcodes[${opIndex}] = {type: ${op.type}, min: ${op.min}, max: ${op.max}};// REP
`;
                break;
              case id.AND:
                source += `  this.rules[${ruleIndex}].opcodes[${opIndex}] = {type: ${op.type}};// AND
`;
                break;
              case id.NOT:
                source += `  this.rules[${ruleIndex}].opcodes[${opIndex}] = {type: ${op.type}};// NOT
`;
                break;
              case id.ABG:
                source += `  this.rules[${ruleIndex}].opcodes[${opIndex}] = {type: ${op.type}};// ABG(%^)
`;
                break;
              case id.AEN:
                source += `  this.rules[${ruleIndex}].opcodes[${opIndex}] = {type: ${op.type}};// AEN(%$)
`;
                break;
              case id.BKA:
                source += `  this.rules[${ruleIndex}].opcodes[${opIndex}] = {type: ${op.type}};// BKA
`;
                break;
              case id.BKN:
                source += `  this.rules[${ruleIndex}].opcodes[${opIndex}] = {type: ${op.type}};// BKN
`;
                break;
              case id.TLS:
                source += `  this.rules[${ruleIndex}].opcodes[${opIndex}] = {type: ${op.type}, string: [${op.string.toString()}]};// TLS
`;
                break;
              case id.TBS:
                source += `  this.rules[${ruleIndex}].opcodes[${opIndex}] = {type: ${op.type}, string: [${op.string.toString()}]};// TBS
`;
                break;
              case id.TRG:
                source += `  this.rules[${ruleIndex}].opcodes[${opIndex}] = {type: ${op.type}, min: ${op.min}, max: ${op.max}};// TRG
`;
                break;
              default:
                throw new Error("parser.js: ~143: unrecognized opcode");
            }
          });
        });
        source += "\n";
        source += "  // The `toString()` function will display the original grammar file(s) that produced these opcodes.\n";
        source += "  this.toString = function toString(){\n";
        source += '    let str = "";\n';
        let str;
        lines.forEach((line) => {
          const end = line.beginChar + line.length;
          str = "";
          source += '    str += "';
          for (let ii = line.beginChar; ii < end; ii += 1) {
            switch (chars[ii]) {
              case 9:
                str = " ";
                break;
              case 10:
                str = "\\n";
                break;
              case 13:
                str = "\\r";
                break;
              case 34:
                str = '\\"';
                break;
              case 92:
                str = "\\\\";
                break;
              default:
                str = String.fromCharCode(chars[ii]);
                break;
            }
            source += str;
          }
          source += '";\n';
        });
        source += "    return str;\n";
        source += "  }\n";
        source += "}\n";
        return source;
      };
      this.generateObject = function generateObject(stringArg, rules, udts) {
        const obj = {};
        const ruleNames = [];
        const udtNames = [];
        const string = stringArg.slice(0);
        obj.grammarObject = "grammarObject";
        rules.forEach((rule) => {
          ruleNames.push(rule.lower);
        });
        ruleNames.sort();
        if (udts.length > 0) {
          udts.forEach((udtFunc) => {
            udtNames.push(udtFunc.lower);
          });
          udtNames.sort();
        }
        obj.callbacks = [];
        ruleNames.forEach((name) => {
          obj.callbacks[name] = false;
        });
        if (udts.length > 0) {
          udtNames.forEach((name) => {
            obj.callbacks[name] = false;
          });
        }
        obj.rules = rules;
        obj.udts = udts;
        obj.toString = function toStringFunc() {
          return string;
        };
        return obj;
      };
    };
  }
});

// ../../node_modules/apg-js/src/apg-api/rule-attributes.js
var require_rule_attributes = __commonJS({
  "../../node_modules/apg-js/src/apg-api/rule-attributes.js"(exports, module2) {
    init_esbuild_shims();
    module2.exports = function exportRuleAttributes() {
      const id = require_identifiers();
      const thisFile = "rule-attributes.js";
      let state = null;
      function isEmptyOnly(attr) {
        if (attr.left || attr.nested || attr.right || attr.cyclic) {
          return false;
        }
        return attr.empty;
      }
      function isRecursive(attr) {
        if (attr.left || attr.nested || attr.right || attr.cyclic) {
          return true;
        }
        return false;
      }
      function isCatNested(attrs, count) {
        let i = 0;
        let j = 0;
        let k = 0;
        for (i = 0; i < count; i += 1) {
          if (attrs[i].nested) {
            return true;
          }
        }
        for (i = 0; i < count; i += 1) {
          if (attrs[i].right && !attrs[i].leaf) {
            for (j = i + 1; j < count; j += 1) {
              if (!isEmptyOnly(attrs[j])) {
                return true;
              }
            }
          }
        }
        for (i = count - 1; i >= 0; i -= 1) {
          if (attrs[i].left && !attrs[i].leaf) {
            for (j = i - 1; j >= 0; j -= 1) {
              if (!isEmptyOnly(attrs[j])) {
                return true;
              }
            }
          }
        }
        for (i = 0; i < count; i += 1) {
          if (!attrs[i].empty && !isRecursive(attrs[i])) {
            for (j = i + 1; j < count; j += 1) {
              if (isRecursive(attrs[j])) {
                for (k = j + 1; k < count; k += 1) {
                  if (!attrs[k].empty && !isRecursive(attrs[k])) {
                    return true;
                  }
                }
              }
            }
          }
        }
        return false;
      }
      function isCatCyclic(attrs, count) {
        for (let i = 0; i < count; i += 1) {
          if (!attrs[i].cyclic) {
            return false;
          }
        }
        return true;
      }
      function isCatLeft(attrs, count) {
        for (let i = 0; i < count; i += 1) {
          if (attrs[i].left) {
            return true;
          }
          if (!attrs[i].empty) {
            return false;
          }
        }
        return false;
      }
      function isCatRight(attrs, count) {
        for (let i = count - 1; i >= 0; i -= 1) {
          if (attrs[i].right) {
            return true;
          }
          if (!attrs[i].empty) {
            return false;
          }
        }
        return false;
      }
      function isCatEmpty(attrs, count) {
        for (let i = 0; i < count; i += 1) {
          if (!attrs[i].empty) {
            return false;
          }
        }
        return true;
      }
      function isCatFinite(attrs, count) {
        for (let i = 0; i < count; i += 1) {
          if (!attrs[i].finite) {
            return false;
          }
        }
        return true;
      }
      function cat(stateArg, opcodes, opIndex, iAttr) {
        let i = 0;
        const opCat = opcodes[opIndex];
        const count = opCat.children.length;
        const childAttrs = [];
        for (i = 0; i < count; i += 1) {
          childAttrs.push(stateArg.attrGen());
        }
        for (i = 0; i < count; i += 1) {
          opEval(stateArg, opcodes, opCat.children[i], childAttrs[i]);
        }
        iAttr.left = isCatLeft(childAttrs, count);
        iAttr.right = isCatRight(childAttrs, count);
        iAttr.nested = isCatNested(childAttrs, count);
        iAttr.empty = isCatEmpty(childAttrs, count);
        iAttr.finite = isCatFinite(childAttrs, count);
        iAttr.cyclic = isCatCyclic(childAttrs, count);
      }
      function alt(stateArg, opcodes, opIndex, iAttr) {
        let i = 0;
        const opAlt = opcodes[opIndex];
        const count = opAlt.children.length;
        const childAttrs = [];
        for (i = 0; i < count; i += 1) {
          childAttrs.push(stateArg.attrGen());
        }
        for (i = 0; i < count; i += 1) {
          opEval(stateArg, opcodes, opAlt.children[i], childAttrs[i]);
        }
        iAttr.left = false;
        iAttr.right = false;
        iAttr.nested = false;
        iAttr.empty = false;
        iAttr.finite = false;
        iAttr.cyclic = false;
        for (i = 0; i < count; i += 1) {
          if (childAttrs[i].left) {
            iAttr.left = true;
          }
          if (childAttrs[i].nested) {
            iAttr.nested = true;
          }
          if (childAttrs[i].right) {
            iAttr.right = true;
          }
          if (childAttrs[i].empty) {
            iAttr.empty = true;
          }
          if (childAttrs[i].finite) {
            iAttr.finite = true;
          }
          if (childAttrs[i].cyclic) {
            iAttr.cyclic = true;
          }
        }
      }
      function bkr(stateArg, opcodes, opIndex, iAttr) {
        const opBkr = opcodes[opIndex];
        if (opBkr.index >= stateArg.ruleCount) {
          iAttr.empty = stateArg.udts[opBkr.index - stateArg.ruleCount].empty;
          iAttr.finite = true;
        } else {
          ruleAttrsEval(stateArg, opBkr.index, iAttr);
          iAttr.left = false;
          iAttr.nested = false;
          iAttr.right = false;
          iAttr.cyclic = false;
        }
      }
      function opEval(stateArg, opcodes, opIndex, iAttr) {
        stateArg.attrInit(iAttr);
        const opi = opcodes[opIndex];
        switch (opi.type) {
          case id.ALT:
            alt(stateArg, opcodes, opIndex, iAttr);
            break;
          case id.CAT:
            cat(stateArg, opcodes, opIndex, iAttr);
            break;
          case id.REP:
            opEval(stateArg, opcodes, opIndex + 1, iAttr);
            if (opi.min === 0) {
              iAttr.empty = true;
              iAttr.finite = true;
            }
            break;
          case id.RNM:
            ruleAttrsEval(stateArg, opcodes[opIndex].index, iAttr);
            break;
          case id.BKR:
            bkr(stateArg, opcodes, opIndex, iAttr);
            break;
          case id.AND:
          case id.NOT:
          case id.BKA:
          case id.BKN:
            opEval(stateArg, opcodes, opIndex + 1, iAttr);
            iAttr.empty = true;
            break;
          case id.TLS:
            iAttr.empty = !opcodes[opIndex].string.length;
            iAttr.finite = true;
            iAttr.cyclic = false;
            break;
          case id.TBS:
          case id.TRG:
            iAttr.empty = false;
            iAttr.finite = true;
            iAttr.cyclic = false;
            break;
          case id.UDT:
            iAttr.empty = opi.empty;
            iAttr.finite = true;
            iAttr.cyclic = false;
            break;
          case id.ABG:
          case id.AEN:
            iAttr.empty = true;
            iAttr.finite = true;
            iAttr.cyclic = false;
            break;
          default:
            throw new Error(`unknown opcode type: ${opi}`);
        }
      }
      function ruleAttrsEval(stateArg, ruleIndex, iAttr) {
        const attri = stateArg.attrsWorking[ruleIndex];
        if (attri.isComplete) {
          stateArg.attrCopy(iAttr, attri);
        } else if (!attri.isOpen) {
          attri.isOpen = true;
          opEval(stateArg, attri.rule.opcodes, 0, iAttr);
          attri.left = iAttr.left;
          attri.right = iAttr.right;
          attri.nested = iAttr.nested;
          attri.empty = iAttr.empty;
          attri.finite = iAttr.finite;
          attri.cyclic = iAttr.cyclic;
          attri.leaf = false;
          attri.isOpen = false;
          attri.isComplete = true;
        } else if (ruleIndex === stateArg.startRule) {
          if (ruleIndex === stateArg.startRule) {
            iAttr.left = true;
            iAttr.right = true;
            iAttr.cyclic = true;
            iAttr.leaf = true;
          }
        } else {
          iAttr.finite = true;
        }
      }
      const ruleAttributes = (stateArg) => {
        state = stateArg;
        let i = 0;
        let j = 0;
        const iAttr = state.attrGen();
        for (i = 0; i < state.ruleCount; i += 1) {
          for (j = 0; j < state.ruleCount; j += 1) {
            state.attrInit(state.attrsWorking[j]);
          }
          state.startRule = i;
          ruleAttrsEval(state, i, iAttr);
          state.attrCopy(state.attrs[i], state.attrsWorking[i]);
        }
        state.attributesComplete = true;
        let attri = null;
        for (i = 0; i < state.ruleCount; i += 1) {
          attri = state.attrs[i];
          if (attri.left || !attri.finite || attri.cyclic) {
            const temp = state.attrGen(attri.rule);
            state.attrCopy(temp, attri);
            state.attrsErrors.push(temp);
            state.attrsErrorCount += 1;
          }
        }
      };
      const truth = (val) => val ? "t" : "f";
      const tError = (val) => val ? "e" : "f";
      const fError = (val) => val ? "t" : "e";
      const showAttr = (seq, index, attr, dep) => {
        let str = `${seq}:${index}:`;
        str += `${tError(attr.left)} `;
        str += `${truth(attr.nested)} `;
        str += `${truth(attr.right)} `;
        str += `${tError(attr.cyclic)} `;
        str += `${fError(attr.finite)} `;
        str += `${truth(attr.empty)}:`;
        str += `${state.typeToString(dep.recursiveType)}:`;
        str += dep.recursiveType === id.ATTR_MR ? dep.groupNumber : "-";
        str += `:${attr.rule.name}
`;
        return str;
      };
      const showLegend = () => {
        let str = "LEGEND - t=true, f=false, e=error\n";
        str += "sequence:rule index:left nested right cyclic finite empty:type:group number:rule name\n";
        return str;
      };
      const showAttributeErrors = () => {
        let attri = null;
        let depi = null;
        let str = "";
        str += "RULE ATTRIBUTES WITH ERRORS\n";
        str += showLegend();
        if (state.attrsErrorCount) {
          for (let i = 0; i < state.attrsErrorCount; i += 1) {
            attri = state.attrsErrors[i];
            depi = state.ruleDeps[attri.rule.index];
            str += showAttr(i, attri.rule.index, attri, depi);
          }
        } else {
          str += "<none>\n";
        }
        return str;
      };
      const show = (type) => {
        let i = 0;
        let ii = 0;
        let attri = null;
        let depi = null;
        let str = "";
        let { ruleIndexes } = state;
        if (type === 97) {
          ruleIndexes = state.ruleAlphaIndexes;
        } else if (type === 116) {
          ruleIndexes = state.ruleTypeIndexes;
        }
        for (i = 0; i < state.ruleCount; i += 1) {
          ii = ruleIndexes[i];
          attri = state.attrs[ii];
          depi = state.ruleDeps[ii];
          str += showAttr(i, ii, attri, depi);
        }
        return str;
      };
      const showAttributes = (order = "index") => {
        if (!state.attributesComplete) {
          throw new Error(`${thisFile}:showAttributes: attributes not available`);
        }
        let str = "";
        const leader = "RULE ATTRIBUTES\n";
        if (order.charCodeAt(0) === 97) {
          str += "alphabetical by rule name\n";
          str += leader;
          str += showLegend();
          str += show(97);
        } else if (order.charCodeAt(0) === 116) {
          str += "ordered by rule type\n";
          str += leader;
          str += showLegend();
          str += show(116);
        } else {
          str += "ordered by rule index\n";
          str += leader;
          str += showLegend();
          str += show();
        }
        return str;
      };
      return { ruleAttributes, showAttributes, showAttributeErrors };
    }();
  }
});

// ../../node_modules/apg-js/src/apg-api/rule-dependencies.js
var require_rule_dependencies = __commonJS({
  "../../node_modules/apg-js/src/apg-api/rule-dependencies.js"(exports, module2) {
    init_esbuild_shims();
    module2.exports = (() => {
      const id = require_identifiers();
      let state = null;
      const scan = (ruleCount, ruleDeps, index, isScanned) => {
        let i = 0;
        let j = 0;
        const rdi = ruleDeps[index];
        isScanned[index] = true;
        const op = rdi.rule.opcodes;
        for (i = 0; i < op.length; i += 1) {
          const opi = op[i];
          if (opi.type === id.RNM) {
            rdi.refersTo[opi.index] = true;
            if (!isScanned[opi.index]) {
              scan(ruleCount, ruleDeps, opi.index, isScanned);
            }
            for (j = 0; j < ruleCount; j += 1) {
              if (ruleDeps[opi.index].refersTo[j]) {
                rdi.refersTo[j] = true;
              }
            }
          } else if (opi.type === id.UDT) {
            rdi.refersToUdt[opi.index] = true;
          } else if (opi.type === id.BKR) {
            if (opi.index < ruleCount) {
              rdi.refersTo[opi.index] = true;
              if (!isScanned[opi.index]) {
                scan(ruleCount, ruleDeps, opi.index, isScanned);
              }
            } else {
              rdi.refersToUdt[ruleCount - opi.index] = true;
            }
          }
        }
      };
      const ruleDependencies = (stateArg) => {
        state = stateArg;
        let i = 0;
        let j = 0;
        let groupCount = 0;
        let rdi = null;
        let rdj = null;
        let newGroup = false;
        state.dependenciesComplete = false;
        const isScanned = state.falseArray(state.ruleCount);
        for (i = 0; i < state.ruleCount; i += 1) {
          state.falsifyArray(isScanned);
          scan(state.ruleCount, state.ruleDeps, i, isScanned);
        }
        for (i = 0; i < state.ruleCount; i += 1) {
          for (j = 0; j < state.ruleCount; j += 1) {
            if (i !== j) {
              if (state.ruleDeps[j].refersTo[i]) {
                state.ruleDeps[i].referencedBy[j] = true;
              }
            }
          }
        }
        for (i = 0; i < state.ruleCount; i += 1) {
          state.ruleDeps[i].recursiveType = id.ATTR_N;
          if (state.ruleDeps[i].refersTo[i]) {
            state.ruleDeps[i].recursiveType = id.ATTR_R;
          }
        }
        groupCount = -1;
        for (i = 0; i < state.ruleCount; i += 1) {
          rdi = state.ruleDeps[i];
          if (rdi.recursiveType === id.ATTR_R) {
            newGroup = true;
            for (j = 0; j < state.ruleCount; j += 1) {
              if (i !== j) {
                rdj = state.ruleDeps[j];
                if (rdj.recursiveType === id.ATTR_R) {
                  if (rdi.refersTo[j] && rdj.refersTo[i]) {
                    if (newGroup) {
                      groupCount += 1;
                      rdi.recursiveType = id.ATTR_MR;
                      rdi.groupNumber = groupCount;
                      newGroup = false;
                    }
                    rdj.recursiveType = id.ATTR_MR;
                    rdj.groupNumber = groupCount;
                  }
                }
              }
            }
          }
        }
        state.isMutuallyRecursive = groupCount > -1;
        state.ruleAlphaIndexes.sort(state.compRulesAlpha);
        state.ruleTypeIndexes.sort(state.compRulesAlpha);
        state.ruleTypeIndexes.sort(state.compRulesType);
        if (state.isMutuallyRecursive) {
          state.ruleTypeIndexes.sort(state.compRulesGroup);
        }
        if (state.udtCount) {
          state.udtAlphaIndexes.sort(state.compUdtsAlpha);
        }
        state.dependenciesComplete = true;
      };
      const show = (type = null) => {
        let i = 0;
        let j = 0;
        let count = 0;
        let startSeg = 0;
        const maxRule = state.ruleCount - 1;
        const maxUdt = state.udtCount - 1;
        const lineLength = 100;
        let str = "";
        let pre = "";
        const toArrow = "=> ";
        const byArrow = "<= ";
        let first = false;
        let rdi = null;
        let { ruleIndexes } = state;
        let { udtIndexes } = state;
        if (type === 97) {
          ruleIndexes = state.ruleAlphaIndexes;
          udtIndexes = state.udtAlphaIndexes;
        } else if (type === 116) {
          ruleIndexes = state.ruleTypeIndexes;
          udtIndexes = state.udtAlphaIndexes;
        }
        for (i = 0; i < state.ruleCount; i += 1) {
          rdi = state.ruleDeps[ruleIndexes[i]];
          pre = `${ruleIndexes[i]}:${state.typeToString(rdi.recursiveType)}:`;
          if (state.isMutuallyRecursive) {
            pre += rdi.groupNumber > -1 ? rdi.groupNumber : "-";
            pre += ":";
          }
          pre += " ";
          str += `${pre + state.rules[ruleIndexes[i]].name}
`;
          first = true;
          count = 0;
          startSeg = str.length;
          str += pre;
          for (j = 0; j < state.ruleCount; j += 1) {
            if (rdi.refersTo[ruleIndexes[j]]) {
              if (first) {
                str += toArrow;
                first = false;
                str += state.ruleDeps[ruleIndexes[j]].rule.name;
              } else {
                str += `, ${state.ruleDeps[ruleIndexes[j]].rule.name}`;
              }
              count += 1;
            }
            if (str.length - startSeg > lineLength && j !== maxRule) {
              str += `
${pre}${toArrow}`;
              startSeg = str.length;
            }
          }
          if (state.udtCount) {
            for (j = 0; j < state.udtCount; j += 1) {
              if (rdi.refersToUdt[udtIndexes[j]]) {
                if (first) {
                  str += toArrow;
                  first = false;
                  str += state.udts[udtIndexes[j]].name;
                } else {
                  str += `, ${state.udts[udtIndexes[j]].name}`;
                }
                count += 1;
              }
              if (str.length - startSeg > lineLength && j !== maxUdt) {
                str += `
${pre}${toArrow}`;
                startSeg = str.length;
              }
            }
          }
          if (count === 0) {
            str += "=> <none>\n";
          }
          if (first === false) {
            str += "\n";
          }
          first = true;
          count = 0;
          startSeg = str.length;
          str += pre;
          for (j = 0; j < state.ruleCount; j += 1) {
            if (rdi.referencedBy[ruleIndexes[j]]) {
              if (first) {
                str += byArrow;
                first = false;
                str += state.ruleDeps[ruleIndexes[j]].rule.name;
              } else {
                str += `, ${state.ruleDeps[ruleIndexes[j]].rule.name}`;
              }
              count += 1;
            }
            if (str.length - startSeg > lineLength && j !== maxRule) {
              str += `
${pre}${toArrow}`;
              startSeg = str.length;
            }
          }
          if (count === 0) {
            str += "<= <none>\n";
          }
          if (first === false) {
            str += "\n";
          }
          str += "\n";
        }
        return str;
      };
      const showRuleDependencies = (order = "index") => {
        let str = "RULE DEPENDENCIES(index:type:[group number:])\n";
        str += "=> refers to rule names\n";
        str += "<= referenced by rule names\n";
        if (!state.dependenciesComplete) {
          return str;
        }
        if (order.charCodeAt(0) === 97) {
          str += "alphabetical by rule name\n";
          str += show(97);
        } else if (order.charCodeAt(0) === 116) {
          str += "ordered by rule type\n";
          str += show(116);
        } else {
          str += "ordered by rule index\n";
          str += show(null);
        }
        return str;
      };
      return { ruleDependencies, showRuleDependencies };
    })();
  }
});

// ../../node_modules/apg-js/src/apg-api/attributes.js
var require_attributes = __commonJS({
  "../../node_modules/apg-js/src/apg-api/attributes.js"(exports, module2) {
    init_esbuild_shims();
    module2.exports = function exportAttributes() {
      const id = require_identifiers();
      const { ruleAttributes, showAttributes, showAttributeErrors } = require_rule_attributes();
      const { ruleDependencies, showRuleDependencies } = require_rule_dependencies();
      class State {
        constructor(rules, udts) {
          this.rules = rules;
          this.udts = udts;
          this.ruleCount = rules.length;
          this.udtCount = udts.length;
          this.startRule = 0;
          this.dependenciesComplete = false;
          this.attributesComplete = false;
          this.isMutuallyRecursive = false;
          this.ruleIndexes = this.indexArray(this.ruleCount);
          this.ruleAlphaIndexes = this.indexArray(this.ruleCount);
          this.ruleTypeIndexes = this.indexArray(this.ruleCount);
          this.udtIndexes = this.indexArray(this.udtCount);
          this.udtAlphaIndexes = this.indexArray(this.udtCount);
          this.attrsErrorCount = 0;
          this.attrs = [];
          this.attrsErrors = [];
          this.attrsWorking = [];
          this.ruleDeps = [];
          for (let i = 0; i < this.ruleCount; i += 1) {
            this.attrs.push(this.attrGen(this.rules[i]));
            this.attrsWorking.push(this.attrGen(this.rules[i]));
            this.ruleDeps.push(this.rdGen(rules[i], this.ruleCount, this.udtCount));
          }
          this.compRulesAlpha = this.compRulesAlpha.bind(this);
          this.compUdtsAlpha = this.compUdtsAlpha.bind(this);
          this.compRulesType = this.compRulesType.bind(this);
          this.compRulesGroup = this.compRulesGroup.bind(this);
        }
        attrGen(rule) {
          return {
            left: false,
            nested: false,
            right: false,
            empty: false,
            finite: false,
            cyclic: false,
            leaf: false,
            isOpen: false,
            isComplete: false,
            rule
          };
        }
        attrInit(attr) {
          attr.left = false;
          attr.nested = false;
          attr.right = false;
          attr.empty = false;
          attr.finite = false;
          attr.cyclic = false;
          attr.leaf = false;
          attr.isOpen = false;
          attr.isComplete = false;
        }
        attrCopy(dst, src) {
          dst.left = src.left;
          dst.nested = src.nested;
          dst.right = src.right;
          dst.empty = src.empty;
          dst.finite = src.finite;
          dst.cyclic = src.cyclic;
          dst.leaf = src.leaf;
          dst.isOpen = src.isOpen;
          dst.isComplete = src.isComplete;
          dst.rule = src.rule;
        }
        rdGen(rule, ruleCount, udtCount) {
          const ret = {
            rule,
            recursiveType: id.ATTR_N,
            groupNumber: -1,
            refersTo: this.falseArray(ruleCount),
            refersToUdt: this.falseArray(udtCount),
            referencedBy: this.falseArray(ruleCount)
          };
          return ret;
        }
        typeToString(recursiveType) {
          switch (recursiveType) {
            case id.ATTR_N:
              return " N";
            case id.ATTR_R:
              return " R";
            case id.ATTR_MR:
              return "MR";
            default:
              return "UNKNOWN";
          }
        }
        falseArray(length) {
          const ret = [];
          if (length > 0) {
            for (let i = 0; i < length; i += 1) {
              ret.push(false);
            }
          }
          return ret;
        }
        falsifyArray(a) {
          for (let i = 0; i < a.length; i += 1) {
            a[i] = false;
          }
        }
        indexArray(length) {
          const ret = [];
          if (length > 0) {
            for (let i = 0; i < length; i += 1) {
              ret.push(i);
            }
          }
          return ret;
        }
        compRulesAlpha(left, right) {
          if (this.rules[left].lower < this.rules[right].lower) {
            return -1;
          }
          if (this.rules[left].lower > this.rules[right].lower) {
            return 1;
          }
          return 0;
        }
        compUdtsAlpha(left, right) {
          if (this.udts[left].lower < this.udts[right].lower) {
            return -1;
          }
          if (this.udts[left].lower > this.udts[right].lower) {
            return 1;
          }
          return 0;
        }
        compRulesType(left, right) {
          if (this.ruleDeps[left].recursiveType < this.ruleDeps[right].recursiveType) {
            return -1;
          }
          if (this.ruleDeps[left].recursiveType > this.ruleDeps[right].recursiveType) {
            return 1;
          }
          return 0;
        }
        compRulesGroup(left, right) {
          if (this.ruleDeps[left].recursiveType === id.ATTR_MR && this.ruleDeps[right].recursiveType === id.ATTR_MR) {
            if (this.ruleDeps[left].groupNumber < this.ruleDeps[right].groupNumber) {
              return -1;
            }
            if (this.ruleDeps[left].groupNumber > this.ruleDeps[right].groupNumber) {
              return 1;
            }
          }
          return 0;
        }
      }
      const attributes = function attributes2(rules = [], udts = [], lineMap = [], errors = []) {
        const state = new State(rules, udts);
        ruleDependencies(state);
        ruleAttributes(state);
        if (state.attrsErrorCount) {
          errors.push({ line: 0, char: 0, msg: `${state.attrsErrorCount} attribute errors` });
        }
        return state.attrsErrorCount;
      };
      return { attributes, showAttributes, showAttributeErrors, showRuleDependencies };
    }();
  }
});

// ../../node_modules/apg-js/src/apg-api/show-rules.js
var require_show_rules = __commonJS({
  "../../node_modules/apg-js/src/apg-api/show-rules.js"(exports, module2) {
    init_esbuild_shims();
    module2.exports = function exports2() {
      const thisFileName = "show-rules.js";
      const showRules = function showRules2(rulesIn = [], udtsIn = [], order = "index") {
        const thisFuncName = "showRules";
        let alphaArray = [];
        let udtAlphaArray = [];
        const indexArray = [];
        const udtIndexArray = [];
        const rules = rulesIn;
        const udts = udtsIn;
        const ruleCount = rulesIn.length;
        const udtCount = udtsIn.length;
        let str = "RULE/UDT NAMES";
        let i;
        function compRulesAlpha(left, right) {
          if (rules[left].lower < rules[right].lower) {
            return -1;
          }
          if (rules[left].lower > rules[right].lower) {
            return 1;
          }
          return 0;
        }
        function compUdtsAlpha(left, right) {
          if (udts[left].lower < udts[right].lower) {
            return -1;
          }
          if (udts[left].lower > udts[right].lower) {
            return 1;
          }
          return 0;
        }
        if (!(Array.isArray(rulesIn) && rulesIn.length)) {
          throw new Error(`${thisFileName}:${thisFuncName}: rules arg must be array with length > 0`);
        }
        if (!Array.isArray(udtsIn)) {
          throw new Error(`${thisFileName}:${thisFuncName}: udts arg must be array`);
        }
        for (i = 0; i < ruleCount; i += 1) {
          indexArray.push(i);
        }
        alphaArray = indexArray.slice(0);
        alphaArray.sort(compRulesAlpha);
        if (udtCount) {
          for (i = 0; i < udtCount; i += 1) {
            udtIndexArray.push(i);
          }
          udtAlphaArray = udtIndexArray.slice(0);
          udtAlphaArray.sort(compUdtsAlpha);
        }
        if (order.charCodeAt(0) === 97) {
          str += " - alphabetical by rule/UDT name\n";
          for (i = 0; i < ruleCount; i += 1) {
            str += `${i}: ${alphaArray[i]}: ${rules[alphaArray[i]].name}
`;
          }
          if (udtCount) {
            for (i = 0; i < udtCount; i += 1) {
              str += `${i}: ${udtAlphaArray[i]}: ${udts[udtAlphaArray[i]].name}
`;
            }
          }
        } else {
          str += " - ordered by rule/UDT index\n";
          for (i = 0; i < ruleCount; i += 1) {
            str += `${i}: ${rules[i].name}
`;
          }
          if (udtCount) {
            for (i = 0; i < udtCount; i += 1) {
              str += `${i}: ${udts[i].name}
`;
            }
          }
        }
        return str;
      };
      return showRules;
    }();
  }
});

// ../../node_modules/apg-js/src/apg-api/api.js
var require_api = __commonJS({
  "../../node_modules/apg-js/src/apg-api/api.js"(exports, module2) {
    init_esbuild_shims();
    module2.exports = function api(src) {
      const thisFileName = "api.js: ";
      const thisObject = this;
      const apglib = require_node_exports();
      const converter = require_converter();
      const scanner = require_scanner();
      const parser = new (require_parser2())();
      const { attributes, showAttributes, showAttributeErrors, showRuleDependencies } = require_attributes();
      const showRules = require_show_rules();
      const abnfToHtml = function abnfToHtml2(chars, beg, len) {
        const NORMAL = 0;
        const CONTROL = 1;
        const INVALID = 2;
        const CONTROL_BEG = `<span class="${apglib.style.CLASS_CTRLCHAR}">`;
        const CONTROL_END = "</span>";
        const INVALID_BEG = `<span class="${apglib.style.CLASS_NOMATCH}">`;
        const INVALID_END = "</span>";
        let end;
        let html = "";
        const TRUE = true;
        while (TRUE) {
          if (!Array.isArray(chars) || chars.length === 0) {
            break;
          }
          if (typeof beg !== "number") {
            throw new Error("abnfToHtml: beg must be type number");
          }
          if (beg >= chars.length) {
            break;
          }
          if (typeof len !== "number" || beg + len >= chars.length) {
            end = chars.length;
          } else {
            end = beg + len;
          }
          let state = NORMAL;
          for (let i = beg; i < end; i += 1) {
            const ch = chars[i];
            if (ch >= 32 && ch <= 126) {
              if (state === CONTROL) {
                html += CONTROL_END;
                state = NORMAL;
              } else if (state === INVALID) {
                html += INVALID_END;
                state = NORMAL;
              }
              switch (ch) {
                case 32:
                  html += "&nbsp;";
                  break;
                case 60:
                  html += "&lt;";
                  break;
                case 62:
                  html += "&gt;";
                  break;
                case 38:
                  html += "&amp;";
                  break;
                case 34:
                  html += "&quot;";
                  break;
                case 39:
                  html += "&#039;";
                  break;
                case 92:
                  html += "&#092;";
                  break;
                default:
                  html += String.fromCharCode(ch);
                  break;
              }
            } else if (ch === 9 || ch === 10 || ch === 13) {
              if (state === NORMAL) {
                html += CONTROL_BEG;
                state = CONTROL;
              } else if (state === INVALID) {
                html += INVALID_END + CONTROL_BEG;
                state = CONTROL;
              }
              if (ch === 9) {
                html += "TAB";
              }
              if (ch === 10) {
                html += "LF";
              }
              if (ch === 13) {
                html += "CR";
              }
            } else {
              if (state === NORMAL) {
                html += INVALID_BEG;
                state = INVALID;
              } else if (state === CONTROL) {
                html += CONTROL_END + INVALID_BEG;
                state = INVALID;
              }
              html += `\\x${apglib.utils.charToHex(ch)}`;
            }
          }
          if (state === INVALID) {
            html += INVALID_END;
          }
          if (state === CONTROL) {
            html += CONTROL_END;
          }
          break;
        }
        return html;
      };
      const abnfToAscii = function abnfToAscii2(chars, beg, len) {
        let str = "";
        for (let i = beg; i < beg + len; i += 1) {
          const ch = chars[i];
          if (ch >= 32 && ch <= 126) {
            str += String.fromCharCode(ch);
          } else {
            switch (ch) {
              case 9:
                str += "\\t";
                break;
              case 10:
                str += "\\n";
                break;
              case 13:
                str += "\\r";
                break;
              default:
                str += "\\unknown";
                break;
            }
          }
        }
        return str;
      };
      const linesToAscii = function linesToAscii2(lines) {
        let str = "Annotated Input Grammar";
        lines.forEach((val) => {
          str += "\n";
          str += `line no: ${val.lineNo}`;
          str += ` : char index: ${val.beginChar}`;
          str += ` : length: ${val.length}`;
          str += ` : abnf: ${abnfToAscii(thisObject.chars, val.beginChar, val.length)}`;
        });
        str += "\n";
        return str;
      };
      const linesToHtml = function linesToHtml2(lines) {
        let html = "";
        html += `<table class="${apglib.style.CLASS_GRAMMAR}">
`;
        const title = "Annotated Input Grammar";
        html += `<caption>${title}</caption>
`;
        html += "<tr>";
        html += "<th>line<br>no.</th><th>first<br>char</th><th><br>length</th><th><br>text</th>";
        html += "</tr>\n";
        lines.forEach((val) => {
          html += "<tr>";
          html += `<td>${val.lineNo}`;
          html += `</td><td>${val.beginChar}`;
          html += `</td><td>${val.length}`;
          html += `</td><td>${abnfToHtml(thisObject.chars, val.beginChar, val.length)}`;
          html += "</td>";
          html += "</tr>\n";
        });
        html += "</table>\n";
        return html;
      };
      const errorsToHtml = function errorsToHtml2(errors, lines, chars, title) {
        const [style] = apglib;
        let html = "";
        const errorArrow = `<span class="${style.CLASS_NOMATCH}">&raquo;</span>`;
        html += `<p><table class="${style.CLASS_GRAMMAR}">
`;
        if (title && typeof title === "string") {
          html += `<caption>${title}</caption>
`;
        }
        html += "<tr><th>line<br>no.</th><th>line<br>offset</th><th>error<br>offset</th><th><br>text</th></tr>\n";
        errors.forEach((val) => {
          let line;
          let relchar;
          let beg;
          let end;
          let text;
          let prefix = "";
          let suffix = "";
          if (lines.length === 0) {
            text = errorArrow;
            relchar = 0;
          } else {
            line = lines[val.line];
            beg = line.beginChar;
            if (val.char > beg) {
              prefix = abnfToHtml(chars, beg, val.char - beg);
            }
            beg = val.char;
            end = line.beginChar + line.length;
            if (beg < end) {
              suffix = abnfToHtml(chars, beg, end - beg);
            }
            text = prefix + errorArrow + suffix;
            relchar = val.char - line.beginChar;
            html += "<tr>";
            html += `<td>${val.line}</td><td>${line.beginChar}</td><td>${relchar}</td><td>${text}</td>`;
            html += "</tr>\n";
            html += "<tr>";
            html += `<td colspan="3"></td><td>&uarr;:&nbsp;${apglib.utils.stringToAsciiHtml(val.msg)}</td>`;
            html += "</tr>\n";
          }
        });
        html += "</table></p>\n";
        return html;
      };
      const errorsToAscii = function errorsToAscii2(errors, lines, chars) {
        let str;
        let line;
        let beg;
        let len;
        str = "";
        errors.forEach((error) => {
          line = lines[error.line];
          str += `${line.lineNo}: `;
          str += `${line.beginChar}: `;
          str += `${error.char - line.beginChar}: `;
          beg = line.beginChar;
          len = error.char - line.beginChar;
          str += abnfToAscii(chars, beg, len);
          str += " >> ";
          beg = error.char;
          len = line.beginChar + line.length - error.char;
          str += abnfToAscii(chars, beg, len);
          str += "\n";
          str += `${line.lineNo}: `;
          str += `${line.beginChar}: `;
          str += `${error.char - line.beginChar}: `;
          str += "error: ";
          str += error.msg;
          str += "\n";
        });
        return str;
      };
      let isScanned = false;
      let isParsed = false;
      let isTranslated = false;
      let haveAttributes = false;
      let attributeErrors = 0;
      let lineMap;
      this.errors = [];
      if (Buffer.isBuffer(src)) {
        this.chars = converter.decode("BINARY", src);
      } else if (Array.isArray(src)) {
        this.chars = src.slice();
      } else if (typeof src === "string") {
        this.chars = converter.decode("STRING", src);
      } else {
        throw new Error(`${thisFileName}input source is not a string, byte Buffer or character array`);
      }
      this.sabnf = converter.encode("STRING", this.chars);
      this.scan = function scan(strict, trace) {
        this.lines = scanner(this.chars, this.errors, strict, trace);
        isScanned = true;
      };
      this.parse = function parse(strict, trace) {
        if (!isScanned) {
          throw new Error(`${thisFileName}grammar not scanned`);
        }
        parser.syntax(this.chars, this.lines, this.errors, strict, trace);
        isParsed = true;
      };
      this.translate = function translate() {
        if (!isParsed) {
          throw new Error(`${thisFileName}grammar not scanned and parsed`);
        }
        const ret = parser.semantic(this.chars, this.lines, this.errors);
        if (this.errors.length === 0) {
          this.rules = ret.rules;
          this.udts = ret.udts;
          lineMap = ret.lineMap;
          isTranslated = true;
        }
      };
      this.attributes = function attrs() {
        if (!isTranslated) {
          throw new Error(`${thisFileName}grammar not scanned, parsed and translated`);
        }
        attributeErrors = attributes(this.rules, this.udts, lineMap, this.errors);
        haveAttributes = true;
        return attributeErrors;
      };
      this.generate = function generate(strict) {
        this.lines = scanner(this.chars, this.errors, strict);
        if (this.errors.length) {
          return;
        }
        parser.syntax(this.chars, this.lines, this.errors, strict);
        if (this.errors.length) {
          return;
        }
        const ret = parser.semantic(this.chars, this.lines, this.errors);
        if (this.errors.length) {
          return;
        }
        this.rules = ret.rules;
        this.udts = ret.udts;
        lineMap = ret.lineMap;
        attributeErrors = attributes(this.rules, this.udts, lineMap, this.errors);
        haveAttributes = true;
      };
      this.displayRules = function displayRules(order = "index") {
        if (!isTranslated) {
          throw new Error(`${thisFileName}grammar not scanned, parsed and translated`);
        }
        return showRules(this.rules, this.udts, order);
      };
      this.displayRuleDependencies = function displayRuleDependencies(order = "index") {
        if (!haveAttributes) {
          throw new Error(`${thisFileName}no attributes - must be preceeded by call to attributes()`);
        }
        return showRuleDependencies(order);
      };
      this.displayAttributes = function displayAttributes(order = "index") {
        if (!haveAttributes) {
          throw new Error(`${thisFileName}no attributes - must be preceeded by call to attributes()`);
        }
        if (attributeErrors) {
          showAttributeErrors(order);
        }
        return showAttributes(order);
      };
      this.displayAttributeErrors = function displayAttributeErrors() {
        if (!haveAttributes) {
          throw new Error(`${thisFileName}no attributes - must be preceeded by call to attributes()`);
        }
        return showAttributeErrors();
      };
      this.toSource = function toSource(name) {
        if (!haveAttributes) {
          throw new Error(`${thisFileName}can't generate parser source - must be preceeded by call to attributes()`);
        }
        if (attributeErrors) {
          throw new Error(`${thisFileName}can't generate parser source - attributes have ${attributeErrors} errors`);
        }
        return parser.generateSource(this.chars, this.lines, this.rules, this.udts, name);
      };
      this.toObject = function toObject() {
        if (!haveAttributes) {
          throw new Error(`${thisFileName}can't generate parser source - must be preceeded by call to attributes()`);
        }
        if (attributeErrors) {
          throw new Error(`${thisFileName}can't generate parser source - attributes have ${attributeErrors} errors`);
        }
        return parser.generateObject(this.sabnf, this.rules, this.udts);
      };
      this.errorsToAscii = function errorsToAsciiFunc() {
        return errorsToAscii(this.errors, this.lines, this.chars);
      };
      this.errorsToHtml = function errorsToHtmlFunc(title) {
        return errorsToHtml(this.errors, this.lines, this.chars, title);
      };
      this.linesToAscii = function linesToAsciiFunc() {
        return linesToAscii(this.lines);
      };
      this.linesToHtml = function linesToHtmlFunc() {
        return linesToHtml(this.lines);
      };
    };
  }
});

// ../../node_modules/@spruceid/siwe-parser/dist/abnf.js
var require_abnf = __commonJS({
  "../../node_modules/@spruceid/siwe-parser/dist/abnf.js"(exports) {
    "use strict";
    init_esbuild_shims();
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ParsedMessage = void 0;
    var api_1 = __importDefault(require_api());
    var node_exports_1 = __importDefault(require_node_exports());
    var GRAMMAR = `
sign-in-with-ethereum =
    domain %s" wants you to sign in with your Ethereum account:" LF
    address LF
    LF
    [ statement LF ]
    LF
    %s"URI: " URI LF
    %s"Version: " version LF
    %s"Chain ID: " chain-id LF
    %s"Nonce: " nonce LF
    %s"Issued At: " issued-at
    [ LF %s"Expiration Time: " expiration-time ]
    [ LF %s"Not Before: " not-before ]
    [ LF %s"Request ID: " request-id ]
    [ LF %s"Resources:"
    resources ]

domain = authority

address = "0x" 40*40HEXDIG
    ; Must also conform to captilization
    ; checksum encoding specified in EIP-55
    ; where applicable (EOAs).

statement = 1*( reserved / unreserved / " " )
    ; The purpose is to exclude LF (line breaks).

version = "1"

nonce = 8*( ALPHA / DIGIT )

issued-at = date-time
expiration-time = date-time
not-before = date-time

request-id = *pchar

chain-id = 1*DIGIT
    ; See EIP-155 for valid CHAIN_IDs.

resources = *( LF resource )

resource = "- " URI

; ------------------------------------------------------------------------------
; RFC 3986

URI           = scheme ":" hier-part [ "?" query ] [ "#" fragment ]

hier-part     = "//" authority path-abempty
              / path-absolute
              / path-rootless
              / path-empty

scheme        = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )

authority     = [ userinfo "@" ] host [ ":" port ]
userinfo      = *( unreserved / pct-encoded / sub-delims / ":" )
host          = IP-literal / IPv4address / reg-name
port          = *DIGIT

IP-literal    = "[" ( IPv6address / IPvFuture  ) "]"

IPvFuture     = "v" 1*HEXDIG "." 1*( unreserved / sub-delims / ":" )

IPv6address   =                            6( h16 ":" ) ls32
              /                       "::" 5( h16 ":" ) ls32
              / [               h16 ] "::" 4( h16 ":" ) ls32
              / [ *1( h16 ":" ) h16 ] "::" 3( h16 ":" ) ls32
              / [ *2( h16 ":" ) h16 ] "::" 2( h16 ":" ) ls32
              / [ *3( h16 ":" ) h16 ] "::"    h16 ":"   ls32
              / [ *4( h16 ":" ) h16 ] "::"              ls32
              / [ *5( h16 ":" ) h16 ] "::"              h16
              / [ *6( h16 ":" ) h16 ] "::"

h16           = 1*4HEXDIG
ls32          = ( h16 ":" h16 ) / IPv4address
IPv4address   = dec-octet "." dec-octet "." dec-octet "." dec-octet
dec-octet     = DIGIT                 ; 0-9
                 / %x31-39 DIGIT         ; 10-99
                 / "1" 2DIGIT            ; 100-199
                 / "2" %x30-34 DIGIT     ; 200-249
                 / "25" %x30-35          ; 250-255

reg-name      = *( unreserved / pct-encoded / sub-delims )

path-abempty  = *( "/" segment )
path-absolute = "/" [ segment-nz *( "/" segment ) ]
path-rootless = segment-nz *( "/" segment )
path-empty    = 0pchar

segment       = *pchar
segment-nz    = 1*pchar

pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"

query         = *( pchar / "/" / "?" )

fragment      = *( pchar / "/" / "?" )

pct-encoded   = "%" HEXDIG HEXDIG

unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
reserved      = gen-delims / sub-delims
gen-delims    = ":" / "/" / "?" / "#" / "[" / "]" / "@"
sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
              / "*" / "+" / "," / ";" / "="

; ------------------------------------------------------------------------------
; RFC 3339

date-fullyear   = 4DIGIT
date-month      = 2DIGIT  ; 01-12
date-mday       = 2DIGIT  ; 01-28, 01-29, 01-30, 01-31 based on
                          ; month/year
time-hour       = 2DIGIT  ; 00-23
time-minute     = 2DIGIT  ; 00-59
time-second     = 2DIGIT  ; 00-58, 00-59, 00-60 based on leap second
                          ; rules
time-secfrac    = "." 1*DIGIT
time-numoffset  = ("+" / "-") time-hour ":" time-minute
time-offset     = "Z" / time-numoffset

partial-time    = time-hour ":" time-minute ":" time-second
                  [time-secfrac]
full-date       = date-fullyear "-" date-month "-" date-mday
full-time       = partial-time time-offset

date-time       = full-date "T" full-time

; ------------------------------------------------------------------------------
; RFC 5234

ALPHA          =  %x41-5A / %x61-7A   ; A-Z / a-z
LF             =  %x0A
                  ; linefeed
DIGIT          =  %x30-39
                  ; 0-9
HEXDIG         =  DIGIT / "A" / "B" / "C" / "D" / "E" / "F"
`;
    var ParsedMessage = class {
      constructor(msg) {
        const api = new api_1.default(GRAMMAR);
        api.generate();
        if (api.errors.length) {
          console.error(api.errorsToAscii());
          console.error(api.linesToAscii());
          console.log(api.displayAttributeErrors());
          throw new Error(`ABNF grammar has errors`);
        }
        const grammarObj = api.toObject();
        const parser = new node_exports_1.default.parser();
        parser.ast = new node_exports_1.default.ast();
        const id = node_exports_1.default.ids;
        const domain2 = function(state, chars, phraseIndex, phraseLength, data) {
          const ret = id.SEM_OK;
          if (state === id.SEM_PRE) {
            data.domain = node_exports_1.default.utils.charsToString(chars, phraseIndex, phraseLength);
          }
          return ret;
        };
        parser.ast.callbacks.domain = domain2;
        const address = function(state, chars, phraseIndex, phraseLength, data) {
          const ret = id.SEM_OK;
          if (state === id.SEM_PRE) {
            data.address = node_exports_1.default.utils.charsToString(chars, phraseIndex, phraseLength);
          }
          return ret;
        };
        parser.ast.callbacks.address = address;
        const statement = function(state, chars, phraseIndex, phraseLength, data) {
          const ret = id.SEM_OK;
          if (state === id.SEM_PRE) {
            data.statement = node_exports_1.default.utils.charsToString(chars, phraseIndex, phraseLength);
          }
          return ret;
        };
        parser.ast.callbacks.statement = statement;
        const uri = function(state, chars, phraseIndex, phraseLength, data) {
          const ret = id.SEM_OK;
          if (state === id.SEM_PRE) {
            if (!data.uri) {
              data.uri = node_exports_1.default.utils.charsToString(chars, phraseIndex, phraseLength);
            }
          }
          return ret;
        };
        parser.ast.callbacks.uri = uri;
        const version = function(state, chars, phraseIndex, phraseLength, data) {
          const ret = id.SEM_OK;
          if (state === id.SEM_PRE) {
            data.version = node_exports_1.default.utils.charsToString(chars, phraseIndex, phraseLength);
          }
          return ret;
        };
        parser.ast.callbacks.version = version;
        const chainId = function(state, chars, phraseIndex, phraseLength, data) {
          const ret = id.SEM_OK;
          if (state === id.SEM_PRE) {
            data.chainId = parseInt(node_exports_1.default.utils.charsToString(chars, phraseIndex, phraseLength));
          }
          return ret;
        };
        parser.ast.callbacks["chain-id"] = chainId;
        const nonce2 = function(state, chars, phraseIndex, phraseLength, data) {
          const ret = id.SEM_OK;
          if (state === id.SEM_PRE) {
            data.nonce = node_exports_1.default.utils.charsToString(chars, phraseIndex, phraseLength);
          }
          return ret;
        };
        parser.ast.callbacks.nonce = nonce2;
        const issuedAt2 = function(state, chars, phraseIndex, phraseLength, data) {
          const ret = id.SEM_OK;
          if (state === id.SEM_PRE) {
            data.issuedAt = node_exports_1.default.utils.charsToString(chars, phraseIndex, phraseLength);
          }
          return ret;
        };
        parser.ast.callbacks["issued-at"] = issuedAt2;
        const expirationTime = function(state, chars, phraseIndex, phraseLength, data) {
          const ret = id.SEM_OK;
          if (state === id.SEM_PRE) {
            data.expirationTime = node_exports_1.default.utils.charsToString(chars, phraseIndex, phraseLength);
          }
          return ret;
        };
        parser.ast.callbacks["expiration-time"] = expirationTime;
        const notBefore = function(state, chars, phraseIndex, phraseLength, data) {
          const ret = id.SEM_OK;
          if (state === id.SEM_PRE) {
            data.notBefore = node_exports_1.default.utils.charsToString(chars, phraseIndex, phraseLength);
          }
          return ret;
        };
        parser.ast.callbacks["not-before"] = notBefore;
        const requestId = function(state, chars, phraseIndex, phraseLength, data) {
          const ret = id.SEM_OK;
          if (state === id.SEM_PRE) {
            data.requestId = node_exports_1.default.utils.charsToString(chars, phraseIndex, phraseLength);
          }
          return ret;
        };
        parser.ast.callbacks["request-id"] = requestId;
        const resources = function(state, chars, phraseIndex, phraseLength, data) {
          const ret = id.SEM_OK;
          if (state === id.SEM_PRE) {
            data.resources = node_exports_1.default.utils.charsToString(chars, phraseIndex, phraseLength).slice(3).split("\n- ");
          }
          return ret;
        };
        parser.ast.callbacks.resources = resources;
        const result = parser.parse(grammarObj, "sign-in-with-ethereum", msg);
        if (!result.success) {
          throw new Error(`Invalid message: ${JSON.stringify(result)}`);
        }
        const elements = {};
        parser.ast.translate(elements);
        for (const [key, value] of Object.entries(elements)) {
          this[key] = value;
        }
      }
    };
    exports.ParsedMessage = ParsedMessage;
  }
});

// ../../node_modules/@spruceid/siwe-parser/dist/regex.js
var require_regex = __commonJS({
  "../../node_modules/@spruceid/siwe-parser/dist/regex.js"(exports) {
    "use strict";
    init_esbuild_shims();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ParsedMessage = void 0;
    var DOMAIN = "(?<domain>([^?#]*)) wants you to sign in with your Ethereum account:";
    var ADDRESS = "\\n(?<address>0x[a-zA-Z0-9]{40})\\n\\n";
    var STATEMENT = "((?<statement>[^\\n]+)\\n)?";
    var URI = "(([^:?#]+):)?(([^?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))";
    var URI_LINE = `\\nURI: (?<uri>${URI}?)`;
    var VERSION = "\\nVersion: (?<version>1)";
    var CHAIN_ID = "\\nChain ID: (?<chainId>[0-9]+)";
    var NONCE = "\\nNonce: (?<nonce>[a-zA-Z0-9]{8,})";
    var DATETIME = `([0-9]+)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])[Tt]([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60)(.[0-9]+)?(([Zz])|([+|-]([01][0-9]|2[0-3]):[0-5][0-9]))`;
    var ISSUED_AT = `\\nIssued At: (?<issuedAt>${DATETIME})`;
    var EXPIRATION_TIME = `(\\nExpiration Time: (?<expirationTime>${DATETIME}))?`;
    var NOT_BEFORE = `(\\nNot Before: (?<notBefore>${DATETIME}))?`;
    var REQUEST_ID = "(\\nRequest ID: (?<requestId>[-._~!$&'()*+,;=:@%a-zA-Z0-9]*))?";
    var RESOURCES = `(\\nResources:(?<resources>(\\n- ${URI}?)+))?`;
    var MESSAGE = `^${DOMAIN}${ADDRESS}${STATEMENT}${URI_LINE}${VERSION}${CHAIN_ID}${NONCE}${ISSUED_AT}${EXPIRATION_TIME}${NOT_BEFORE}${REQUEST_ID}${RESOURCES}$`;
    var ParsedMessage = class {
      constructor(msg) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        const REGEX = new RegExp(MESSAGE, "g");
        let match = REGEX.exec(msg);
        if (!match) {
          throw new Error("Message did not match the regular expression.");
        }
        this.match = match;
        this.domain = (_a = match === null || match === void 0 ? void 0 : match.groups) === null || _a === void 0 ? void 0 : _a.domain;
        this.address = (_b = match === null || match === void 0 ? void 0 : match.groups) === null || _b === void 0 ? void 0 : _b.address;
        this.statement = (_c = match === null || match === void 0 ? void 0 : match.groups) === null || _c === void 0 ? void 0 : _c.statement;
        this.uri = (_d = match === null || match === void 0 ? void 0 : match.groups) === null || _d === void 0 ? void 0 : _d.uri;
        this.version = (_e = match === null || match === void 0 ? void 0 : match.groups) === null || _e === void 0 ? void 0 : _e.version;
        this.nonce = (_f = match === null || match === void 0 ? void 0 : match.groups) === null || _f === void 0 ? void 0 : _f.nonce;
        this.chainId = parseInt((_g = match === null || match === void 0 ? void 0 : match.groups) === null || _g === void 0 ? void 0 : _g.chainId);
        this.issuedAt = (_h = match === null || match === void 0 ? void 0 : match.groups) === null || _h === void 0 ? void 0 : _h.issuedAt;
        this.expirationTime = (_j = match === null || match === void 0 ? void 0 : match.groups) === null || _j === void 0 ? void 0 : _j.expirationTime;
        this.notBefore = (_k = match === null || match === void 0 ? void 0 : match.groups) === null || _k === void 0 ? void 0 : _k.notBefore;
        this.requestId = (_l = match === null || match === void 0 ? void 0 : match.groups) === null || _l === void 0 ? void 0 : _l.requestId;
        this.resources = (_o = (_m = match === null || match === void 0 ? void 0 : match.groups) === null || _m === void 0 ? void 0 : _m.resources) === null || _o === void 0 ? void 0 : _o.split("\n- ").slice(1);
      }
    };
    exports.ParsedMessage = ParsedMessage;
  }
});

// ../../node_modules/@spruceid/siwe-parser/dist/parsers.js
var require_parsers = __commonJS({
  "../../node_modules/@spruceid/siwe-parser/dist/parsers.js"(exports) {
    "use strict";
    init_esbuild_shims();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ParsedMessageRegExp = exports.ParsedMessage = void 0;
    var abnf_1 = require_abnf();
    Object.defineProperty(exports, "ParsedMessage", { enumerable: true, get: function() {
      return abnf_1.ParsedMessage;
    } });
    var regex_1 = require_regex();
    Object.defineProperty(exports, "ParsedMessageRegExp", { enumerable: true, get: function() {
      return regex_1.ParsedMessage;
    } });
  }
});

// ../../node_modules/siwe/dist/client.js
var require_client = __commonJS({
  "../../node_modules/siwe/dist/client.js"(exports) {
    "use strict";
    init_esbuild_shims();
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.generateNonce = exports.checkContractWalletSignature = exports.SiweMessage = exports.SignatureType = exports.ErrorTypes = void 0;
    var random_1 = require_random();
    var ethers_1 = require("ethers");
    var siwe_parser_1 = require_parsers();
    var ErrorTypes;
    (function(ErrorTypes2) {
      ErrorTypes2["INVALID_SIGNATURE"] = "Invalid signature.";
      ErrorTypes2["EXPIRED_MESSAGE"] = "Expired message.";
      ErrorTypes2["MALFORMED_SESSION"] = "Malformed session.";
    })(ErrorTypes = exports.ErrorTypes || (exports.ErrorTypes = {}));
    var SignatureType;
    (function(SignatureType2) {
      SignatureType2["PERSONAL_SIGNATURE"] = "Personal signature";
    })(SignatureType = exports.SignatureType || (exports.SignatureType = {}));
    var SiweMessage2 = class {
      constructor(param) {
        if (typeof param === "string") {
          const parsedMessage = new siwe_parser_1.ParsedMessage(param);
          this.domain = parsedMessage.domain;
          this.address = parsedMessage.address;
          this.statement = parsedMessage.statement;
          this.uri = parsedMessage.uri;
          this.version = parsedMessage.version;
          this.nonce = parsedMessage.nonce;
          this.issuedAt = parsedMessage.issuedAt;
          this.expirationTime = parsedMessage.expirationTime;
          this.notBefore = parsedMessage.notBefore;
          this.requestId = parsedMessage.requestId;
          this.chainId = parsedMessage.chainId;
          this.resources = parsedMessage.resources;
        } else {
          Object.assign(this, param);
          if (typeof this.chainId === "string") {
            this.chainId = parseInt(this.chainId);
          }
        }
      }
      regexFromMessage(message) {
        const parsedMessage = new siwe_parser_1.ParsedMessageRegExp(message);
        return parsedMessage.match;
      }
      toMessage() {
        const header = `${this.domain} wants you to sign in with your Ethereum account:`;
        const uriField = `URI: ${this.uri}`;
        let prefix = [header, this.address].join("\n");
        const versionField = `Version: ${this.version}`;
        if (!this.nonce) {
          this.nonce = (0, exports.generateNonce)();
        }
        const chainField = `Chain ID: ` + this.chainId || "1";
        const nonceField = `Nonce: ${this.nonce}`;
        const suffixArray = [uriField, versionField, chainField, nonceField];
        if (this.issuedAt) {
          Date.parse(this.issuedAt);
        }
        this.issuedAt = this.issuedAt ? this.issuedAt : new Date().toISOString();
        suffixArray.push(`Issued At: ${this.issuedAt}`);
        if (this.expirationTime) {
          const expiryField = `Expiration Time: ${this.expirationTime}`;
          suffixArray.push(expiryField);
        }
        if (this.notBefore) {
          suffixArray.push(`Not Before: ${this.notBefore}`);
        }
        if (this.requestId) {
          suffixArray.push(`Request ID: ${this.requestId}`);
        }
        if (this.resources) {
          suffixArray.push([`Resources:`, ...this.resources.map((x) => `- ${x}`)].join("\n"));
        }
        let suffix = suffixArray.join("\n");
        prefix = [prefix, this.statement].join("\n\n");
        if (this.statement) {
          prefix += "\n";
        }
        return [prefix, suffix].join("\n");
      }
      signMessage() {
        console && console.warn && console.warn("signMessage method is deprecated, use prepareMessage instead.");
        return this.prepareMessage();
      }
      prepareMessage() {
        let message;
        switch (this.version) {
          case "1": {
            message = this.toMessage();
            break;
          }
          default: {
            message = this.toMessage();
            break;
          }
        }
        return message;
      }
      validate(signature = this.signature, provider) {
        return __awaiter(this, void 0, void 0, function* () {
          return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const message = this.prepareMessage();
            try {
              let missing = [];
              if (!message) {
                missing.push("`message`");
              }
              if (!signature) {
                missing.push("`signature`");
              }
              if (!this.address) {
                missing.push("`address`");
              }
              if (missing.length > 0) {
                throw new Error(`${ErrorTypes.MALFORMED_SESSION} missing: ${missing.join(", ")}.`);
              }
              let addr;
              try {
                addr = ethers_1.ethers.utils.verifyMessage(message, signature);
              } catch (_) {
              } finally {
                if (addr !== this.address) {
                  try {
                    const isValidSignature = yield (0, exports.checkContractWalletSignature)(this, signature, provider);
                    if (!isValidSignature) {
                      throw new Error(`${ErrorTypes.INVALID_SIGNATURE}: ${addr} !== ${this.address}`);
                    }
                  } catch (e) {
                    throw e;
                  }
                }
              }
              const parsedMessage = new SiweMessage2(message);
              if (parsedMessage.expirationTime) {
                const exp = new Date(parsedMessage.expirationTime).getTime();
                if (isNaN(exp)) {
                  throw new Error(`${ErrorTypes.MALFORMED_SESSION} invalid expiration date.`);
                }
                if (new Date().getTime() >= exp) {
                  throw new Error(ErrorTypes.EXPIRED_MESSAGE);
                }
              }
              resolve(parsedMessage);
            } catch (e) {
              reject(e);
            }
          }));
        });
      }
    };
    exports.SiweMessage = SiweMessage2;
    var checkContractWalletSignature = (message, signature, provider) => __awaiter(void 0, void 0, void 0, function* () {
      if (!provider) {
        return false;
      }
      const abi = [
        "function isValidSignature(bytes32 _message, bytes _signature) public view returns (bool)"
      ];
      try {
        const walletContract = new ethers_1.Contract(message.address, abi, provider);
        const hashMessage = ethers_1.utils.hashMessage(message.signMessage());
        return yield walletContract.isValidSignature(hashMessage, signature);
      } catch (e) {
        throw e;
      }
    });
    exports.checkContractWalletSignature = checkContractWalletSignature;
    var generateNonce = () => {
      return (0, random_1.randomStringForEntropy)(96);
    };
    exports.generateNonce = generateNonce;
  }
});

// ../../node_modules/siwe/dist/siwe.js
var require_siwe = __commonJS({
  "../../node_modules/siwe/dist/siwe.js"(exports) {
    "use strict";
    init_esbuild_shims();
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_client(), exports);
  }
});

// toBundle.js
init_esbuild_shims();
var import_siwe = __toESM(require_siwe(), 1);
var domain = "localhost:3000";
var origin = "http://localhost:3000";
function createSiweMessage(address, statement) {
  const message = new import_siwe.SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: "1",
    chainId: "1",
    nonce,
    issuedAt
  });
  return message.prepareMessage();
}
var go = async () => {
  let ethAddress = ethers.utils.computeAddress(publicKey);
  let toSign = createSiweMessage(ethAddress, "Sign in with Ethereum with your PKP");
  await Lit.Actions.ethPersonalSignMessageEcdsa({
    message: toSign,
    publicKey,
    sigName: "siweSig"
  });
  Lit.Actions.setResponse({
    response: JSON.stringify({ ethAddress, toSign })
  });
};
go();
