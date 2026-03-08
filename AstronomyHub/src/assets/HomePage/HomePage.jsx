import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import PlanetExplorer from '../../components/PlanetExplorer';

const HomePage = ({ onLoginClick }) => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    // Generate fewer but optimized stars
    const starCount = 100;
    const newStars = Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 2}px`, 
      duration: `${Math.random() * 4 + 2}s`,
      delay: `${Math.random() * 5}s`
    }));
    setStars(newStars);
  }, []);

  return (
    <>
      {/* Starry Background */}
      <div className="stars-container">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              '--duration': star.duration,
              animationDelay: star.delay,
              willChange: 'transform, opacity'
            }}
          />
        ))}
      </div>

      <div className="content-layer">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row items-center py-6 justify-between w-full"
        >
          <div className="flex items-center gap-4">
            {/* Planetary SVG Logo */}
            <div className="w-14 h-14 relative group">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="planetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(168, 85, 247, 0)" />
                    <stop offset="50%" stopColor="rgba(255, 255, 255, 0.8)" />
                    <stop offset="100%" stopColor="rgba(96, 165, 250, 0)" />
                  </linearGradient>
                </defs>
                
                {/* Background Stars/Glow */}
                <circle cx="50" cy="50" r="40" fill="url(#planetGrad)" opacity="0.1" className="animate-pulse" />
                
                {/* Planet Body */}
                <motion.circle 
                  cx="50" cy="50" r="28" 
                  fill="url(#planetGrad)"
                  whileHover={{ scale: 1.1 }}
                />
                
                {/* Planet Surface Detail */}
                <ellipse cx="45" cy="45" rx="10" ry="5" fill="white" opacity="0.1" transform="rotate(-20 45 45)" />
                
                {/* Planetary Rings */}
                <g transform="rotate(-15 50 50)">
                  <ellipse 
                    cx="50" cy="50" rx="45" ry="12" 
                    fill="none" 
                    stroke="url(#ringGrad)" 
                    strokeWidth="3" 
                  />
                  <ellipse 
                    cx="50" cy="50" rx="40" ry="10" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="0.5" 
                    opacity="0.3"
                  />
                </g>

                {/* Orbiting Moon */}
                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: '50px 50px' }}
                >
                  <circle cx="92" cy="50" r="3" fill="#ffffff" className="logo-glow" />
                </motion.g>
              </svg>
            </div>
            <h1 className="header-title">Astronomy Knowledge Hub</h1>
          </div>

          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <div className="search-container">
              <input 
                className="search-input"
                type="text" 
                placeholder="Search mysteries..."
              />
              <button className="btn-search">
                Search
              </button>
            </div>

            <button 
              className="btn-login"
              onClick={onLoginClick}
            >
              Login / Sign Up
            </button>
          </div>
        </motion.div>

        {/* Hero Section */}
        <section className="flex flex-col items-center text-center mt-10 md:mt-20 px-6 relative mb-20 md:mb-40">
          {/* Floating Astronaut SVG */}
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute -top-10 right-10 md:right-20 hidden sm:block opacity-40 pointer-events-none"
          >
            <svg width="80" height="80" md:width="120" md:height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C9.24 2 7 4.24 7 7V9H17V7C17 4.24 14.76 2 12 2Z" fill="#E2E8F0"/>
              <path d="M7 10C7 9.45 7.45 9 8 9H16C16.55 9 17 9.45 17 10V18C17 18.55 16.55 19 16 19H8C7.45 19 7 18.55 7 18V10Z" fill="#CBD5E1"/>
              <circle cx="12" cy="14" r="3" fill="#94A3B8"/>
              <path d="M9 20V22H11V20H9ZM13 20V22H15V20H13Z" fill="#64748B"/>
            </svg>
          </motion.div>

          <motion.div
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 1 }}
          >
            <h1 className="text-3xl md:text-5xl font-extrabold text-white uppercase tracking-tighter">Journey Through</h1>
            <span className="text-3xl font-extrabold text-cosmos block mt-1 md:mt-2">The Cosmos</span>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-4 md:mt-6 max-w-2xl text-gray-300 text-sm md:text-lg leading-relaxed px-4"
          > 
            Discover the wonders of space exploration, celestial phenomena, and the mysteries of our universe. Join fellow astronomers in mapping the stars.
          </motion.p>
          
          {/* Stats Cards */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 w-full"
          >
            {[
              { label: "Stars Mapped", value: "10M+", color: "text-blue-400" },
              { label: "Galaxies", value: "500+", color: "text-purple-400" },
              { label: "Sky Watch", value: "24/7", color: "text-blue-400" }
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                className="px-8 md:px-12 py-6 md:py-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/5 cursor-default transition-all shadow-xl"
              >
                <h2 className={`text-3xl md:text-4xl font-bold ${stat.color}`}>{stat.value}</h2>
                <p className="mt-1 md:mt-2 text-gray-400 md:text-gray-300 text-sm md:text-base font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Planet Explorer Section */}
        <PlanetExplorer />

        {/* Footer/Coming Soon */}
        <div className="py-32 flex flex-col items-center justify-center text-center">
            <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="w-16 h-px bg-blue-500/30 mb-8"
            />
            <p className="text-gray-500 uppercase tracking-widest text-sm font-light">
                More planets coming soon to your galaxy
            </p>
        </div>
      </div>
    </>
  );
} 

export default HomePage;