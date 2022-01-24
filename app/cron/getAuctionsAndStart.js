const Auction = require('../models/Auction');
const Property = require('../models/Property');

function getAuctionsAndStart(cron) {

    cron.schedule('* * * * *', async () => {

        console.log("Searching auctions to start")

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