import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useEffect } from 'react';

const Asteroid = ({ size, speed, initialX, initialY }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth mouse movements
  const x = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const y = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Move asteroids in opposite direction or with parallax
      const moveX = (e.clientX - window.innerWidth / 2) * speed;
      const moveY = (e.clientY - window.innerHeight / 2) * speed;
      mouseX.set(moveX);
      mouseY.set(moveY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, speed]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: initialY,
        left: initialX,
        x,
        y,
        width: size,
        height: size,
        pointerEvents: 'none',
        zIndex: 0,
        willChange: 'transform',
      }}
      animate={{
        rotate: 360,
      }}
      transition={{
        duration: 20 + Math.random() * 20,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
        <path d="M12 2L15 5L18 4L21 7L20 11L22 15L19 19L15 18L12 22L9 19L5 20L2 16L4 12L2 8L6 4L12 2Z" 
          fill="#CBD5E1" stroke="#E2E8F0" strokeWidth="0.5"/>
        <circle cx="8" cy="9" r="1.5" fill="#94A3B8" opacity="0.4"/>
        <circle cx="15" cy="14" r="2" fill="#94A3B8" opacity="0.4"/>
      </svg>
    </motion.div>
  );
};

const AsteroidBackground = ({ children }) => {
  const asteroids = [
    { size: 40, speed: 0.05, initialX: '10%', initialY: '20%' },
    { size: 60, speed: -0.08, initialX: '70%', initialY: '15%' },
    { size: 30, speed: 0.1, initialX: '40%', initialY: '70%' },
    { size: 50, speed: -0.03, initialX: '80%', initialY: '80%' },
    { size: 25, speed: 0.12, initialX: '20%', initialY: '85%' },
    { size: 45, speed: -0.06, initialX: '5%', initialY: '60%' },
  ];

  // Adjust for desktop if window is large (this is a simple approach)
  // In a real app we'd use a useWindowSize hook or CSS media queries
  const processedAsteroids = asteroids.map(a => ({
    ...a,
    size: typeof window !== 'undefined' && window.innerWidth > 768 ? a.size * 2 : a.size
  }));

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-r from-purple-900/90 to-black">
      {/* Background Stars (Static/CSS) */}
      <div className="stars-container opacity-20">
        {/* Subtle star presence */}
      </div>

      {/* Interactive Asteroids */}
      {processedAsteroids.map((ast, i) => (
        <Asteroid key={i} {...ast} />
      ))}

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default AsteroidBackground;
