const web3 = require('./web3-provider');
const contract = require('../ethereum/build/Registration');

const contractInstance = new web3.eth.Contract(
    JSON.parse(contract.interfcace),
    '0x123'
);

module.exports = {
    getInstance: () => contractInstance
};