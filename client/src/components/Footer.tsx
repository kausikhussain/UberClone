import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const location = useLocation();

  // Hide footer on map-heavy dashboard pages
  if (['/rider', '/driver'].includes(location.pathname)) return null;

  return (
    <footer className="bg-black text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold mb-4 hover:opacity-80 transition-opacity">
            <div className="bg-white text-black p-1.5 rounded-lg flex items-center justify-center">
              <Car size={24} />
            </div>
            <span>RideFlow</span>
          </Link>
          <p className="text-gray-400 text-sm mb-6">
            Connecting riders and drivers in real-time. Experience the next generation of seamless transportation.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-4">Company</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Our Offerings</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Newsroom</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Investors</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-4">Products</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link to="/rider" className="hover:text-white transition-colors">Ride</Link></li>
            <li><Link to="/driver" className="hover:text-white transition-colors">Drive</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">RideFlow for Business</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Airfares</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-4">Global Citizenship</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Safety</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Diversity and Inclusion</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} RideFlow Technologies Inc.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Accessibility</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
