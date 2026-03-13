import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchNasaImages } from '../services/api';
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
        <div className="search-container w-full max-w-2xl flex gap-4">
          <input 
            className="search-input !w-full"
            type="text" 
            placeholder="Explore nebulae, galaxies, stars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(1)}
          />
          <button className="btn-search whitespace-nowrap" onClick={() => handleSearch(1)}>
            Search
          </button>
          <button 
            className={`px-4 py-2 rounded-xl border transition-all ${showFilters ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-white/5 border-white/10 text-gray-400'}`}
            onClick={() => setShowFilters(!showFilters)}
            title="Refine Results"
          >
            <i className="fas fa-filter"></i>
          </button>
        </div>

        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="w-full max-w-2xl mt-6 p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap gap-6"
          >
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">Media Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="mediaType" 
                    value="image,video" 
                    checked={mediaType === 'image,video'} 
                    onChange={(e) => setMediaType(e.target.value)}
                    className="accent-blue-500"
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">All</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="mediaType" 
                    value="image" 
                    checked={mediaType === 'image'} 
                    onChange={(e) => setMediaType(e.target.value)}
                    className="accent-blue-500"
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Images</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="mediaType" 
                    value="video" 
                    checked={mediaType === 'video'} 
                    onChange={(e) => setMediaType(e.target.value)}
                    className="accent-blue-500"
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Videos</span>
                </label>
              </div>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">Year Range</label>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  placeholder="Start" 
                  className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white w-24 focus:border-blue-500 outline-none"
                  value={yearStart}
                  onChange={(e) => setYearStart(e.target.value)}
                />
                <span className="text-gray-500">to</span>
                <input 
                  type="number" 
                  placeholder="End" 
                  className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white w-24 focus:border-blue-500 outline-none"
                  value={yearEnd}
                  onChange={(e) => setYearEnd(e.target.value)}
                />
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
                className="relative rounded-2xl overflow-hidden group border border-white/10 break-inside-avoid shadow-xl bg-white/5"
              >
                {item.data[0].media_type === 'video' && (
                  <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                    <i className="fas fa-video text-blue-400 text-xs"></i>
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Video</span>
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
    </div>
  );
};

export default ImageSearchPage;
