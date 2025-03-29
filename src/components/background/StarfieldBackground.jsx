import React, { useEffect } from 'react';
import { Box } from '@mui/material';

// CSS-based starfield animation that works reliably
const StarfieldBackground = () => {
  useEffect(() => {
    // Add CSS for the starfield animation to the document head
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      @keyframes starfieldMove {
        from { transform: translateZ(0px); }
        to { transform: translateZ(1000px); }
      }
      
      .star {
        position: absolute;
        background-color: white;
        border-radius: 50%;
        opacity: 0;
        animation: starfieldMove 8s linear infinite;
        animation-delay: 0s;
      }
      
      .starfield-container {
        perspective: 500px;
        perspective-origin: 50% 50%;
      }
    `;
    document.head.appendChild(styleEl);
    
    // Clean up
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);
  
  useEffect(() => {
    // Generate stars
    const container = document.getElementById('starfield-container');
    if (!container) return;
    
    // Clear any existing stars
    container.innerHTML = '';
    
    // Generate 300 stars
    for (let i = 0; i < 300; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      // Random star properties
      const size = Math.random() * 3 + 1;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const z = Math.random() * 1000;
      const delay = Math.random() * 8;
      const duration = 5 + Math.random() * 5;
      const opacity = Math.random() * 0.7 + 0.3;
      
      // Set star styles
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      star.style.transform = `translateZ(${z}px)`;
      star.style.animationDelay = `-${delay}s`;
      star.style.animationDuration = `${duration}s`;
      star.style.opacity = opacity;
      
      // Add subtle color variations to some stars
      if (i % 5 === 0) {
        star.style.backgroundColor = 'rgb(200, 220, 255)'; // Bluish
      } else if (i % 7 === 0) {
        star.style.backgroundColor = 'rgb(255, 240, 200)'; // Yellowish
      }
      
      container.appendChild(star);
    }
    
    // Clean up
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);
  
  return (
    <Box
      id="starfield-container"
      className="starfield-container"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#000',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
};

export default StarfieldBackground;
