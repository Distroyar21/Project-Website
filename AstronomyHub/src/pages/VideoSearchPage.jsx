import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchYoutubeVideos, refineSearch } from '../services/api';
import { ImageCardSkeleton } from '../components/Skeleton';

const VideoSearchPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('astronomy');
  const [language, setLanguage] = useState('en');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isRefining, setIsRefining] = useState(false);
  const [autoCorrectedQuery, setAutoCorrectedQuery] = useState(null);

  useEffect(() => {
    handleSearch(true);
  }, []);

  const handleSearch = async (isManual = true) => {
    setLoading(true);
    if (isManual) setAutoCorrectedQuery(null);
    
    // Attempt normal search first
    let results = await fetchYoutubeVideos(searchQuery, language);

    // If results seem generic or user wants to be smart (simulated empty check for YouTube is harder as it often returns something)
    // Here we primarily rely on manual refinement or proactive correction if typo is clear
    if (searchQuery.trim().length > 2 && isManual) {
      // In a real app we might check if results[0] relevance is low. 
      // For this project, let's allow manual refinement mainly, but we can do a background check.
    }

    setVideos(results);
    setLoading(false);
  };

  const handleSmartRefine = async () => {
    if (!searchQuery.trim()) return;
    setIsRefining(true);
    const refined = await refineSearch(searchQuery);
    if (refined) {
      if (refined.q) {
        setSearchQuery(refined.q);
        if (refined.correction_detected) setAutoCorrectedQuery(refined.q);
      }
      
      const results = await fetchYoutubeVideos(refined.q || searchQuery, language);
      setVideos(results);
    }
    setIsRefining(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold header-title mb-4">Space Cinema</h1>
        <p className="text-gray-400">Discover the universe through the lens of exploration.</p>
      </motion.div>

      <div className="flex flex-col items-center mb-16 gap-6">
        <div className="search-container w-full max-w-2xl flex gap-4 relative">
          <div className="relative flex-1">
            <input 
              className="search-input !w-full pr-12"
              type="text" 
              placeholder="Search cosmic videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              onClick={handleSmartRefine}
              disabled={isRefining}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-all ${isRefining ? 'animate-pulse' : ''}`}
              title="AI Smart Refine"
            >
              <i className={`fas ${isRefining ? 'fa-spinner fa-spin' : 'fa-magic'}`}></i>
            </button>
          </div>
          <button className="btn-search whitespace-nowrap px-8" onClick={() => handleSearch()}>
            Search
          </button>
        </div>

        {autoCorrectedQuery && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center gap-2 text-sm"
          >
            <span className="text-gray-500">Showing results for:</span>
            <span className="text-blue-400 font-bold italic underline decoration-blue-400/30 underline-offset-4">{autoCorrectedQuery}</span>
            <button 
              onClick={() => {setSearchQuery(autoCorrectedQuery); setAutoCorrectedQuery(null);}}
              className="text-[10px] bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20 ml-2"
            >
              keep this
            </button>
          </motion.div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <ImageCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, idx) => (
            <motion.div
              key={video.id + idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedVideo(video)}
              className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all group shadow-2xl cursor-pointer"
            >
              <div className="relative aspect-video bg-white/5">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  loading="lazy"
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                    <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-400/10 px-2 py-0.5 rounded">
                    {language === 'hi' ? 'हिन्दी' : 'Video'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors leading-tight">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-500 font-medium">{video.channelTitle || 'Cosmic Explore'}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Video Modal Overlay */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-xl"
          onClick={() => setSelectedVideo(null)}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.3)] border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/10 group"
              onClick={() => setSelectedVideo(null)}
            >
              <svg className="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
              title={selectedVideo.title}
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default VideoSearchPage;
