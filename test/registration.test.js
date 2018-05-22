const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const compiledRegistration = require('../ethereum/build/Registration.json');
const web3utils = require('../services/web3-utils');

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

    it('should reject invitation by user other then owner', async () => {

        const notOnwerAccount = accounts[1];

        try{
            await contractTestInstance.methods
                    .invite(web3utils.hashString('aa'), web3utils.hashString('bb'))
                    .send({ from: notOnwerAccount, gas: '1000000' });
            
            assert.fail('Did not end up in error');

        } catch (err) {
            assert.ok(err);
        }
    });

    it('should reject invitation for second time', async () => {

        try{
            await contractTestInstance.methods
                    .invite(web3utils.hashString('aa'), web3utils.hashString('bb'))
                    .send({ from: ownerAccount, gas: '1000000' });
            
            assert.ok(true, 'First invitaiton failed.');

            await contractTestInstance.methods
                    .invite(web3utils.hashString('aa'), web3utils.hashString('bb'))
                    .send({ from: ownerAccount, gas: '1000000' });

            assert.fail('Did not end up in error');
            
        } catch (err) {
            assert.ok(err);
        }
    });

    it('[e2e] should reject actiation when wrong challange secret is passed', async () => {

        const secret = "one two three four five";
        const secretHash = web3utils.hashString(secret);
        const secretBytes =  web3utils.stringToBytes(secret);

        const wrongSecret = "one two three four six";
        const wrongSecretHash = web3utils.hashString(wrongSecret);
        const wrongSecretBytes =  web3utils.stringToBytes(wrongSecret);

        const email = "test@data.com";
        const emailHash = web3utils.hashString(email);

        const nick = 'marek';
        const nickBytes = web3utils.stringToBytes(nick);

        await contractTestInstance.methods.invite(emailHash, secretHash).send({ from: ownerAccount, gas: '1000000' });

        try{
  
            await contractTestInstance.methods.activateMe(emailHash, nickBytes, wrongSecretBytes).send({ from: accounts[1], gas: '1000000' });

            assert.fail('Activation did not result in error');
        }
        catch(err) {
            assert.ok(err);
        }

        let afterActivation = await contractTestInstance.methods.isRegistered(accounts[1]).call();
        assert.ok(afterActivation === false, "Activated event called with wrong password");
    });

    it('[e2e] should allow owner to invite user and then activate account when secret is known', async () => {

        const secret = "one two three four five";
        const secretHash = web3utils.hashString(secret);
        const secretBytes =  web3utils.stringToBytes(secret);

        const email = "test@data.com";
        const emailHash = web3utils.hashString(email);

        const nick = 'marek';
        const nickBytes = web3utils.stringToBytes(nick);

        // Invite new user
        await contractTestInstance.methods.invite(emailHash, secretHash).send({ from: ownerAccount, gas: '1000000' });

        // Ensure it is not set as active after invitation
        let beferActivation = await contractTestInstance.methods.isRegistered(accounts[1]).call();
        assert.ok(beferActivation === false, "Active before activation");
       
        // Activate the invitation by user
        await contractTestInstance.methods.activateMe(emailHash, nickBytes, secretBytes).send({ from: accounts[1], gas: '1000000' });

        // Ensure user is set as active after successfull activation
        let afterActivation = await contractTestInstance.methods.isRegistered(accounts[1]).call();
        assert.ok(afterActivation === true, "Not Active after activation");
    });

    it('[e2e] should allow owner to invite user and then cancel it and then invite again', async () => {

        const secret = "one two three four five";
        const secretHash = web3utils.hashString(secret);
        const secretBytes =  web3utils.stringToBytes(secret);

        const email = "test@data.com";
        const emailHash = web3utils.hashString(email);

        const nick = 'marek';
        const nickBytes = web3utils.stringToBytes(nick);

        // Invite new user
        await contractTestInstance.methods.invite(emailHash, secretHash).send({ from: ownerAccount, gas: '1000000' });

        // Activate the invitation by user
        await contractTestInstance.methods.activateMe(emailHash, nickBytes, secretBytes).send({ from: accounts[1], gas: '1000000' });

        // Reset user data
        await contractTestInstance.methods.remove(emailHash).send({ from: ownerAccount, gas: '100000' });

        // Invite user once again 
        await contractTestInstance.methods.invite(emailHash, secretHash).send({ from: ownerAccount, gas: '1000000' });

        // Operation did not fail
        assert.ok(true);
    });
});