let temperature = await Lit.Actions.runOnce(
  { waitForResponse: true },
  async () => {
    const url = "https://api.weather.gov/gridpoints/TOP/31,80/forecast";
    const resp = await fetch(url).then((response) => response.json());
    const temp = resp.properties.periods[0].temperature;
    return temp;
  }
);
const sigShare = await Lit.Actions.signEcdsa({ toSign, publicKey, sigName });
