const net = require("net");

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

const sockets = [];

const server = net.createServer(function(socket) {
  console.log("new socket ", socket.address());
  sockets.push(socket);
  socket.on("close", had_error => {
    const foundIndex = sockets.indexOf(socket);
    if (foundIndex >= 0) {
      sockets.splice(foundIndex, 1);
    } else {
      console.warn(new Error("not found socket on close", socket));
    }
    console.log("close had_error", had_error);
  });
  socket.on("connect", () => {
    console.log("connect socket");
  });
  socket.on("data", data => {
    console.log("get chunk");
    console.log("length", data.length, data.byteLength);
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
  socket.on("drain", () => console.log("socket drain"));
  socket.on("end", () => console.log("socket end"));
  socket.on("error", err => console.log("socket error", err));
  socket.on("lookup", (err, address, family, host) =>
    console.log(
      "socket lookup",
      "err:",
      err,
      "address:",
      address,
      "family:",
      family,
      "host:",
      host
    )
  );
  socket.on("timeout", () => console.log("socket timeout"));

  // socket.pipe(socket);
});

module.exports = {
  server,
  sendGetInfoPackage() {
    sockets.forEach(socket => {
      const package = GetInfoPackage();
      socket.write(new Buffer(package.buff));
    });
  },
  sendRestartPackage() {
    sockets.forEach(socket => {
      const package = RestartPackage();
      socket.write(new Buffer(package.buff));
    });
  },
  sendUpdateNumbersPackage() {
    sockets.forEach(socket => {
      const package = UpdateNumbersPackage();
      for (let i = 0; i < 24; i++) {
        package.setClient(i, i * 100, Math.floor(Math.random() * 2)); //  Math.floor(Math.random() * 10000)
      }
      console.log(JSON.stringify(package));
      socket.write(new Buffer(package.buff));
    });
  },
  sendSetDigitCompletedPackage() {
    sockets.forEach(socket => {
      const package = SetDigitCompletedPackage();
      package.setComplete(Math.floor(Math.random() * 24), true);
      socket.write(new Buffer(package.buff));
    });
  }
};
