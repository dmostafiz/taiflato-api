const Auction = require("../models/Auction")

function socketBidding(io, socket, users){
  

        console.log('Socket Connection Established: ')
    
        socket.on('bidToAuction', async ({ auctionId, bidPrice }) => {
    
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


                io.emit('bidToAuction', {
                    //private, group, users, public
                    type: 'private',
                    notifyTo:[auction.developer._id, '6144f95ca3c65c4fa061005f'],  
                    data: auction
                 })

                 io.emit('notify', {
                    //private, group, users, public
                    type: 'private',
                    notifyTo:[auction.developer._id, '6144f95ca3c65c4fa061005f'],  
                    data: {
                        msg: `New bid of $${bidPrice} on #${auction.aid}`,
                        link: '',
                        button: '',
                    }
                 })
            }
    
        })
   
    
}

module.exports = socketBidding