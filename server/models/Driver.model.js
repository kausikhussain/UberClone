const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    vehicleType: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    currentLocation: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
    },
    isAvailable: { type: Boolean, default: false },
    rating: { type: Number, default: 5.0 }
}, { timestamps: true });

// Create a geospatial index on currentLocation
driverSchema.index({ currentLocation: "2dsphere" });

module.exports = mongoose.model('Driver', driverSchema);
