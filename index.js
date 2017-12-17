/* SERVER PACKAGE */
const {
  ClientPackageTypes,
  ClientInfoPackage,
  PressButtonPackage
} = require("./lib/client-packages");

const {
  ServerPackageTypes,
  GetInfoPackage,
  RestartPackage,
  UpdateNumbersPackage,
  SetDigitCompletedPackage
} = require("./lib/server-packages");

module.exports = {
  ClientPackageTypes,
  ClientInfoPackage,
  PressButtonPackage,
  ServerPackageTypes,
  GetInfoPackage,
  RestartPackage,
  UpdateNumbersPackage,
  SetDigitCompletedPackage
};
