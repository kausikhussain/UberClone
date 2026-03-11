const Ride = require('../models/Ride.model');
const Driver = require('../models/Driver.model');

// Basic fare calculation
const calculateFare = (distanceInKm) => {
    const baseFare = 50;
    const ratePerKm = 15;
    const timeCharge = 10; // Assuming roughly 10 Rs time charge
    return Math.round(baseFare + (distanceInKm * ratePerKm) + timeCharge);
};

// Calculate distance (Haversine formula simplified for testing, ideally use Mapbox/Google matrix)
const getDistance = (loc1, loc2) => {
    const dx = loc1[0] - loc2[0];
    const dy = loc1[1] - loc2[1];
    return Math.sqrt(dx * dx + dy * dy) * 111; // Approx km for coordinates distance
};

exports.requestRide = async (req, res) => {
    try {
        const { pickupLocation, destination, distance } = req.body;

        // Fallback if frontend didn't send distance
        const calcDistance = distance || getDistance(pickupLocation.coordinates, destination.coordinates);
        const fare = calculateFare(calcDistance);

        const ride = await Ride.create({
            riderId: req.user.id,
            pickupLocation,
            destination,
            distance: calcDistance,
            fare,
            status: 'REQUESTED'
        });

        res.status(201).json(ride);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRideStatus = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id)
            .populate('driverId', 'vehicleType vehicleNumber licenseNumber rating currentLocation')
            .populate({ path: 'driverId', populate: { path: 'userId', select: 'name phone' } });

        if (!ride) return res.status(404).json({ message: 'Ride not found' });
        res.json(ride);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDriverRides = async (req, res) => {
    try {
        const driver = await Driver.findOne({ userId: req.user.id });
        if (!driver) return res.status(404).json({ message: 'Driver profile not found' });

        const rides = await Ride.find({ driverId: driver._id }).sort({ createdAt: -1 });
        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRiderRides = async (req, res) => {
    try {
        const rides = await Ride.find({ riderId: req.user.id }).sort({ createdAt: -1 });
        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
