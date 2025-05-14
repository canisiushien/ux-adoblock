require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  paths: {
    //sources: "./blockchain/contracts"
    artifacts: "../src/assets/artifacts" // pour que l'ABI soit dispo dans Angular
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545" // réseau local Hardhat
    }
  }
};