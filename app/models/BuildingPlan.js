const mongoose = require('mongoose')

const BuildingPlanSchema = mongoose.Schema({

    pid: {
        type: String
    },

    image: {
        type: String
    },

    floors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Floor'
        }
    ],

    imgDimension: {
        height: {
            type: Number
        },
        width: {
            type: Number
        }
    },

    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },

})

BuildingPlanSchema.set('timestamps', true)

// BuildingPlanSchema.plugin(random)

module.exports = mongoose.model('BuildingPlan', BuildingPlanSchema)