const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Payment = require('../models/Payment.model');

router.post('/process', protect, async (req, res) => {
    try {
        const { rideId, amount, method } = req.body;

        // Simulate real payment processing delay
        setTimeout(async () => {
            const payment = await Payment.create({
                rideId,
                amount,
                method: method || 'CASH',
                status: 'COMPLETED' // MOCK: Auto Complete
            });
            res.json(payment);
        }, 1500);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
