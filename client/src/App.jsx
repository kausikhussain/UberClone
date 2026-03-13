import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RiderDashboard from './pages/RiderDashboard';
import DriverDashboard from './pages/DriverDashboard';
import RideHistory from './pages/RideHistory';
import Profile from './pages/Profile';
import Toast from './components/Toast';
import Footer from './components/Footer';

// Custom PrivateRoute component
const PrivateRoute = ({ children, roleRequired }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (roleRequired && user?.role !== roleRequired) {
    return <Navigate to="/" />; // Or unauthorized page
  }

  return children;
};

// Auto route unauthenticated users away from auth pages if logged in
const AuthRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'driver' ? '/driver' : '/rider'} />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
        <Navbar />
        <main className="flex-1 w-full bg-white flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />

            <Route
              path="/rider"
              element={
                <PrivateRoute roleRequired="rider">
                  <RiderDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/driver"
              element={
                <PrivateRoute roleRequired="driver">
                  <DriverDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/history"
              element={
                <PrivateRoute>
                  <RideHistory />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
        <Toast />
      </div>
    </Router>
  );
}

export default App;
