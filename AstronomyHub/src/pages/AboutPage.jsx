import React from 'react';
import { motion } from 'framer-motion';

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-8 py-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-20"
      >
        <span className="text-blue-400 font-bold uppercase tracking-widest text-sm">About Our Mission</span>
        <h1 className="text-5xl font-extrabold header-title !text-6xl mt-4 mb-8">Democratizing Space</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          AstronomyHub is dedicated to making the wonders of the universe accessible to everyone, from amateur stargazers to professional astronomers.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-40">
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">Our Vision</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            We believe that looking at the stars unites us. By providing tools to search for images, videos, and the latest news from space agencies like NASA, we hope to inspire the next generation of explorers.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Every discovery counts. Whether it's a new exoplanet or a beautiful nebula, we want to bring it straight to your screen with a premium, immersive experience.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative group"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-black/40 border border-white/10 rounded-2xl p-1 overflow-hidden">
             <img 
               src="https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&q=80&w=1000" 
               alt="Space exploration" 
               className="rounded-xl grayscale hover:grayscale-0 transition-all duration-700"
             />
          </div>
        </motion.div>
      </div>

      <div className="bg-white/5 rounded-3xl p-12 text-center border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-4">Join the Stargazers</h2>
        <p className="text-gray-400 mb-8 max-w-lg mx-auto">Subscribe to our newsletter for weekly cosmic updates and newly discovered celestial objects.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input className="bg-black/40 border border-white/10 rounded-full px-6 py-3 text-white outline-none focus:border-blue-500 transition-all flex-grow" placeholder="Email address" />
          <button className="btn-search whitespace-nowrap px-8">Subscribe</button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
