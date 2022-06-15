const go = async () => {
  let url = "http://localhost:3000/electric_cat.png";
  let time = Date.now();
  let fetchCount = 0;
  let promises = [];
  for (let i = 0; i < 100; i++) {
    promises.push(fetch(url));
    fetchCount++;

    let curTime = Date.now();
    console.log(
      `The JS has been running in an infinite loop for this many ms: ${
        curTime - time
      } and has sent ${fetchCount} requests`
    );
  }
  await Promise.all(promises);
};

go();
