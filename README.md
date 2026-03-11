# RideFlow - Real-Time Ride Sharing Platform

RideFlow is a full-stack, real-time ride-sharing application built using the MERN stack (MongoDB, Express, React, Node.js) with Socket.io for live driver tracking and Mapbox for mapping visualization.

## Technologies Used
- **Frontend**: React (Vite), Zustand, TailwindCSS v4, Mapbox GL JS, Socket.io-client, Axios, Lucide React
- **Backend**: Node.js, Express, Socket.io, MongoDB, Mongoose, JWT, bcrypt
- **Deployment**: Local Docker Compose (MongoDB) + Node/Vite

## Getting Started

### Prerequisites
- Node.js (v18+)
- Local MongoDB or Docker installed
- Mapbox API Token

### Setup Instructions

1. **Environment Configuration**
   - Copy `server/.env.example` to `server/.env` and update variables.
   - Copy `client/.env.example` to `client/.env` and insert your Mapbox token.

2. **Starting the Database**
   ```bash
   cd docker
   docker-compose up -d
   ```

3. **Starting the Backend Server**
   ```bash
   cd server
   npm install
   npm run start
   # Server will run on http://localhost:5000
   ```

4. **Starting the Frontend Client**
   ```bash
   cd client
   npm install
   npm run dev
   # Client will run on http://localhost:5173
   ```

## Application Features Overview
- **Authentication**: Secure JWT-based registration and login system. Distinguishes between Riders and Drivers.
- **Real-Time Geolocation Matching**: Utilizes MongoDB's `$nearSphere` queries to find the closest online drivers to a rider's pickup location.
- **Live Ride Tracking**: Powered by Socket.io. Drivers stream mocked (or real device) location data to riders viewing the map.
- **Dynamic Fare Engine**: Computes distance, base fare, and time metrics to generate consistent ride pricing.
- **Beautiful UI**: Glassmorphic and modern styling using Tailwind CSS, robust state with Zustand.

## Deployment to Production
For full production deployment:
1. Use an established managed MongoDB cluster (MongoDB Atlas) with `2dsphere` indexes enabled on `currentLocation`.
2. Deploy the `server` to a platform like Heroku, Render, or an AWS EC2 instance. Ensure WebSocket support is enabled on your proxy/load balancer.
3. Build the Vite application (`npm run build`) and deploy the static assets to Vercel, Netlify, or an S3 bucket.
4. Set the `VITE_API_URL` and `VITE_SOCKET_URL` in the frontend production environment variables to point to the live backend URL.
