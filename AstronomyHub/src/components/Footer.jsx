import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="relative mt-20 border-t border-white/5 bg-black/40 backdrop-blur-xl py-16 px-8 overflow-hidden">
      {/* Decorative stars in footer */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-1/3 w-0.5 h-0.5 bg-blue-400 rounded-full animate-pulse delay-75"></div>
          <div className="absolute top-1/2 left-10 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-150"></div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 border-2 border-blue-500 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
            </div>
            <h2 className="text-2xl font-bold header-title !text-3xl">AstronomyHub</h2>
          </div>
          <p className="text-gray-400 max-w-md leading-relaxed">
            Exploring the final frontier. Our mission is to provide the most comprehensive 
            and breathtaking look into the cosmos through data, news, and imagery.
          </p>
        </div>

        <div>
           <h3 className="text-white font-semibold mb-6">Navigation</h3>
           <ul className="space-y-4 text-gray-400 text-sm">
             <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
             <li><Link to="/videos" className="hover:text-blue-400 transition-colors">Videos</Link></li>
             <li><Link to="/images" className="hover:text-blue-400 transition-colors">Images</Link></li>
             <li><Link to="/news" className="hover:text-blue-400 transition-colors">News</Link></li>
           </ul>
        </div>

        <div>
           <h3 className="text-white font-semibold mb-6">Resources</h3>
           <ul className="space-y-4 text-gray-400 text-sm">
             <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
             <li><a href="https://api.nasa.gov/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">NASA API</a></li>
             <li><a href="#" className="hover:text-blue-400 transition-colors">Documentation</a></li>
             <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
           </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 uppercase tracking-widest font-light">
          <p>© 2026 AstronomyHub Project. All Rights Reserved.</p>
          <p className="mt-4 md:mt-0">Built for the wonders of the universe</p>
      </div>
    </footer>
  );
};

export default Footer;
