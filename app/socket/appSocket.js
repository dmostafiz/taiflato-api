const socketBidding = require("./socketBidding")
const socketBuyRequest = require("./socketBuyRequest")
const socketMessage = require("./socketMessage")

module.exports = function appSocket(io, socket){
  socketBidding(io, socket)
  socketBuyRequest(io, socket)
  // socketMessage(io, socket)
}