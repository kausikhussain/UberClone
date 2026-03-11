const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const Driver = require('../models/Driver.model');
const Ride = require('../models/Ride.model');

module.exports = (io) => {
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) return next(new Error('Authentication error'));
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey');
            socket.user = decoded;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user.id}`);

        // Join personal room to receive private messages
        socket.join(socket.user.id);

        // Rider requests a ride
        socket.on('request_ride', async (rideData) => {
            // Find available drivers near pickup location (using MongoDB spatial query)
            try {
                const drivers = await Driver.find({
                    isAvailable: true,
                    currentLocation: {
                        $nearSphere: {
                            $geometry: {
                                type: "Point",
                                coordinates: rideData.pickupLocation.coordinates // [lng, lat]
                            },
                            $maxDistance: 5000 // 5km search radius
                        }
                    }
                });

                // Broadcast to nearest drivers
                drivers.forEach(driver => {
                    io.to(driver.userId.toString()).emit('ride_request', rideData);
                });
            } catch (err) {
                console.error('Error finding drivers:', err);
            }
        });

        // Driver accepts the ride
        socket.on('driver_accept', async ({ rideId }) => {
            try {
                const ride = await Ride.findByIdAndUpdate(rideId, {
                    status: 'ACCEPTED',
                    driverId: socket.user.id
                }, { new: true });

                if (ride) {
                    // Notify the rider
                    io.to(ride.riderId.toString()).emit('ride_accepted', ride);

                    // Notify other drivers to clear the request
                    socket.broadcast.emit('cancel_ride_request', { rideId });
                }
            } catch (err) {
                console.error('Error accepting ride:', err);
            }
        });

        // Driver rejects the ride
        socket.on('driver_reject', ({ rideId }) => {
            // Simply notify the driver side it's rejected locally, 
            // maybe check if we need to search further if all drivers reject.
            console.log(`Driver ${socket.user.id} rejected ride ${rideId}`);
        });

        // Driver updates location during an active trip
        socket.on('driver_location_update', async ({ rideId, coordinates }) => {
            try {
                const ride = await Ride.findById(rideId);
                if (ride && ride.status !== 'COMPLETED' && ride.status !== 'CANCELLED') {
                    // Forward location to rider
                    io.to(ride.riderId.toString()).emit('driver_location', coordinates);

                    // Update DB as well
                    await Driver.findOneAndUpdate(
                        { userId: socket.user.id },
                        { currentLocation: { type: 'Point', coordinates } }
                    );
                }
            } catch (err) {
                console.error(err);
            }
        });

        socket.on('ride_status_update', async ({ rideId, status }) => {
            try {
                const ride = await Ride.findByIdAndUpdate(rideId, { status }, { new: true });
                if (ride) {
                    io.to(ride.riderId.toString()).emit('ride_status_changed', ride);
                    if (status === 'COMPLETED') {
                        await Driver.findOneAndUpdate({ userId: socket.user.id }, { isAvailable: true });
                    }
                }
            } catch (err) {
                console.error('Error updating status:', err);
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user.id}`);
        });
    });
};
