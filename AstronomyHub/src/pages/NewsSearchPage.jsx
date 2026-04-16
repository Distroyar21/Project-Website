import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchNasaNews, analyzeNews, fetchNasaImages } from '../services/api';
import { NewsCardSkeleton } from '../components/Skeleton';

const NewsSearchPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    const getNews = async () => {
      setLoading(true);
      const results = await fetchNasaNews();
      setNews(results);
      setLoading(false);
    };
    getNews();
  }, []);

  const handleReadFull = async (item) => {
    // Normalize item for modal display
    const normalizedItem = {
      id: item.id || item.data?.[0]?.nasa_id || Math.random().toString(),
      title: item.title || item.data?.[0]?.title,
      summary: item.summary || item.data?.[0]?.description || item.data?.[0]?.summary || "No description available.",
      image_url: item.image_url || item.links?.[0]?.href || 'https://images-assets.nasa.gov/image/PIA25433/PIA25433~orig.jpg',
      news_site: item.news_site || (item.data ? 'NASA Media' : 'Space News'),
      published_at: item.published_at || item.data?.[0]?.date_created || new Date().toISOString(),
      url: item.url || (item.data?.[0]?.nasa_id ? `https://images.nasa.gov/details-${item.data[0].nasa_id}` : '#')
    };

    setSelectedItem(normalizedItem);
    setAnalysis(null);
    setRelatedItems([]);
    setAnalyzing(true);
    setLoadingRelated(true);
    
    // AI Analysis
    const result = await analyzeNews(normalizedItem.summary);
    setAnalysis(result);
    setAnalyzing(false);

    // Fetch Related Items based on top keywords
    if (result && result.keywords && result.keywords.length > 0) {
      const keyword = result.keywords[0];
      const related = await fetchNasaImages(keyword, 1, { mediaType: 'image,video' });
      // Filter out the current item if it appears in results
      const filtered = related
        .filter(r => r.data[0].title !== normalizedItem.title)
        .slice(0, 4);
      setRelatedItems(filtered);
    }
    setLoadingRelated(false);
  };

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
        <div className="space-y-12">
          {[1, 2, 3].map(i => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          {news.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row gap-8 bg-white/5 rounded-3xl p-8 border border-white/10 hover:border-purple-500/50 transition-all shadow-2xl overflow-hidden group"
            >
              <div className="w-full md:w-1/3 aspect-video md:aspect-square overflow-hidden rounded-2xl shrink-0 bg-white/5">
                <img 
                  src={item.image_url} 
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-full uppercase tracking-widest">{item.news_site || 'Space News'}</span>
                  <span className="text-gray-500 text-xs font-medium">{new Date(item.published_at).toLocaleDateString()}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors leading-tight">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-6 line-clamp-3">
                  {item.summary}
                </p>
                <button 
                  onClick={() => handleReadFull(item)}
                  className="text-blue-400 font-bold flex items-center gap-2 hover:gap-3 transition-all w-fit group/btn"
                >
                  Read Full Discovery
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal for Full News & AI Analysis */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 border border-white/10 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl scrollbar-hide"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 md:h-96">
                <img 
                  src={selectedItem.image_url} 
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-6 right-6 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors border border-white/10"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-full uppercase tracking-widest">{selectedItem.news_site || 'Space News'}</span>
                  <span className="text-gray-500 font-medium">{new Date(selectedItem.published_at).toLocaleDateString()}</span>
                </div>
                
                <h2 className="text-4xl font-bold text-white mb-8 leading-tight">{selectedItem.title}</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                  <div className="lg:col-span-3">
                    <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                      News Description
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                      {selectedItem.summary}
                    </p>
                    <div className="mt-8">
                      <a href={selectedItem.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors">
                        Read Original Article on {selectedItem.news_site || 'Source'}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col gap-8">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-fit backdrop-blur-lg">
                      <h3 className="text-purple-400 font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.364-6.364l-.707-.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M12 7a5 5 0 015 5 5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5z"/></svg>
                        AI Analysis
                      </h3>
                      
                      {analyzing ? (
                        <div className="flex flex-col items-center py-8 gap-4">
                          <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Scanning Data...</p>
                        </div>
                      ) : analysis ? (
                        <div className="space-y-8">
                          <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 opacity-60">Executive Summary</p>
                            <p className="text-sm text-gray-300 italic leading-relaxed font-medium">"{analysis.summary}"</p>
                          </div>
                          
                          <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 opacity-60">Classification</p>
                            <div className="flex flex-wrap gap-2">
                              {analysis.keywords.slice(0, 4).map(kw => (
                                <span key={kw} className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-lg border border-blue-500/20 lowercase tracking-wide">#{kw.replace(/\s+/g, '')}</span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 opacity-60">Topic Relevance</p>
                            {Object.entries(analysis.classification)
                              .sort(([,a], [,b]) => b - a)
                              .slice(0, 2)
                              .map(([label, score]) => (
                                <div key={label} className="mb-4">
                                  <div className="flex justify-between text-[10px] text-gray-400 mb-2 font-bold uppercase tracking-wider">
                                    <span>{label}</span>
                                    <span className="text-blue-400">{Math.round(score * 100)}%</span>
                                  </div>
                                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${score * 100}%` }}
                                      className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                                    />
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 text-center py-4">AI Service Unavailable</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Suggested for you section */}
                <div className="mt-12 pt-12 border-t border-white/5">
                  <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                      <i className="fas fa-sparkles text-orange-400 text-sm"></i>
                    </span>
                    Suggested for you
                  </h3>
                  
                  {loadingRelated ? (
                    <div className="flex gap-6 overflow-hidden">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-full md:w-1/3 aspect-[4/3] rounded-2xl bg-white/5 animate-pulse border border-white/5"></div>
                      ))}
                    </div>
                  ) : relatedItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {relatedItems.map((item, idx) => (
                        <motion.div
                          key={item.data[0].nasa_id + idx}
                          whileHover={{ y: -5 }}
                          className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden group hover:border-orange-500/30 transition-all cursor-pointer"
                          onClick={() => handleReadFull(item)}
                        >
                          <div className="h-32 overflow-hidden relative">
                            <img 
                              src={item.links?.[0]?.href || 'https://images-assets.nasa.gov/image/PIA25433/PIA25433~orig.jpg'} 
                              alt={item.data[0].title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {item.data[0].media_type === 'video' && (
                              <div className="absolute top-2 right-2 bg-black/60 p-1 rounded-md">
                                <i className="fas fa-play text-white text-[8px]"></i>
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-orange-400 transition-colors">
                              {item.data[0].title}
                            </h4>
                            <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-tighter">
                              {new Date(item.data[0].date_created).getFullYear()} • {item.data[0].media_type}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 bg-white/5 rounded-3xl border border-dashed border-white/10 text-center">
                      <p className="text-gray-500 text-sm italic">Analyze news for better suggestions</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewsSearchPage;
