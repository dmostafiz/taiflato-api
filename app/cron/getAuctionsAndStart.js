const Auction = require('../models/Auction');
const Property = require('../models/Property');

function getAuctionsAndStart(cron) {

    cron.schedule('* 0 0,2,4,6,8,10,12,14,16,18,20,22 * * *', async () => {

        console.log("Start Auction from cron: ", auctions.length)

        const auctions = await Auction.find({ status: 'pending' })

        if (auctions.length) {


            auctions.forEach(async (auction) => {

                const data = new Date()

                if (auction.startAt <= data) {

                    auction.status = 'running'
                    await auction.save()

                    const property = await Property.findById(auction.property)

                    if (property) {
                        property.isAuctioned = true
                        property.auction = auction._id
                        await property.save()
                    }
                    console.log("Auctions updated: ", auction)

                }

            })

        }

    });

}

module.exports = getAuctionsAndStart