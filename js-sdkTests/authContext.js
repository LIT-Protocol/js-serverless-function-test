import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { getAuthSig } from "../utils.js";

// this code will be run on the node
const litActionCode = `
const go = async () => {
  Lit.Actions.setResponse({response: JSON.stringify({"Lit.Auth": Lit.Auth})})
};

go();
`;

const runLitAction = async () => {
  const authSig = await getAuthSig();
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: "cayenne",
    debug: true,
  });
  await litNodeClient.connect();
  const results = await litNodeClient.executeJs({
    code: litActionCode,
    authSig,
    authMethods: [
      // {
      //   // discord oauth
      //   accessToken: "M1Y1WnYnavzmSaZ6p1LBLsNFn2iiu0",
      //   authMethodType: 4,
      // },
      // {
      //   // google oauth
      //   accessToken:
      //     "ya29.a0Aa4xrXMCyLStBQzLhC8il8YRPXIkEEgno9nB4PKvjCi6oIu-uIjeIoyfQoR99TcZf0IUMPfJfjRIJyIXtLk_kXLa5BmdUyJcJGP8SB4-UjlebOILidfItC8KR1sQR9LSFX55cw3_GTa5IqCOCTXME38z5ZMZaCgYKATASARASFQEjDvL9HinQH3Mk1UclCD011YbLfQ0163",
      //   authMethodType: 5,
      // },
      // {
      //   // google oauth JWT
      //   accessToken:
      //     "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc3Y2MwZWY0YzcxODFjZjRjMGRjZWY3YjYwYWUyOGNjOTAyMmM3NmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDg5OTYwNTQyNzMzNjA1NjgxMzIiLCJlbWFpbCI6ImdldmVuc3RlZUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IlVYV1Z1eEJsdGswcEhKclllOEFXTUEiLCJpYXQiOjE2NjcxNjgyMTUsImV4cCI6MTY2NzE3MTgxNX0.ejZu5bADJ6cUsovV7otHAafy0mqWZBAtN860jvBdVe38XUi0v-eB5WWBPMD5zXcJxbXFvaPWCX8nTaE6S24cNNHJw0hq15irjRZeg9D2i7ToitR1LZSQ3rPCDQZPX4xYn7G-FH7C1DQ-7NEDMmr9ge4B6Qs4pT5Mj8ESVlA29yZjKCfk-zL7F5b6W0EOIA6G9rj6-3HgtazkHfIGHAtfBz4dqHjC4HJncHJzqIm9Y8eSBBnN-ZhYUr3cWxGCuFIw3yrGccv5_khfhbbk6TqdSeMO9YNWN3otiVB8Nwu2sb9VsllFoHIE0uGSzVZVbJgSK1GsGbJZe76ubLuObI5YFw",
      //   authMethodType: 6,
      // },
      {
        // apple oauth JWT
        accessToken:
          "eyJraWQiOiJmaDZCczhDIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiaG9zdC5leHAuRXhwb25lbnQiLCJleHAiOjE2ODQzOTU2MDEsImlhdCI6MTY4NDMwOTIwMSwic3ViIjoiMDAxOTE0LjAxNDQ3MTM1OTgyOTQ5MWZhOTU3N2QwNzQ3NDMwMTcxLjEzNTAiLCJjX2hhc2giOiJIWXhDaHc4ZVpPUlV5eFFQelNpY3dRIiwiZW1haWwiOiJiYXB0aXN0ZS5ncmV2ZUBlc3BlbWUuY29tIiwiZW1haWxfdmVyaWZpZWQiOiJ0cnVlIiwiYXV0aF90aW1lIjoxNjg0MzA5MjAxLCJub25jZV9zdXBwb3J0ZWQiOnRydWV9.Sh94-NM0XayRqND_znbzVzxPsD4tCtFCAwubPwp__LBEfr4tNDrR6IQyhFshFn0UT2ScYAeaZlWcQOUuDWpleFX6eJ7WI7yBCywzHrW-cWIO_jivQ9tzd0F4xlstK15791xHe5YEPisA6O0TARYvhsdZ-fz4gwl3Fx9f1jKvGT39I01hYVwAYzKuyDJHDP_ma2phBH3gR7UeYDgA1fkmLb5_pcmisS81G3lCuN4oBeplwScWt0lFq6TwrjgPQhQX_kJU-MWe_u9vgvxSgBGWXuvZqRFjtpGvBdPWECqjG7R806Dqv407naawlOKoJnsuFXqSFLmJBbb2ajS7gDQ2Yw",
        authMethodType: 8,
      },
    ],
  });
  console.log("results: ", JSON.stringify(results.response, null, 2));
};

runLitAction();
