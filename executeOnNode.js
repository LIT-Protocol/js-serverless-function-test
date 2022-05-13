import fs from "fs";
import axios from "axios";

const bytes = fs.readFileSync("./index.js");
const encodedJs = bytes.toString("base64");

console.log("encodedJs", encodedJs);

const url = "http://localhost:7470/web/execute";

axios.post(url, { js_base64: encodedJs }).then((res) => {
  console.log("response: " + JSON.stringify(res.data, null, 2));
});
