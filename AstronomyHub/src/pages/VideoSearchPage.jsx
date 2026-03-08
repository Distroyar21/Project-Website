import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchYoutubeVideos } from '../services/api';

const VideoSearchPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('astronomy');
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    const results = await fetchYoutubeVideos(searchQuery);
    setVideos(results);
    setLoading(false);
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

      <div className="flex justify-center mb-16">
        <div className="search-container w-full max-w-2xl">
          <input 
            className="search-input !w-full"
            type="text" 
            placeholder="Search cosmic videos..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, idx) => (
            <motion.div
              key={video.id + idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedVideo(video)}
              className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all group shadow-2xl cursor-pointer"
            >
              <div className="relative aspect-video">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-2xl">
                    <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">{video.title}</h3>
                <p className="text-sm text-gray-500">{video.channelTitle || 'YouTube Exploration'}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Video Modal Overlay */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-md"
          onClick={() => setSelectedVideo(null)}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.5)] border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all"
              onClick={() => setSelectedVideo(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
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
