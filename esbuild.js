import { build, analyzeMetafile } from "esbuild";

const go = async () => {
  let result = await build({
    entryPoints: ["./signTxnTest.js"],
    bundle: true,
    minify: false,
    sourcemap: false,
    outfile: "build/signTxnTest.js",
    sourceRoot: "./",
    platform: "node",
    metafile: true,
    target: "es6",
    // inject: ["./esbuild-shims.js"],
  });
  // let text = await analyzeMetafile(result.metafile);
  // console.log(text);
};

go();
