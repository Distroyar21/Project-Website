import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const MainLayout = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
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
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Universal Starry Background */}
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

      <Navbar />
      
      <main className="flex-grow content-layer">
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
