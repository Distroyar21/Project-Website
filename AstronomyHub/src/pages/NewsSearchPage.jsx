import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchNasaNews } from '../services/api';

const NewsSearchPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNews = async () => {
      setLoading(true);
      const results = await fetchNasaNews();
      setNews(results);
      setLoading(false);
    };
    getNews();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold header-title mb-4">Discovery Feed</h1>
        <p className="text-gray-400">Latest updates from missions across the solar system.</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-12">
          {news.map((item, idx) => (
            <motion.div
              key={item.data[0].nasa_id + idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row gap-8 bg-white/5 rounded-3xl p-8 border border-white/10 hover:border-purple-500/50 transition-all shadow-2xl overflow-hidden group"
            >
              <div className="w-full md:w-1/3 aspect-video md:aspect-square overflow-hidden rounded-2xl shrink-0">
                <img 
                  src={item.links[0].href} 
                  alt={item.data[0].title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-full uppercase tracking-widest">Space Mission</span>
                  <span className="text-gray-500 text-xs">{new Date(item.data[0].date_created).toLocaleDateString()}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">{item.data[0].title}</h3>
                <p className="text-gray-400 leading-relaxed mb-6 line-clamp-3">
                  {item.data[0].description}
                </p>
                <button className="text-blue-400 font-bold flex items-center gap-2 hover:gap-3 transition-all w-fit group/btn">
                  Read Full Discovery
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsSearchPage;
