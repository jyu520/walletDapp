module.exports = {
  networks: {
      development: {
          host: '127.0.0.1',  // Change if developing on a test net
          port: 8545,         // Change this (defaults: Ganache 7545, TestRPC 8545, truffle 9545) 
          network_id: '*'     // Match any network id
      },
      kovan: {
        host: "127.0.0.1",
        port: 8180,
        network_id: 42,
        gas: 4700000
      }
  }
};