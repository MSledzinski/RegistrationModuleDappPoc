const Web3 = require('web3');
const web3 = new Web3();

module.exports = {
    
    hashString: (data) => {

        if(typeof data !== 'string') {
            throw new Error(`expecting argument of type string, but got: ${typeof data}`);
        }

        return web3.utils.soliditySha3(data); 
    },

    stringToBytes: (data) => {
        
        if(typeof data !== 'string') {
            throw new Error(`expecting argument of type string, but got: ${typeof data}`);
        }

        return web3.utils.asciiToHex(data);
    },

    bytesToString: (bytes) => {

        return web3.utils.toUtf8(bytes);
    }
};