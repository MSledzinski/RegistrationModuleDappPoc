const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

let contractTestInstance;

mock('../services/web3-provider.js', web3);

mock('../services/registration-contract-provider.js',  {
        getInstance: () => contractTestInstance
    }
);

mock('../services/mail-sender.js', { 
    send:(email, secret) => true 
});

const compiledRegistration = require('../ethereum/build/Registration.json');
const registrationService = require('../')
let accounts;
let ownerAccount;
let registrationContract;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    ownerAccount = accounts[0];

    contractTestInstance = await new web3.eth.Contract(JSON.parse(compiledRegistration.interface))
                    .deploy({ data: compiledRegistration.bytecode })
                    .send({ from: ownerAccount, gas: '1000000' });
});

describe('full registration user journey', () => {

    it('should invite user and then activate the user', () => {


    });
});



