const Auction = require('../models/Auction');
const Property = require('../models/Property');

function getAuctionsAndStop(cron) {

    cron.schedule('* * * * *', async () => {

        console.log("Searching auctions to stop")
        
        const auctions = await Auction.find({ status: 'running' })

        if (auctions.length) {


            auctions.forEach(async (auction) => {

                const data = new Date()

                if (auction.expireAt <= data) {
                    auction.status = 'completed'
                    await auction.save()

                    const property = await Property.findById(auction.property)

                    if (property) {
                        property.isAuctioned = false
                        // property.auction = auction._id
                        await property.save()
                    }
                    console.log("Auctions updated: ", auction)

                }

            })

        }

    });

}

module.exports = getAuctionsAndStop