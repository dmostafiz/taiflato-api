const twilio = require('twilio')
const twilioClient = new twilio(
    process.env.TWILLIO_ACC_SID, 
    process.env.TWILLIO_AUTH_TOKEN
);

module.exports = twilioClient

// accountSid
// authToken