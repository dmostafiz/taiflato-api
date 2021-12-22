const Error = require("../app/models/Error")
const getCid = require("./getCid")

module.exports = async function errorLogger(error, type = 'Unknown'){

    const err = new Error()
    err.cid = getCid()
    err.errorType = type
    err.errorMessage = error?.message || 'Unknown error occured'
    await err.save()

} 