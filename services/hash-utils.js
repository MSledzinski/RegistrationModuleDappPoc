const Web3 = require('web3');
const web3 = new Web3();

const encodeWithPadding = size => value => {
    return typeof value === 'string'
      // non-hex string
      ? web3.toHex(value)
      // numbers, big numbers, and hex strings
      : encodeNum(size)(value)
  }

module.exports = {

    hashString: (data) => {

        if(typeof data !== 'string') {
            throw new Error(`expecting argument of type string, but got: ${typeof data}`);
        }

        return web3.utils.soliditySha3(data); 
    }
};