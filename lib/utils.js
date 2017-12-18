function initialize(initData, buff) {
  if (initData !== null) {
    if (initData.length !== buff.byteLength) {
      throw new Error(
        "ivalid init data buffer length: get " +
          initData.length +
          ", expected " +
          buff.byteLength
      );
    }
    var view = new Uint8Array(buff);
    // console.log("init data", initData);
    for (var i = 0; i < initData.length; ++i) {
      view[i] = initData[i];
      // console.log(`view[${i}] = initData[${i}] = ${initData[i]} `);
    }
  }
}

module.exports = {
  initialize: initialize
};
