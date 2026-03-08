import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import PlanetExplorer from '../components/PlanetExplorer';
import { fetchApod } from '../services/api';

const HomePage = () => {
  const [apod, setApod] = useState(null);

  useEffect(() => {
    const getApod = async () => {
      const data = await fetchApod();
      setApod(data);
    };
    getApod();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mt-10 md:mt-20 px-12 relative mb-20 md:mb-40">
        {/* Floating Astronaut SVG */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute -top-10 right-10 md:right-20 hidden sm:block opacity-40 pointer-events-none"
        >
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C9.24 2 7 4.24 7 7V9H17V7C17 4.24 14.76 2 12 2Z" fill="#E2E8F0"/>
            <path d="M7 10C7 9.45 7.45 9 8 9H16C16.55 9 17 9.45 17 10V18C17 18.55 16.55 19 16 19H8C7.45 19 7 18.55 7 18V10Z" fill="#CBD5E1"/>
            <circle cx="12" cy="14" r="3" fill="#94A3B8"/>
            <path d="M9 20V22H11V20H9ZM13 20V22H15V20H13Z" fill="#64748B"/>
          </svg>
        </motion.div>

        <motion.div
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 1 }}
        >
          <h1 className="text-3xl md:text-5xl font-extrabold text-white uppercase tracking-tighter">Journey Through</h1>
          <span className="text-3xl font-extrabold text-cosmos block mt-1 md:mt-2">The Cosmos</span>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-4 md:mt-6 max-w-2xl text-gray-300 text-sm md:text-lg leading-relaxed px-4"
        > 
          Discover the wonders of space exploration, celestial phenomena, and the mysteries of our universe. Join fellow astronomers in mapping the stars.
        </motion.p>
        
        {/* Stats Cards */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 w-full"
        >
          {[
            { label: "Stars Mapped", value: "10M+", color: "text-blue-400" },
            { label: "Galaxies", value: "500+", color: "text-purple-400" },
            { label: "Sky Watch", value: "24/7", color: "text-blue-400" }
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
              className="px-8 md:px-12 py-6 md:py-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/5 cursor-default transition-all shadow-xl"
            >
              <h2 className={`text-3xl md:text-4xl font-bold ${stat.color}`}>{stat.value}</h2>
              <p className="mt-1 md:mt-2 text-gray-400 md:text-gray-300 text-sm md:text-base font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* APOD Section */}
      {apod && (
        <section className="max-w-7xl mx-auto px-8 mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl bg-white/5"
          >
            <div className="flex flex-col lg:flex-row gap-12 p-8 md:p-12 items-center">
              <div className="w-full lg:w-1/2 aspect-video lg:aspect-square rounded-3xl overflow-hidden shadow-2xl relative group">
                {apod.media_type === 'image' ? (
                  <img src={apod.url} alt={apod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <iframe src={apod.url} title={apod.title} className="w-full h-full border-none" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="w-full lg:w-1/2">
                <span className="px-4 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full uppercase tracking-widest mb-6 inline-block">Astronomy Picture of the Day</span>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight group-hover:text-cosmos transition-colors">{apod.title}</h2>
                <div className="w-12 h-1 bg-blue-500/50 mb-8 rounded-full" />
                <p className="text-gray-400 text-lg leading-relaxed mb-8 line-clamp-6 italic font-light">
                  "{apod.explanation}"
                </p>
                <div className="flex items-center justify-between border-t border-white/5 pt-8">
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                    Captured on: {new Date(apod.date).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                    © {apod.copyright || 'NASA Public Domain'}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Planet Explorer Section */}
      <PlanetExplorer />

      {/* Finishing Message */}
      <div className="py-20 flex flex-col items-center justify-center text-center">
          <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="w-16 h-px bg-blue-500/30 mb-8"
          />
          <p className="text-gray-500 uppercase tracking-widest text-sm font-light">
              Endless discoveries await in the deep space
          </p>
      </div>
    </div>
  );
} 

export default HomePage;
