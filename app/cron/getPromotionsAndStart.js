const Promotion = require('../models/Promotion');
const Property = require('../models/Property');

function getPromotionsAndStart(cron) {

    cron.schedule('* * * * *', async () => {

        console.log("Searching promotion to start")

        const promotions = await Promotion.find({ status: 'pending' })

        if (auctions.length) {


            promotions.map(async (promotion) => {

                const data = new Date()

                if (promotion.startAt <= data) {

                    promotion.status = 'running'
                    await promotion.save()

                    const property = await Property.findById(promotion.property)

                    if (property) {
                        property.isPromoted = true
                        property.promotion = promotion._id
                        await property.save()
                    }
                    console.log("Promotions start: ", promotion)

                }

            })

        }

    });

}

module.exports = getPromotionsAndStart