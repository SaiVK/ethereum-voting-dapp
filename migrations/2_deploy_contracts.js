var Vote = artifacts.require("./Vote.sol");

module.exports = function(deployer) {
  deployer.deploy(Vote, "", {gas:4700000});
};
