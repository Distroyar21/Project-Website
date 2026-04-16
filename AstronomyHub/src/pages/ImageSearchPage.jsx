import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchNasaImages, refineSearch, fetchNasaAsset } from '../services/api';
import { ImageCardSkeleton } from '../components/Skeleton';

const ImageSearchPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('nebula');
  const [mediaType, setMediaType] = useState('image,video');
  const [yearStart, setYearStart] = useState('');
  const [yearEnd, setYearEnd] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [assetUrl, setAssetUrl] = useState('');
  const [isLoadingAsset, setIsLoadingAsset] = useState(false);

  useEffect(() => {
    handleSearch(1);
  }, []);

  const handleSearch = async (page = 1) => {
    setLoading(true);
    setCurrentPage(page);
    const results = await fetchNasaImages(searchQuery, page, {
      mediaType,
      yearStart,
      yearEnd
    });
    setImages(results);
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (direction) => {
    if (direction === 'next') {
      handleSearch(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      handleSearch(currentPage - 1);
    }
  };

  const handleSmartRefine = async () => {
    if (!searchQuery.trim()) return;
    setIsRefining(true);
    const refined = await refineSearch(searchQuery);
    if (refined) {
      if (refined.q) setSearchQuery(refined.q);
      if (refined.year_start) setYearStart(refined.year_start);
      if (refined.year_end) setYearEnd(refined.year_end);
      if (refined.media_type) setMediaType(refined.media_type);
      
      // Auto trigger search with refined params
      const results = await fetchNasaImages(refined.q || searchQuery, 1, {
        mediaType: refined.media_type || mediaType,
        yearStart: refined.year_start || yearStart,
        yearEnd: refined.year_end || yearEnd
      });
      setImages(results);
      setCurrentPage(1);
    }
    setIsRefining(false);
  };

  const handleItemClick = async (item) => {
    setSelectedItem(item);
    setAssetUrl('');
    
    if (item.data[0].media_type === 'video') {
      setIsLoadingAsset(true);
      const assetData = await fetchNasaAsset(item.data[0].nasa_id);
      if (assetData && assetData.collection.items.length > 0) {
        // Find the best quality mp4
        const videoUrl = assetData.collection.items.find(asset => asset.href.endsWith('~orig.mp4'))?.href || 
                         assetData.collection.items.find(asset => asset.href.endsWith('.mp4'))?.href;
        setAssetUrl(videoUrl);
      }
      setIsLoadingAsset(false);
    }
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

      <div className="flex flex-col items-center mb-16">
        <div className="search-container w-full max-w-2xl flex gap-3">
          <div className="relative flex-1">
            <input 
              className="search-input !w-full pr-12"
              type="text" 
              placeholder="Explore nebulae, galaxies, stars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(1)}
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
          <button className="btn-search whitespace-nowrap px-8" onClick={() => handleSearch(1)}>
            Search
          </button>
          <button 
            className={`px-4 py-2 rounded-xl border transition-all ${showFilters ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}
            onClick={() => setShowFilters(!showFilters)}
            title="Refine Results"
          >
            <i className="fas fa-sliders-h"></i>
          </button>
        </div>

        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mt-4 p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap gap-8 backdrop-blur-md"
          >
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-4 tracking-[0.2em]">Media Type</label>
              <div className="flex gap-6">
                {['image,video', 'image', 'video'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="mediaType" 
                      value={type} 
                      checked={mediaType === type} 
                      onChange={(e) => setMediaType(e.target.value)}
                      className="hidden"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${mediaType === type ? 'border-blue-500 bg-blue-500/20' : 'border-white/20'}`}>
                      {mediaType === type && <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
                    </div>
                    <span className={`text-sm tracking-wide transition-colors ${mediaType === type ? 'text-white font-bold' : 'text-gray-400 group-hover:text-gray-200'}`}>
                      {type === 'image,video' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-4 tracking-[0.2em]">Launch/Release Window</label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input 
                    type="number" 
                    placeholder="2010" 
                    className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white w-full focus:border-blue-500 outline-none transition-all"
                    value={yearStart}
                    onChange={(e) => setYearStart(e.target.value)}
                  />
                  <span className="absolute -top-2 left-3 px-1 text-[8px] font-bold bg-[#0A0A0B] text-gray-500 uppercase">From</span>
                </div>
                <div className="h-px w-4 bg-white/10"></div>
                <div className="relative flex-1">
                  <input 
                    type="number" 
                    placeholder="2024" 
                    className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white w-full focus:border-blue-500 outline-none transition-all"
                    value={yearEnd}
                    onChange={(e) => setYearEnd(e.target.value)}
                  />
                  <span className="absolute -top-2 left-3 px-1 text-[8px] font-bold bg-[#0A0A0B] text-gray-500 uppercase">To</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {loading ? (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ImageCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {images.length > 0 ? images.map((item, idx) => (
              <motion.div
                key={item.data[0].nasa_id + idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleItemClick(item)}
                className="relative rounded-2xl overflow-hidden group border border-white/10 break-inside-avoid shadow-xl bg-white/5 cursor-pointer"
              >
                {item.data[0].media_type === 'video' && (
                  <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                    <i className="fas fa-video text-blue-400 text-xs"></i>
                  </div>
                )}
                <img 
                  src={item.links?.[0]?.href || 'https://images-assets.nasa.gov/image/PIA25433/PIA25433~orig.jpg'} 
                  alt={item.data[0].title}
                  loading="lazy"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 min-h-[200px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-400/10 px-2 py-0.5 rounded">
                      {new Date(item.data[0].date_created).getFullYear()}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1 leading-tight text-shadow">{item.data[0].title}</h3>
                  <p className="text-gray-300 text-xs line-clamp-2 font-medium opacity-80">{item.data[0].description}</p>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 text-lg">No results found for your refined search.</p>
                <button 
                  onClick={() => {setSearchQuery('nebula'); setMediaType('image,video'); setYearStart(''); setYearEnd(''); handleSearch(1);}}
                  className="mt-4 text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>

          <div className="mt-20 flex justify-center items-center gap-6 pb-12">
            <button 
              onClick={() => handlePageChange('prev')}
              disabled={currentPage === 1}
              className={`px-6 py-2 rounded-full transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed bg-white/5 text-gray-500' : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'}`}
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              <span className="text-blue-400 font-bold text-lg">{currentPage}</span>
              <span className="text-gray-500 mx-1">/</span>
              <span className="text-gray-500 text-sm italic">Galaxy Depth</span>
            </div>
            <button 
              onClick={() => handlePageChange('next')}
              className="px-8 py-2 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-500 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-xl"
          onClick={() => setSelectedItem(null)}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-6xl max-h-[90vh] bg-gray-900 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.3)] border border-white/10 flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/10"
              onClick={() => setSelectedItem(null)}
            >
              <i className="fas fa-times"></i>
            </button>

            <div className="flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px]">
              {selectedItem.data[0].media_type === 'video' ? (
                isLoadingAsset ? (
                  <div className="flex flex-col items-center gap-4 text-gray-400">
                    <i className="fas fa-spinner fa-spin text-3xl text-blue-500"></i>
                    <p className="text-xs font-bold uppercase tracking-widest">Warping to NASA Servers...</p>
                  </div>
                ) : assetUrl ? (
                  <video 
                    src={assetUrl} 
                    controls 
                    autoPlay 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="p-10 text-center">
                    <p className="text-gray-500">Satellite link failed. Video not available.</p>
                  </div>
                )
              ) : (
                <img 
                  src={selectedItem.links?.[0]?.href || 'https://images-assets.nasa.gov/image/PIA25433/PIA25433~orig.jpg'} 
                  alt={selectedItem.data[0].title}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="w-full md:w-[400px] p-8 overflow-y-auto bg-gray-900 border-l border-white/5 space-y-6">
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] bg-blue-400/10 px-3 py-1 rounded-full mb-4 inline-block">
                  {selectedItem.data[0].media_type}
                </span>
                <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{selectedItem.data[0].title}</h2>
                <p className="text-sm text-gray-500 font-medium">NASA ID: {selectedItem.data[0].nasa_id}</p>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-2">Description</label>
                <div className="text-gray-300 text-sm leading-relaxed max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedItem.data[0].description}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-wider">Created</p>
                  <p className="text-sm font-bold text-white">{new Date(selectedItem.data[0].date_created).toDateString()}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-wider">Center</p>
                  <p className="text-sm font-bold text-white">{selectedItem.data[0].center}</p>
                </div>
              </div>

              <a 
                href={selectedItem.links?.[0]?.href} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/20"
              >
                <span>View Original Asset</span>
                <i className="fas fa-external-link-alt text-xs"></i>
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ImageSearchPage;
