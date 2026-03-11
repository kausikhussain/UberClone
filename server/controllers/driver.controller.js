const Driver = require('../models/Driver.model');

exports.toggleAvailability = async (req, res) => {
    try {
        const driver = await Driver.findOne({ userId: req.user.id });
        if (!driver) return res.status(404).json({ message: 'Driver profile not found' });

        driver.isAvailable = !driver.isAvailable;
        await driver.save();

        res.json({ isAvailable: driver.isAvailable });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateLocation = async (req, res) => {
    try {
        const { coordinates } = req.body; // [lng, lat]
        const driver = await Driver.findOneAndUpdate(
            { userId: req.user.id },
            { currentLocation: { type: 'Point', coordinates } },
            { new: true }
        );

        if (!driver) return res.status(404).json({ message: 'Driver profile not found' });

        res.json({ currentLocation: driver.currentLocation });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
