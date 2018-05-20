const registrationInstanceProvider = require('./registration-contract-provider');
const web3 = require('./web3-provider');
const hashUtils = require('hash-utils');

modeul.exports = {
    inviteUser: async (email, secret) => {
        
        const ownerAccount = web3.eth.getAccounts()[0];

        const emailHash = hashUtils.hashString(email);
        const secretHash = hashUtils.hashString(secret);

        await registrationInstanceProvider.getInstance().methods.inviteUser(emailHash, secretHash).send({ from: ownerccount });
    },

    activateMe: async (email, secret, nick) => {

        const account = web3.eth.getAccounts()[0];

        const emailHash = hashUtils.hashString(email);
        const secretHash = hashUtils.hashString(secret);
        const nickBytes = "0x1";

        await registrationInstanceProvider.getInstance().methods.acceptMe(emailHash, secretHash, nickBytes).send({ from: accounts });
    }
}