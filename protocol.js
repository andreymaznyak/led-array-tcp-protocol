const ClientPackageTypes = {
  CLIENT_INFO: 1,
  PRESS_BUTTON: 2
};

const ServerPackageTypes = {
  SET_DIGIT_COMPLETED: 3,
  UPDATE_ARR_NUMBERS_AND_COMPLETED_STATUS: 4,
  RESTART: 5,
  GET_INFO: 6
};

function initialize(initData, buff) {
  if (initData !== null) {
    if (initData.length !== buff.byteLength) {
      throw new Error(
        `ivalid init data buffer length: get ${initData.length}, expected ${
          buff.byteLength
        }`
      );
    }
    var view = new Uint8Array(buff);
    console.log("init data", initData);
    for (var i = 0; i < initData.length; ++i) {
      view[i] = initData[i];
      console.log(`view[${i}] = initData[${i}] = ${initData[i]} `);
    }
  }
}

/* CLIENT PACKAGE */
/**
 *
 * @param {Buffer} initData
 */
function ClientInfoPackage(initData = null) {
  const buff = new ArrayBuffer(16);

  const messageId = new Uint8Array(buff, 0, 1);
  const address = new Uint8Array(buff, 1, 4);
  const deviceId = new Uint8Array(buff, 5, 1);
  const chipId = new Uint16Array(buff, 6, 2);
  const freeHeap = new Uint16Array(buff, 10, 2);
  const softVersion = new Uint16Array(buff, 14, 1);

  initialize(initData, buff);

  return {
    get type() {
      return ClientPackageTypes.CLIENT_INFO;
    },
    get messageId() {
      return messageId[0];
    },
    set messageId(val) {
      messageId[0] = val;
    },
    get address() {
      return `${address[0]}.${address[1]}.${address[2]}.${address[3]}`;
    },
    set address(val) {},
    get deviceId() {
      return deviceId[0];
    },
    set deviceId(val) {},
    get chipId() {
      return new Uint32Array(chipId, 0, 1)[0];
    },
    set chipId(val) {},
    get freeHeap() {
      return new Uint32Array(chipId, 0, 1)[0];
    },
    set freeHeap(val) {},
    get softVersion() {
      return softVersion[0];
    },
    set softVersion(val) {}
  };
}

/**
 *
 * @param {Buffer} initData
 */
function PressButtonPackage(initData = null) {
  const buff = new ArrayBuffer(16);

  const messageId = new Uint8Array(buff, 0, 1);
  const pressButtonIndex = new Uint8Array(buff, 1, 1);

  initialize(initData, buff);

  return {
    get type() {
      return ClientPackageTypes.CLIENT_INFO;
    },
    get messageId() {
      return messageId[0];
    },
    set messageId(val) {
      messageId[0] = val;
    },
    get pressButtonIndex() {
      return pressButtonIndex[0];
    }
  };
}

/* SERVER PACKAGE */
function SetDigitCompletedPackage() {}

function UpdateNumbersPackage() {}

function RestartPackage() {}

function GetInfoPackage() {}

module.exports = {
  ClientPackageTypes,
  ServerPackageTypes,
  ClientInfoPackage,
  PressButtonPackage
};
