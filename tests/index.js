const assert = require("assert");
const mockServer = require("./mockServer");
const mockClient = require("./mockClient");
const port = 1677;
const address = "127.0.0.1";
mockServer.server.listen(port);

mockClient
  .connect(port, address)
  .then(() => {
    mockClient.sendPressButton();
    mockClient.sendClientInfo();
  })
  .catch(e => {
    console.error(e);
    throw e;
  });

setTimeout(() => {
  mockServer.sendGetInfoPackage();
  mockServer.sendRestartPackage();
  mockServer.sendUpdateNumbersPackage();
  mockServer.sendSetDigitCompletedPackage();
}, 1000);

setInterval(() => {
  mockServer.sendSetDigitCompletedPackage();
}, 5000);
console.log(`socket listen ${port}`);
