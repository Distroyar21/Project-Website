import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ConstellationBackground from '../components/ConstellationBackground'; // 1. Import
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Interactive Constellations & Starfield */}
      <ConstellationBackground />

      {/* Your Navbar and Content sit on top */}
      <div className="relative z-10 flex flex-col min-h-screen">
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
    </div>
  );
};

export default MainLayout;