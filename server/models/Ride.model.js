const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    pickupLocation: {
        address: { type: String, required: true },
        coordinates: { type: [Number], required: true } // [lng, lat]
    },
    destination: {
        address: { type: String, required: true },
        coordinates: { type: [Number], required: true } // [lng, lat]
    },
    distance: { type: Number }, // in km
    fare: { type: Number },
    status: {
        type: String,
        enum: ['REQUESTED', 'ACCEPTED', 'DRIVER_EN_ROUTE', 'STARTED', 'COMPLETED', 'CANCELLED'],
        default: 'REQUESTED'
    }
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
