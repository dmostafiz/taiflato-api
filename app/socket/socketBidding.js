const Auction = require("../models/Auction")

function socketBidding(io, socket){
  

        console.log('Socket Connection Established: ')
    
        socket.on('bidToAuction', async ({ auctionId }) => {
    
            console.log("My Bidding: ", auctionId)
    
            const auction = await Auction.findById(auctionId)
                .populate(
                    [
                        {
                            path: 'property',
                            model: 'Property',
                        },
                        {
                            path: 'developer',
                            model: 'User',
                            select: { 'password': 0 },
                        },
                        {
                            path: 'bids',
                            model: 'Bid',
                            options: { sort: { 'price': -1 } },
                            populate: {
                                path: 'buyer',
                                model: 'User',
                                select: { 'password': 0 },
                            }
    
                        },
    
                    ]
                )
    
            if (auction) {
                io.emit('bidToAuction', auction)
            }
    
        })
   
    
}

module.exports = socketBidding