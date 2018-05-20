const path = require('path');
const fs = require('fs-extra');
const random = require('random-js');
const mailSender = require('./mail-sender.js')
const hashUtils = require('./hash-utils.js');
const logger = require('./logger');
const registrationEthTxs = require('./registration-txs');

const randomEngine = random.engines.mt19937().autoSeed();

let wordsBuffer;
let randomGenerator;

const setupWordsAndCrypto = () =>{

    if(wordsBuffer !== undefined) {
        return wordsBuffer;
    }

    // NOTE: CLRF on windoes
    const wordpath = path.join(__dirname, 'words.txt');
    const words = fs.readFileSync(wordpath).toString('utf-8').split("\r\n");

    wordsBuffer = words;

    randomGenerator = random.integer(0, words.length - 1);
};

const readWords = () => {
    return wordsBuffer;
}

const generatePassphrase = (length, words) => {
    
    const generator = (value, index) => {

        // NOTE: for now it does not care about distribution or words duplication
        let r = randomGenerator(randomEngine);
        return words[r];
    };

    return Array.from(new Array(length), generator).join(" ");
};

const sendMail = (email, mnemonic) => {
    const mailSent = mailSender.send(email, mnemonic);
    return mailSent;
};

module.exports = {
    register: async (email) => {

        setupWordsAndCrypto();

        const passphrase = generatePassphrase(10, readWords());

        logger.info(`Mail: ${email} - H: ${ hashUtils.hashString(passphrase) }`);

        await registrationEthTxs.invite(email, passphrase);
        
        return sendMail(email, passphrase);
    }
};