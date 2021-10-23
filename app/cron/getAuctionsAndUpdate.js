const Auction = require('../models/Auction');

function getAuctionsAndUpdate(cron){

    cron.schedule('* 0 0,2,4,6,8,10,12,14,16,18,20,22 * * *', async () => {

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