// 2_deploy_contracts.js
const CarbonFootprintCalculator = artifacts.require("CarbonFootprintCalculator");

module.exports = function (deployer) {
  deployer.deploy(CarbonFootprintCalculator);
};
