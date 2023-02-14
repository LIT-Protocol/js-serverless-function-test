const go = async (maxTemp) => {
  const url = "https://api.weather.gov/gridpoints/LWX/97,71/forecast";
  try {
    const response = await fetch(url).then((res) => res.json());
    const nearestForecast = response.properties.periods[0];
    const temp = nearestForecast.temperature;
    return temp < parseInt(maxTemp);
  } catch (e) {
    console.log(e);
  }
  return false;
};
