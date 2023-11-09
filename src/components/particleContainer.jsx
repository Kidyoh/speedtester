import React, { useEffect } from 'react';

const ParticlesContainer = () => {
  useEffect(() => {
    import('particles.js').then(particlesJS => {
      particlesJS.default('particles-js', 'assets/particles.json', function() {
        console.log('callback - particles.js config loaded');
      });
    });
  }, []);

  return <div id="particles-js"></div>;
};

export default ParticlesContainer;
