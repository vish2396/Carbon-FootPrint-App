var migrations = artifacts.require("CarbonFootprintCalculator");

module.exports = function(deployer) {
  deployer.deploy(migrations);
};