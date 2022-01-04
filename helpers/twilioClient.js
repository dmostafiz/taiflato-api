const twilio = require('twilio')
const twilioClient = new twilio(
    'AC40426886092f8bf411327d5f461684b7', 
    '84cf61bce3031ef25c872f6d8c618f1d'
);

module.exports = twilioClient
