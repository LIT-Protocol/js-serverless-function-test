import handler from "serve-handler";
import http from "http";

let requestCounter = 0;
const server = http.createServer((request, response) => {
  // You pass two more arguments for config and middleware
  // More details here: https://github.com/vercel/serve-handler#options
  requestCounter++;
  console.log(`Served ${requestCounter} requests`);
  return handler(request, response);
});

server.listen(3000, () => {
  console.log("Running at http://localhost:3000");
});
