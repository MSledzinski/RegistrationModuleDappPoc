const registrationInstanceProvider = require('./registration-contract-provider');
const web3 = require('./web3-provider');
const utils = require('./web2-utils');

modeul.exports = {
    inviteUser: async (email, secret) => {
        
        const ownerAccount = web3.eth.getAccounts()[0];

        const emailHash = utils.hashString(email);
        const secretHash = utils.hashString(secret);

        await registrationInstanceProvider.getInstance().methods.inviteUser(emailHash, secretHash).send({ from: ownerccount });
    },

    activateMe: async (email, secret, nick) => {

        const account = web3.eth.getAccounts()[0];

        const emailHash = utils.hashString(email);
        const secretHash = utils.hashString(secret);
        const nickBytes = utils.stringToBytes(nick);

        await registrationInstanceProvider.getInstance().methods.acceptMe(emailHash, secretHash, nickBytes).send({ from: accounts });
    }
}