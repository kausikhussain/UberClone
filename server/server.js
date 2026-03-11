const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const rideRoutes = require('./routes/ride.routes');
const driverRoutes = require('./routes/driver.routes');
const paymentRoutes = require('./routes/payment.routes');
const socketHandler = require('./sockets/socket');

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ride', rideRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/payment', paymentRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://admin:password@localhost:27017/rideflow?authSource=admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Initialized Successfully'))
    .catch((err) => console.log('MongoDB Connection Failed:', err.message));

// Sockets
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || '*',
        methods: ['GET', 'POST']
    }
});
socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Backend Server listening at http://localhost:${PORT}`));
