const net = require("net");
const client = new net.Socket();

const {
  ClientInfoPackage,
  PressButtonPackage,
  ClientPackageTypes,
  ServerPackageTypes,
  GetInfoPackage,
  RestartPackage,
  UpdateNumbersPackage,
  SetDigitCompletedPackage
} = require("../index");

module.exports = {
  connect: (port, address) => {
    return new Promise((resolve, reject) => {
      client.connect(port, address, function() {
        console.log("Connected");
        resolve();
      });

      client.on("data", function(data) {
        console.log("Received " + data);
        console.log("get chunk");
        console.log("length", data.length, data.byteLength);
        let parsedLength = 0; // Длина обработанного сообщения
        while (parsedLength < data.byteLength) {
          // В chunk может быть сразу несколько сообщений
          const messageId = new Uint8Array(data.buffer, parsedLength, 1)[0];
          console.log("messageId", messageId);
          console.log("data", data);
          switch (messageId) {
            case ServerPackageTypes.UPDATE_ARR_NUMBERS_AND_COMPLETED_STATUS: {
              const package = UpdateNumbersPackage(
                Buffer.from(data.buffer, parsedLength, 49)
              );
              parsedLength += 49;
              console.log("package", JSON.stringify(package, null, 4));
              break;
            }
            case ServerPackageTypes.SET_DIGIT_COMPLETED: {
              const package = SetDigitCompletedPackage(
                Buffer.from(data.buffer, parsedLength, 2)
              );
              parsedLength += 2;
              console.log("package", JSON.stringify(package, null, 4));
              break;
            }
            case ServerPackageTypes.RESTART: {
              const package = RestartPackage(
                Buffer.from(data.buffer, parsedLength, 1)
              );
              parsedLength += 1;
              console.log("package", JSON.stringify(package, null, 4));
              break;
            }
            case ServerPackageTypes.GET_INFO: {
              const package = GetInfoPackage(
                Buffer.from(data.buffer, parsedLength, 1)
              );
              parsedLength += 1;
              console.log("package", JSON.stringify(package, null, 4));
              break;
            }
            default: {
              console.warn(new Error("unknow package id"));
            }
          }
        }
      });

      client.on("close", function() {
        console.log("Connection closed");
        reject("connection close");
      });
    });
  },
  sendClientInfo() {
    return new Promise((res, rej) => {
      const buff = new ArrayBuffer(16);
      let messageId = new Uint8Array(buff, 0, 1);
      let address = new Uint8Array(buff, 1, 4);
      let deviceId = new Uint8Array(buff, 5, 1);
      let chipId = new Uint16Array(buff, 6, 2);
      let freeHeap = new Uint16Array(buff, 10, 2);
      // let softVersion = new Uint16Array(buff, 14, 1);
      messageId[0] = 1;

      address[0] = 192;
      address[1] = 168;
      address[2] = 0;
      address[3] = 105;

      deviceId[0] = 1;

      chipId[0] = 255;

      freeHeap[0] = 8888;

      // softVersion[0] = 0;
      const clientInfoPackage = ClientInfoPackage(Buffer.from(buff));
      client.write(Buffer.from(clientInfoPackage.buff), err => {
        err ? rej(err) : res();
      });

      console.info("sendClientInfo", buff.byteLength);
    });
  },
  sendPressButton() {
    return new Promise((res, rej) => {
      const pressButtonPackage = PressButtonPackage();
      pressButtonPackage.pressButtonIndex = 14;
      client.write(Buffer.from(pressButtonPackage.buff), err => {
        err ? rej(err) : res();
      });
      console.info("sendPressButton", pressButtonPackage.buff.byteLength);
    });
  }
};
