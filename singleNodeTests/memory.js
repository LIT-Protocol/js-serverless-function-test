const go = async () => {
  var largeArray = [];
  for (var i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
    largeArray.push(new Date());
  }
};

go();
