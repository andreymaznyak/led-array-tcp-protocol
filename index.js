/* SERVER PACKAGE */
const clientPackages = require("./lib/client-packages");

const serverPackages = require("./lib/server-packages");

module.exports = {
  ClientPackageTypes: clientPackages.ClientPackageTypes,
  ClientInfoPackage: clientPackages.ClientInfoPackage,
  PressButtonPackage: clientPackages.PressButtonPackage,
  ServerPackageTypes: serverPackages.ServerPackageTypes,
  GetInfoPackage: serverPackages.GetInfoPackage,
  RestartPackage: serverPackages.RestartPackage,
  UpdateNumbersPackage: serverPackages.UpdateNumbersPackage,
  SetDigitCompletedPackage: serverPackages.SetDigitCompletedPackage
};
