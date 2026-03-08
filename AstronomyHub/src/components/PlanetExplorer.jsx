import React from 'react';
import { motion } from 'framer-motion';

const planets = [
  {
    name: "Mercury",
    age: "4.503 billion years",
    description: "The smallest planet in our solar system and the closest to the Sun—is only slightly larger than Earth's Moon. Mercury is the fastest planet, zipping around the Sun every 88 Earth days.",
    image: "https://images-assets.nasa.gov/image/PIA15162/PIA15162~orig.jpg",
    color: "from-gray-400 to-gray-600"
  },
  {
    name: "Venus",
    age: "4.503 billion years",
    description: "Spinning slowly in the opposite direction from most planets. A thick atmosphere traps heat in a runaway greenhouse effect, making it the hottest planet in our solar system.",
    image: "https://images-assets.nasa.gov/image/PIA00271/PIA00271~orig.jpg",
    color: "from-orange-300 to-red-600"
  },
  {
    name: "Earth",
    age: "4.543 billion years",
    description: "Our home planet is the only place we know of so far that's inhabited by living things. It's also the only planet in our solar system with liquid water on the surface.",
    image: "https://images-assets.nasa.gov/image/PIA00122/PIA00122~orig.jpg",
    color: "from-blue-400 to-green-500"
  },
  {
    name: "Mars",
    age: "4.603 billion years",
    description: "Mars is a dusty, cold, desert world with a very thin atmosphere. There is strong evidence Mars was—billions of years ago—wetter and warmer, with a thicker atmosphere.",
    image: "https://images-assets.nasa.gov/image/PIA02653/PIA02653~orig.jpg",
    color: "from-red-500 to-orange-700"
  },
  {
    name: "Jupiter",
    age: "4.603 billion years",
    description: "Jupiter is more than twice as massive as the other planets of our solar system combined. The giant planet's Great Red spot is a centuries-old storm bigger than Earth.",
    image: "https://images-assets.nasa.gov/image/PIA04866/PIA04866~orig.jpg",
    color: "from-orange-200 to-yellow-600"
  },
  {
    name: "Saturn",
    age: "4.503 billion years",
    description: "Adorned with a dazzling, complex system of icy rings, Saturn is unique in our solar system. The other giant planets have rings, but none are as spectacular as Saturn's.",
    image: "https://images-assets.nasa.gov/image/PIA01364/PIA01364~orig.jpg",
    color: "from-yellow-200 to-yellow-500"
  },
  {
    name: "Uranus",
    age: "4.503 billion years",
    description: "Uranus is the seventh planet from the Sun, and has the third-largest diameter in our solar system. It was the first planet found with the aid of a telescope.",
    image: "https://images-assets.nasa.gov/image/PIA18182/PIA18182~orig.jpg",
    color: "from-blue-200 to-cyan-400"
  },
  {
    name: "Neptune",
    age: "4.503 billion years",
    description: "Dark, cold, and whipped by supersonic winds, ice giant Neptune is the eighth and most distant major planet orbiting our Sun.",
    image: "https://images-assets.nasa.gov/image/PIA00046/PIA00046~orig.jpg",
    color: "from-blue-600 to-indigo-800"
  }
];

const PlanetExplorer = () => {
  return (
    <div className="w-full h-[600px] md:h-[800px] bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden relative shadow-2xl">
      <div 
        className="h-full overflow-y-auto snap-y snap-mandatory scroll-smooth hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {planets.map((planet, index) => (
          <div 
            key={planet.name}
            className="h-full w-full snap-start flex flex-col md:flex-row items-center justify-center p-8 md:p-20 relative gap-12"
          >
            {/* Background Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${planet.color} opacity-5 blur-[120px] pointer-events-none`} />
            
            {/* Planet Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="w-64 h-64 md:w-96 md:h-96 relative z-10 flex-shrink-0"
            >
              <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full" />
              <img 
                src={planet.image} 
                alt={planet.name}
                className="w-full h-full object-contain mix-blend-screen"
                onError={(e) => {
                  e.target.src = "https://images-assets.nasa.gov/image/PIA00122/PIA00122~orig.jpg"; // Fallback to Earth if any image fails
                }}
              />
            </motion.div>

            {/* Planet Info */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-start max-w-xl z-20"
            >
              <span className="text-blue-400 font-mono tracking-widest uppercase text-sm mb-2">Planet 0{index + 1}</span>
              <h2 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">
                {planet.name}
              </h2>
              <div className="flex items-center gap-3 mb-6">
                <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-gray-300">
                  Age: {planet.age}
                </div>
                <div className="w-12 h-px bg-white/20" />
              </div>
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light italic">
                "{planet.description}"
              </p>
              
              <div className="mt-10 flex gap-4">
                <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-blue-400 hover:text-white transition-all transform hover:-translate-y-1">
                  Explore {planet.name}
                </button>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Static Visual Elements */}
      <div className="absolute top-8 right-8 z-30 flex flex-col items-end pointer-events-none">
        <div className="text-white/20 text-xs font-bold tracking-[0.5em] uppercase">Solar System Explorer</div>
        <div className="w-24 h-px bg-white/10 mt-2" />
      </div>
      
      <div className="absolute bottom-8 left-8 z-30 pointer-events-none">
        <div className="flex gap-1">
          {planets.map((_, i) => (
            <div key={i} className="w-1 h-1 bg-white/20 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanetExplorer;
