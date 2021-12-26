const mongoose = require('mongoose')

const AppointmentSchema = mongoose.Schema({

    cid: {
        type: String
    },

    members: {
        type: Array
    },

    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    developer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    thread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Threed'
    },

    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    },

    appointmentDate: {
        type: Date
    },

    text: {
        type: String
    },

    status: {
        type: String,
        enum: ['pending', 'accepted', 'completed'],
        default: 'accepted'
    },
})

AppointmentSchema.set('timestamps', true)

module.exports = mongoose.model('Appointment', AppointmentSchema)