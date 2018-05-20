const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const compiledRegistration = require('../ethereum/build/Registration.json');
const hashUtils = require('../services/hash-utils');

let contractTestInstance;

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

describe('Regsitration contract tests', () => {

    it('should deploy properly', () => {

        assert.ok(contractTestInstance.options.address);
    });

    it('should allow owner to inveite user and then activate account when secret is known', async () => {

        const secret = "one two three four five";
        const secretHash = hashUtils.hashString(secret);
        const secretBytes =  web3.utils.asciiToHex(secret);

        const email = "test@data.com";
        const emailHash = hashUtils.hashString(email);

        const nick = 'marek';
        const nickBytes = web3.utils.asciiToHex(nick);

        // invite 
        await contractTestInstance.methods.invite(emailHash, secretHash).send({ from: ownerAccount, gas: '1000000' });

        let beferActivation = await contractTestInstance.methods.isRegistered(accounts[1]).call();
 
        assert.ok(beferActivation === false, "Active before activation");
       
        // accept
        await contractTestInstance.methods.activateMe(emailHash, nickBytes, secretBytes).send({ from: accounts[1], gas: '1000000' });

        // confirm
        try{
        let afterActivation = await contractTestInstance.methods.isRegistered(accounts[1]).call();

        assert.ok(afterActivation === true, "Not Active after activation");
        }
        catch(err) {
            console.log(err);

            assert.fail();
        }
    });
});