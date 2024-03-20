const url = "https://api.weather.gov/gridpoints/TOP/31,80/forecast";
const resp = await fetch(url).then((response) => response.json());
const temp = resp.properties.periods[0].temperature;

const temperatures = await Lit.Actions.broadcastAndCollect({
  name: "temperature",
  value: temp,
});

// at this point, temperatures is an array of all the values that all the nodes got
const median = temperatures.sort()[Math.floor(temperatures.length / 2)];

// the signature shares will be returned to the user and they will be combined client side to the user
await Lit.Actions.signEcdsa({ toSign: median, publicKey, sigName: "sig1" });
