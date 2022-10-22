import { build, analyzeMetafile } from "esbuild";

const go = async () => {
  let result = await build({
    entryPoints: ["./toBundle.js"],
    bundle: true,
    minify: false,
    sourcemap: false,
    outfile: "./bundled.js",
    sourceRoot: "./",
    platform: "node",
    metafile: true,
    external: ["ethers"],
    inject: ["./esbuild-shims.js"],
  });
  // let text = await analyzeMetafile(result.metafile);
  // console.log(text);
};

go();
