const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['CASH', 'CARD'], default: 'CASH' },
    status: { type: String, enum: ['PENDING', 'COMPLETED', 'FAILED'], default: 'PENDING' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
