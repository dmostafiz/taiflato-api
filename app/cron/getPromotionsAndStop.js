const Promotion = require('../models/Promotion');
const Property = require('../models/Property');

function getPromotionsAndStop(cron) {

    cron.schedule('* * * * *', async () => {

        console.log("Searching promotion to stop")
        
        const promotions = await Promotion.find({ status: 'running' })

        if (promotions.length) {


            promotions.map(async (promotion) => {

                const data = new Date()

                if (promotion.expireAt <= data) {
                    promotion.status = 'completed'
                    await promotion.save()

                    const property = await Property.findById(promotion.property)

                    if (property) {
                        property.isPromoted = false
                        property.promotion = null
                        await property.save()
                    }

                    console.log("Promotions stop: ", promotion)

                }

            })

        }

    });

}

module.exports = getPromotionsAndStop