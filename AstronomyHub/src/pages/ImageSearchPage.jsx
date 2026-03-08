import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchNasaImages } from '../services/api';

const ImageSearchPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('nebula');

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    const results = await fetchNasaImages(searchQuery);
    setImages(results);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold header-title mb-4">Galactic Gallery</h1>
        <p className="text-gray-400">Capturing the raw beauty of deep space through NASA's eyes.</p>
      </motion.div>

      <div className="flex justify-center mb-16">
        <div className="search-container w-full max-w-2xl">
          <input 
            className="search-input !w-full"
            type="text" 
            placeholder="Explore nebulae, galaxies, stars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="btn-search" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((item, idx) => (
            <motion.div
              key={item.data[0].nasa_id + idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="relative rounded-2xl overflow-hidden group border border-white/10 break-inside-avoid shadow-xl"
            >
              <img 
                src={item.links[0].href} 
                alt={item.data[0].title}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                <h3 className="text-white font-bold text-lg mb-1">{item.data[0].title}</h3>
                <p className="text-gray-300 text-xs line-clamp-2">{item.data[0].description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination Placeholder */}
      <div className="mt-20 flex justify-center gap-4 pb-12">
        <button className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors cursor-not-allowed">Previous</button>
        <button className="px-6 py-2 rounded-full bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/20">1</button>
        <button className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors">Next</button>
      </div>
    </div>
  );
};

export default ImageSearchPage;
