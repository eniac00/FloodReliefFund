const FloodReliefFund = artifacts.require("FloodReliefFund");

module.exports = function (deployer) {
  require('dotenv').config();
  deployer.deploy(FloodReliefFund, process.env.SYLHET_ADDRESS, process.env.CHITTAGONGSOUTH_ADDRESS, process.env.CHITTAGONGNORTH_ADDRESS);
};
