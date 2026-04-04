const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    /** Reference to the Rider (User) who requested the ride */
    riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    /** Reference to the Driver assigned to the ride */
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
