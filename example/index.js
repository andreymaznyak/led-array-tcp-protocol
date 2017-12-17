const net = require("net");

const {
  ClientPackageTypes,
  ClientInfoPackage,
  PressButtonPackage,
  ServerPackageTypes,
  GetInfoPackage,
  RestartPackage,
  UpdateNumbersPackage,
  SetDigitCompletedPackage
} = require("../");

const server = net.createServer(function(socket) {
  socket.on("data", data => {
    let parsedLength = 0; // Длина обработанного сообщения
    while (parsedLength < data.byteLength) {
      // В chunk может быть сразу несколько сообщений
      const messageId = new Uint8Array(data.buffer, parsedLength, 1)[0];
      console.log("messageId", messageId);
      console.log("data", data);
      switch (messageId) {
        case ClientPackageTypes.CLIENT_INFO: {
          const package = ClientInfoPackage(
            Buffer.from(data.buffer, parsedLength, 16)
          );
          parsedLength += 16;
          console.log("package", JSON.stringify(package, null, 4));
          break;
        }
        case ClientPackageTypes.PRESS_BUTTON: {
          const package = PressButtonPackage(
            Buffer.from(data.buffer, parsedLength, 2)
          );
          parsedLength += 2;
          console.log("package", JSON.stringify(package, null, 4));
          break;
        }
        default: {
          console.warn(new Error("unknow package id"));
        }
      }
    }
  });
});
server.listen(1899, "127.0.0.1");

const client = new net.Socket();
client.connect(1899, "127.0.0.1", function() {
  console.log("Connected");
});
const pressButtonPackage = PressButtonPackage();
pressButtonPackage.pressButtonIndex = 14;
client.write(Buffer.from(pressButtonPackage.buff));
client.end();
