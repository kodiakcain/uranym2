import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const Particle = () => {
    const [init, setInit] = useState(false);
  
    useEffect(() => {
      initParticlesEngine(async (engine) => {
        await loadSlim(engine);
      }).then(() => {
        setInit(true);
      });
    }, []);
  
    const particlesLoaded = (container) => {
      console.log(container);
    };
  
    const options = useMemo(
      () => ({
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 120,
        fullScreen: {
          enable: true, // Disable fullscreen
        },
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 50,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: "000000",
          },
          links: {
            color: "#000000",
            distance: 100, // Adjust the distance between particles
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 0.1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
            },
            value: 150, // Adjust the number of particles
          },
          opacity: {
            value: 0.25,
          },
          shape: {
            type: "circle", // Change shape to triangle
          },
          size: {
            value: { min: 1, max: 5 },
          },
        },
        detectRetina: false,
      }),
      []
    );
  
    if (init) {
      return (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={options}
        />
      );
    }
  
    return <></>;
  };
  
  export default Particle;