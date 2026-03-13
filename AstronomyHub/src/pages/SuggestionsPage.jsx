import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchSuggestions } from '../services/api';
import { ImageCardSkeleton } from '../components/Skeleton';

const SuggestionsPage = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getSuggestions = async () => {
      setLoading(true);
      const data = await fetchSuggestions();
      setSuggestions(data.suggestions || []);
      setMessage(data.message || '');
      setLoading(false);
    };
    getSuggestions();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold header-title mb-4">Personalized for You</h1>
        <p className="text-gray-400">Content based on the news you've explored.</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <ImageCardSkeleton key={i} />
          ))}
        </div>
      ) : suggestions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {suggestions.map((item, idx) => (
            <motion.div
              key={item.nasaId + idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 rounded-3xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all group shadow-xl"
            >
              <div className="aspect-video overflow-hidden bg-white/5">
                <img 
                  src={item.thumbnail} 
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded-full uppercase tracking-widest">
                    {item.type}
                  </span>
                  <span className="text-gray-500 text-[10px] italic">{item.reason}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <p className="text-gray-400 mb-4">{message || "No personalized suggestions yet."}</p>
          <a href="/news" className="text-blue-400 font-bold hover:underline">Go analyze some news articles to get started!</a>
        </div>
      )}
    </div>
  );
};

export default SuggestionsPage;
