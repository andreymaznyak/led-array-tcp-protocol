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

  initialize(initData, buff);

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
      return "" + address[0] + address[1] + address[2] + address[3] + "";
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
  initialize(initData, buff);

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
/* SERVER PACKAGE */
/**
 * Типы пакетов от сервера
 */
const ServerPackageTypes = {
  SET_DIGIT_COMPLETED: 3,
  UPDATE_ARR_NUMBERS_AND_COMPLETED_STATUS: 4,
  RESTART: 5,
  GET_INFO: 6
};

/**
 * Функция генерирует пакет для отправки сообщения
 * мигать определенному номеру или нет
 * @param {Buffer} [initData] Буфер с данными для инициализации пакета
 */
function SetDigitCompletedPackage(initData = null) {
  const type = "SET_DIGIT_COMPLETED";

  const buff = new ArrayBuffer(2);

  const messageId = new Uint8Array(buff, 0, 1);
  const numberInfo = new Uint8Array(buff, 1, 1);

  messageId[0] = ServerPackageTypes[type];

  initialize(initData, buff);

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
    /**
     * Функция устанавливает данные пакета
     * @param {number} index индекс номера
     * @param {boolean} isComplete  мигать номеру или нет
     */
    setComplete(index, isComplete) {
      numberInfo[0] = index + (isComplete ? 1 << 7 : 0);
    },
    /**
     * Функция возвращает данные пакета
     */
    getComplete() {
      return {
        index: numberInfo[0] & ~(1 << 7),
        isComplete: numberInfo[0] >> 7
      };
    }
  };
}

/**
 * Функция генерирует пакет для отправки данных о клиентах на ящик
 * @param {Buffer} [initData] Буфер с данными для инициализации пакета
 */
function UpdateNumbersPackage(initData = null) {
  const type = "UPDATE_ARR_NUMBERS_AND_COMPLETED_STATUS";

  const buff = new ArrayBuffer(49);
  const messageId = new Uint8Array(buff, 0, 1);
  const clientsInfo = new DataView(buff, 1, 48);

  messageId[0] = ServerPackageTypes[type];

  initialize(initData, buff);

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
    get clients() {
      const data = {};
      for (let i = 0; i < 24; i++) {
        data[i] = this.getClient(i);
      }
      return data;
    },
    /**
     * Функция устанавливает данные клиента по индексу
     * @param {number} index
     * @param {number} number номер клиента
     * @param {boolean} isCompleted мигать или нет
     */
    setClient(index, number, isCompleted) {
      clientsInfo.setUint16(index * 2, number + (isCompleted ? 1 << 15 : 0));
    },
    /**
     * Функция получает данные о клиенте по индексу
     * @param {number} index
     */
    getClient(index) {
      return {
        number: clientsInfo.getUint16(index * 2) & ~(1 << 15),
        isCompleted: !!(clientsInfo.getUint16(index * 2) >> 15)
      };
    }
  };
}

/**
 * Функция генерирует пакет для команды рестарта стойки
 * @param {Buffer} [initData] Буфер с данными для инициализации пакета
 * @return {Package} Объект для работы с пакетом
 */
function RestartPackage(initData = null) {
  const type = "RESTART";

  const buff = new ArrayBuffer(1);

  const messageId = new Uint8Array(buff, 0, 1);

  messageId[0] = ServerPackageTypes[type];

  initialize(initData, buff);

  return {
    get buff() {
      return buff;
    },
    get type() {
      return type;
    },
    get messageId() {
      return messageId[0];
    }
  };
}

/**
 * Функция генерирует пакет для получения данных о клиенте
 * @param {Buffer} [initData] Буфер с данными для инициализации пакета
 * @return {Package} Объект для работы с пакетом
 */
function GetInfoPackage(initData = null) {
  const type = "GET_INFO";

  const buff = new ArrayBuffer(1);

  const messageId = new Uint8Array(buff, 0, 1);

  messageId[0] = ServerPackageTypes[type];

  initialize(initData, buff);

  return {
    get buff() {
      return buff;
    },
    get type() {
      return type;
    },
    get messageId() {
      return messageId[0];
    }
  };
}

module.exports = {
  ClientPackageTypes: ClientPackageTypes,
  ClientInfoPackage: ClientInfoPackage,
  PressButtonPackage: PressButtonPackage,
  ServerPackageTypes: ServerPackageTypes,
  GetInfoPackage: GetInfoPackage,
  RestartPackage: RestartPackage,
  UpdateNumbersPackage: UpdateNumbersPackage,
  SetDigitCompletedPackage: SetDigitCompletedPackage
};
