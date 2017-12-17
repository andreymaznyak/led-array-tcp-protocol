const net = require("net");
const port = 1337;
const { ClientInfoPackage, ClientPackageTypes } = require("./protocol");

const server = net.createServer(function(socket) {
  // on(event: "close", listener: (had_error: boolean) => void): this;
  // on(event: "connect", listener: () => void): this;
  // on(event: "data", listener: (data: Buffer) => void): this;
  // on(event: "drain", listener: () => void): this;
  // on(event: "end", listener: () => void): this;
  // on(event: "error", listener: (err: Error) => void): this;
  // on(event: "lookup", listener: (err: Error, address: string, family: string | number, host: string) => void): this;
  // on(event: "timeout", listener: () => void): this;
  socket.write("Echo serverrn");
  console.log();
  socket.on("data", data => {
    const messageId = new Uint8Array(data.buffer, 0, 1)[0];
    console.log("messageId", messageId);
    console.log("length", data.length);
    switch (messageId) {
      case ClientPackageTypes.CLIENT_INFO: {
        const package = ClientInfoPackage(data);
        console.log("package", JSON.stringify(package, null, 4));
      }
      case ClientPackageTypes.PRESS_BUTTON: {
      }
    }
    console.log("data", data.byteLength);
  });
  socket.on("close", status => {
    console.log("close", status);
  });

  // socket.pipe(socket);
});

server.listen(port, "127.0.0.1");

console.log(`socket listen ${port}`);
