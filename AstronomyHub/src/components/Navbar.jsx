import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col md:flex-row items-center py-6 px-8 justify-between w-full relative z-50 bg-black/20 backdrop-blur-sm border-b border-white/5"
    >
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
          {/* Planetary SVG Logo */}
          <div className="w-12 h-12 relative group">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="navPlanetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <linearGradient id="navRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(168, 85, 247, 0)" />
                  <stop offset="50%" stopColor="rgba(255, 255, 255, 0.8)" />
                  <stop offset="100%" stopColor="rgba(96, 165, 250, 0)" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="40" fill="url(#navPlanetGrad)" opacity="0.1" className="animate-pulse" />
              <circle cx="50" cy="50" r="28" fill="url(#navPlanetGrad)" />
              <g transform="rotate(-15 50 50)">
                <ellipse cx="50" cy="50" rx="45" ry="12" fill="none" stroke="url(#navRingGrad)" strokeWidth="3" />
              </g>
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: '50px 50px' }}
              >
                <circle cx="92" cy="50" r="3" fill="#ffffff" className="logo-glow" />
              </motion.g>
            </svg>
          </div>
          <h1 className="header-title !text-2xl">AstronomyHub</h1>
        </Link>
      </div>

      <div className="flex items-center gap-8 mt-4 md:mt-0">
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-300">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/videos" className="hover:text-white transition-colors">Videos</Link>
          <Link to="/images" className="hover:text-white transition-colors">Images</Link>
          <Link to="/news" className="hover:text-white transition-colors">News</Link>
          <Link to="/chat" className="hover:text-white transition-colors flex items-center gap-2">
            AI Chat
            <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-[8px] font-bold rounded-full uppercase tracking-tighter border border-blue-500/30">New</span>
          </Link>
          {user && <Link to="/suggestions" className="hover:text-white transition-colors">Suggestions</Link>}
          <Link to="/about" className="hover:text-white transition-colors">About</Link>
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-cosmos uppercase border border-white/10 p-2 rounded-full tracking-widest">{user.username}</span>
            <button 
              className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors text-sm font-bold cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            className="btn-login cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Login / Sign Up
          </button>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
