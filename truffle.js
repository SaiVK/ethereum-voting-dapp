// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // Match any network id
      gas: 4700000,
      //from: "0x6c7d12787406d21d0d03d25359f1fdf50dbd5104"
    }
  }
}
