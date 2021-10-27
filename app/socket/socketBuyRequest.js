const Auction = require("../models/Auction")
const User = require("../models/User")

function socketBuyRequest(io, socket, users){
  

        console.log('Socket Connection Established: ')
    
        socket.on('buyRequest', async ({ request }) => {
    
            console.log("Buy Request: ", request)

            const user = await User.findById(request.buyer)

            if(user){
                io.emit('notify', {
                    //private, group, users, public
                    sender: {
                        avatar: user.avatar,
                        name: user.username,
                        time: request.createdAt
                    },

                    type: 'private',
                    notifyTo:[request.developer],  
                    data: {
                        msg: `Hello, i want to buy an apartment from you. i am waiting for your response.`,
                        link: `/developer/buyer_requests/${request._id}`,
                        button: 'view details',
                    }
                })

            }
    
            // const auction = await Auction.findById(developer)
               
            //     .populate(
            //         [
            //             {
            //                 path: 'property',
            //                 model: 'Property',
            //             },
            //             {
            //                 path: 'developer',
            //                 model: 'User',
            //                 select: { 'password': 0 },
            //             },
            //             {
            //                 path: 'bids',
            //                 model: 'Bid',
            //                 options: { sort: { 'price': -1 } },
            //                 populate: {
            //                     path: 'buyer',
            //                     model: 'User',
            //                     select: { 'password': 0 },
            //                 }
    
            //             },
    
            //         ]
            //     )
    
            // if (auction) {

                

                  

            //     io.emit('bidToAuction', {
            //         //private, group, users, public
            //         type: 'private',
            //         notifyTo:[auction.developer._id, '6144f95ca3c65c4fa061005f'],  
            //         data: auction
            //      })

            //      io.emit('notify', {
            //         //private, group, users, public
            //         type: 'private',
            //         notifyTo:[auction.developer._id, '6144f95ca3c65c4fa061005f'],  
            //         data: {
            //             msg: `New bid of $${bidPrice} on #${auction.aid}`,
            //             link: '',
            //             button: '',
            //         }
            //      })
            // }
    
        })
   
    
}

module.exports = socketBuyRequest