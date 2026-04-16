import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const planets = [
  {
    name: "Mercury",
    age: "4.503 billion years",
    description: "The smallest planet in our solar system and the closest to the Sun—is only slightly larger than Earth's Moon. Mercury is the fastest planet, zipping around the Sun every 88 Earth days.",
    image: "https://images-assets.nasa.gov/image/PIA15162/PIA15162~small.jpg",
    color: "from-gray-400 to-gray-600"
  },
  {
    name: "Venus",
    age: "4.503 billion years",
    description: "Spinning slowly in the opposite direction from most planets. A thick atmosphere traps heat in a runaway greenhouse effect, making it the hottest planet in our solar system.",
    image: "https://images-assets.nasa.gov/image/PIA00271/PIA00271~small.jpg",
    color: "from-orange-300 to-red-600"
  },
  {
    name: "Earth",
    age: "4.543 billion years",
    description: "Our home planet is the only place we know of so far that's inhabited by living things. It's also the only planet in our solar system with liquid water on the surface.",
    image: "https://images-assets.nasa.gov/image/PIA00122/PIA00122~small.jpg",
    color: "from-blue-400 to-green-500"
  },
  {
    name: "Mars",
    age: "4.603 billion years",
    description: "Mars is a dusty, cold, desert world with a very thin atmosphere. There is strong evidence Mars was—billions of years ago—wetter and warmer, with a thicker atmosphere.",
    image: "https://images-assets.nasa.gov/image/PIA02653/PIA02653~small.jpg",
    color: "from-red-500 to-orange-700"
  },
  {
    name: "Jupiter",
    age: "4.603 billion years",
    description: "Jupiter is more than twice as massive as the other planets of our solar system combined. The giant planet's Great Red spot is a centuries-old storm bigger than Earth.",
    image: "https://images-assets.nasa.gov/image/PIA04866/PIA04866~small.jpg",
    color: "from-orange-200 to-yellow-600"
  },
  {
    name: "Saturn",
    age: "4.503 billion years",
    description: "Adorned with a dazzling, complex system of icy rings, Saturn is unique in our solar system. The other giant planets have rings, but none are as spectacular as Saturn's.",
    image: "https://images-assets.nasa.gov/image/PIA01364/PIA01364~small.jpg",
    color: "from-yellow-200 to-yellow-500"
  },
  {
    name: "Uranus",
    age: "4.503 billion years",
    description: "Uranus is the seventh planet from the Sun, and has the third-largest diameter in our solar system. It was the first planet found with the aid of a telescope.",
    image: "https://images-assets.nasa.gov/image/PIA18182/PIA18182~small.jpg",
    color: "from-blue-200 to-cyan-400"
  },
  {
    name: "Neptune",
    age: "4.503 billion years",
    description: "Dark, cold, and whipped by supersonic winds, ice giant Neptune is the eighth and most distant major planet orbiting our Sun.",
    image: "https://images-assets.nasa.gov/image/PIA00046/PIA00046~small.jpg",
    color: "from-blue-600 to-indigo-800"
  }
];

const PlanetExplorer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.5,
      rotate: direction > 0 ? 20 : -20
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: 0
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.5,
      rotate: direction < 0 ? 20 : -20
    })
  };

  const paginate = useCallback((newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + planets.length) % planets.length);
  }, []);

  const planet = planets[currentIndex];

  return (
    <div className="w-full h-[600px] md:h-[800px] bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden relative shadow-2xl group">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
            scale: { duration: 0.6 },
            rotate: { duration: 0.6 }
          }}
          className="absolute inset-0 flex flex-col md:flex-row items-center justify-center p-8 md:p-20 gap-12"
        >
          {/* Background Glow */}
          <div className={`absolute inset-0 bg-gradient-to-br ${planet.color} opacity-10 blur-[120px] pointer-events-none`} />
          
          {/* Planet Image */}
          <motion.div 
            className="w-64 h-64 md:w-96 md:h-96 relative z-10 flex-shrink-0"
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full" />
            <img 
              src={planet.image} 
              alt={planet.name}
              className="w-full h-full object-contain mix-blend-screen drop-shadow-[0_0_80px_rgba(255,255,255,0.2)]"
              onError={(e) => {
                e.target.src = "https://images-assets.nasa.gov/image/PIA00122/PIA00122~medium.jpg";
              }}
            />
          </motion.div>

          {/* Planet Info */}
          <div className="flex flex-col items-start max-w-xl z-20">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-blue-400 font-mono tracking-widest uppercase text-sm mb-2"
            >
              Planet 0{currentIndex + 1}
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter"
            >
              {planet.name}
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 mb-6 origin-left"
            >
              <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-gray-300">
                Age: {planet.age}
              </div>
              <div className="w-12 h-px bg-white/20" />
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-300 text-lg md:text-xl leading-relaxed font-light italic"
            >
              "{planet.description}"
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-10 flex gap-4"
            >
              {/* <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-blue-400 hover:text-white transition-all transform hover:-translate-y-1 shadow-lg shadow-white/10">
                Explore {planet.name}
              </button> */}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <button 
        onClick={() => paginate(-1)}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
      >
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button 
        onClick={() => paginate(1)}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
      >
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {planets.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > currentIndex ? 1 : -1);
              setCurrentIndex(i);
            }}
            className={`transition-all duration-300 rounded-full ${i === currentIndex ? 'w-8 h-2 bg-blue-400' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`}
          />
        ))}
      </div>

      {/* Static Visual Decorations */}
      <div className="absolute top-8 right-8 z-30 flex flex-col items-end pointer-events-none opacity-40">
        <div className="text-white text-[10px] font-bold tracking-[0.5em] uppercase">Solar System</div>
        <div className="w-16 h-px bg-white/20 mt-2" />
      </div>
    </div>
  );
};

export default PlanetExplorer;
