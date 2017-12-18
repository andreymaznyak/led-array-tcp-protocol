/**
 * @typedef Package Пакет с данными
 * @type {object}
 * @property {ArrayBuffer} buff - readonly buffer with data.
 * @property {string} type - readonly package type.
 * @property {number} messageId - readonly message id.
 */

const utils = require("./utils");
/**
 * Типы клиентских пакетов
 */
const ClientPackageTypes = {
  CLIENT_INFO: 1,
  PRESS_BUTTON: 2
};

/**
 * Пакет с информацией о клиенте
 * @param {Buffer} initData Буфер с данными для инициализации
 */
function ClientInfoPackage(initData) {
  const type = "CLIENT_INFO";
  const buff = new ArrayBuffer(16);

  const messageId = new Uint8Array(buff, 0, 1);
  const address = new Uint8Array(buff, 1, 4);
  const deviceId = new Uint8Array(buff, 5, 1);
  const espInfo = new DataView(buff, 6, 10);
  // const freeHeap = new Uint16Array(buff, 10, 2);
  // const softVersion = new Uint16Array(buff, 14, 1);

  messageId[0] = ClientPackageTypes[type];

  utils.initialize(initData, buff);

  return {
    get buff() {
      return buff;
    },
    get type() {
      return type;
    },
    get messageId() {
      return messageId[0];
    },
    get address() {
      return `${address[0]}.${address[1]}.${address[2]}.${address[3]}`;
    },
    get deviceId() {
      return deviceId[0];
    },
    get chipId() {
      return espInfo.getUint32(0);
    },
    get freeHeap() {
      return espInfo.getUint32(4);
    },
    get softVersion() {
      return espInfo.getUint16(8);
    }
  };
}

/**
 * Пакет с информацией о нажатой кнопке
 * @param {Buffer} initData Буфер с данными
 */
function PressButtonPackage(initData = null) {
  const type = "PRESS_BUTTON";
  const buff = new ArrayBuffer(2);

  const messageId = new Uint8Array(buff, 0, 1);
  const pressButtonIndex = new Uint8Array(buff, 1, 1);

  messageId[0] = ClientPackageTypes[type];
  utils.initialize(initData, buff);

  return {
    get buff() {
      return buff;
    },
    get type() {
      return type;
    },
    get messageId() {
      return messageId[0];
    },
    get pressButtonIndex() {
      return pressButtonIndex[0];
    },
    set pressButtonIndex(val) {
      pressButtonIndex[0] = val;
    }
  };
}

module.exports = {
  ClientPackageTypes,
  ClientInfoPackage,
  PressButtonPackage
};
