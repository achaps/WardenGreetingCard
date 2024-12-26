require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  contracts_directory: "./contracts",
  contracts_build_directory: "./build/contracts",
  migrations_directory: "./migrations",
  
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    sepolia: {
      provider: () => {
        return new HDWalletProvider({
          privateKeys: [process.env.PRIVATE_KEY],
          providerOrUrl: "https://eth-sepolia.g.alchemy.com/v2/zZD_N8NxeHGdRtAFR1dnhZpM336AmSPG",
          pollingInterval: 8000
        });
      },
      network_id: 11155111,
      gas: 8000000,
      gasPrice: 20000000000,
      confirmations: 1,
      timeoutBlocks: 50,
      skipDryRun: true,
      networkCheckTimeout: 10000,
      websockets: false
    }
  },
  
  compilers: {
    solc: {
      version: "0.8.9",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  },
  
  mocha: {
    timeout: 100000
  }
}; 