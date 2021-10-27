const socketBidding = require("./socketBidding")
const socketBuyRequest = require("./socketBuyRequest")
const socketMessage = require("./socketMessage")

module.exports = function appSocket(io, socket, users){
  socketBidding(io, socket, users)
  socketBuyRequest(io, socket, users)
  socketMessage(io, socket, users)
}