var cron = require('node-cron');
const Auction = require('../models/Auction');

function getAuctionsAndUpdate(){

    cron.schedule('* * * * *', async () => {

        async function getAuctions(){
            const auctions = await Auction.find({status: 'running'})
            
            if(auctions.length){

                console.log("Auctions from cron: ", auctions.length)
             
                auctions.forEach( async (auction) => {

                    const data = new Date()

                    if(auction.expireAt <= data){
                        auction.status = 'completed'
                        await auction.save()

                        console.log("Auctions updated: ", auction)

                    }

                }) 

            }

        }

        await getAuctions()

    });
    
}

module.exports = getAuctionsAndUpdate