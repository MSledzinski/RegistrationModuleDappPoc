const EWS = require('node-ews');
const NTLMAuth = require('httpntlm').ntlm;
const logger = require('./login');

const passwordPlainText = 'pass';
 
// store the ntHashedPassword and lmHashedPassword to reuse later for reconnecting
const ntHashedPassword = NTLMAuth.create_NT_hashed_password(passwordPlainText);
const lmHashedPassword = NTLMAuth.create_LM_hashed_password(passwordPlainText);
 
// exchange server connection info
const ewsConfig = {
    username: 'eee',
    nt_password: ntHashedPassword,
    lm_password: lmHashedPassword,
    host: 'https://rrr'
};

// initialize node-ews
const ews = new EWS(ewsConfig);
 
// define ews api function
const ewsFunction = 'CreateItem';
 
// define ews api function args
const produceEwsArgs = () => { 
    return {
        "attributes" : {
            "MessageDisposition" : "SendAndSaveCopy"
        },
        "SavedItemFolderId": {
            "DistinguishedFolderId": {
            "attributes": {
                "Id": "sentitems"
            }
            }
        },
        "Items" : {
            "Message" : {
            "ItemClass": "IPM.Note",
            "Subject" : "Registration information",
            "Body" : {
                "attributes": {
                "BodyType" : "Text"
                },
                "$value": "--text--"
            },
            "ToRecipients" : {
                "Mailbox" : {
                "EmailAddress" : "--receiver--"
                }
            },
            "IsRead": "false"
            }
        }
        };
};
 
module.exports = { 
    send:async (email, secret) =>
     {
         let arguments = produceEwsArgs();
         arguments.Items.Body['$value'] = `Challange secret: ${secret}`;
         arguments.Items.ToRecipients.EmailAddress = email;

         try{
            await ews.run(ewsFunction, arguments);
         }
         catch(err) {
            logger.info('Error sening mail', err);
            return false;           
         }
         return true; 
        }
};
