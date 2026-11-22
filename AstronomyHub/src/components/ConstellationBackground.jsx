import { useMemo } from "react";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

// Stable initialization callback for v4 (defined outside component so it stays stable)
const initParticles = async (engine) => {
  await loadSlim(engine);
};

const ConstellationBackground = () => {
  // Astronomy Constellation Configuration
  const options = useMemo(
    () => ({
      fullScreen: {
        enable: false,
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "grab", // Draws constellation lines to your cursor
          },
          onClick: {
            enable: true,
            mode: "push", // Adds new stars on click
          },
        },
        modes: {
          grab: {
            distance: 140,
            links: {
              opacity: 0.5,
              color: "#60a5fa", // Bright blue line connecting to mouse
            },
          },
          push: {
            quantity: 3,
          },
        },
      },
      particles: {
        color: {
          value: ["#ffffff", "#93c5fd", "#c084fc", "#fde047"], // Star colors (white, ice-blue, nebula purple, gold)
        },
        links: {
          color: "#3b82f6", // Constellation connecting lines
          distance: 120,
          enable: true,
          opacity: 0.2,     // Subtle, soft celestial lines
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "out",
          },
          random: true,
          speed: 0.5,       // Slow zero-gravity space drift
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 900,
          },
          value: 70,        // Total number of stars
        },
        opacity: {
          value: { min: 0.3, max: 0.8 },
          animation: {
            enable: true,
            speed: 1,
            sync: false,    // Twinkling effect
          },
        },
        size: {
          value: { min: 1, max: 2.5 }, // Realistic star sizes
        },
      },
      detectRetina: true,
    }),
    []
  );

  return (
    <ParticlesProvider init={initParticles}>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0, // Behind UI content
          pointerEvents: "auto", // Allows mouse hover to connect constellations
        }}
      >
        <Particles id="tsparticles" options={options} className="w-full h-full" />
      </div>
    </ParticlesProvider>
  );
};

export default ConstellationBackground;