import React, { useEffect, useContext, useState } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import './StarfieldBackground.css';

/**
 * StarfieldBackground Component
 * 
 * This component manages the starfield animation for the futuristic theme.
 * It ensures the starfield is properly initialized and toggled based on theme changes.
 */
const StarfieldBackground = () => {
  const { themeMode } = useContext(ThemeContext);
  const isFuturistic = themeMode === 'futuristic';
  const [starfieldLoaded, setStarfieldLoaded] = useState(false);
  
  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      if (typeof window.toggleStarfield === 'function') {
        window.toggleStarfield(isFuturistic);
        console.log(`Starfield toggled from event: ${isFuturistic}`);
      }
    };
    
    // Add event listener
    document.addEventListener('themeChange', handleThemeChange);
    
    // Cleanup
    return () => {
      document.removeEventListener('themeChange', handleThemeChange);
    };
  }, [isFuturistic]);
  
  useEffect(() => {
    // Load the starfield script and initialize
    const loadStarfield = async () => {
      try {
        // Import the starfield script
        const starfieldModule = await import('../../forceStarfield.js');
        console.log('Starfield script loaded successfully');
        setStarfieldLoaded(true);
        
        // After script is loaded, check if toggleStarfield function exists
        if (typeof window.toggleStarfield === 'function') {
          // Toggle starfield based on current theme
          window.toggleStarfield(isFuturistic);
          console.log(`Starfield toggled: ${isFuturistic}`);
          
          // Ensure the starfield has the correct z-index and background
          const starfieldCanvas = document.getElementById('space-travel-effect');
          if (starfieldCanvas) {
            // Apply critical styling directly to ensure it takes effect
            starfieldCanvas.style.zIndex = '-9999';
            starfieldCanvas.style.backgroundColor = '#000000';
            starfieldCanvas.style.position = 'fixed';
            starfieldCanvas.style.top = '0';
            starfieldCanvas.style.left = '0';
            starfieldCanvas.style.width = '100vw';
            starfieldCanvas.style.height = '100vh';
            starfieldCanvas.style.pointerEvents = 'none';
            
            // Add visible class if in futuristic mode
            if (isFuturistic) {
              starfieldCanvas.classList.add('visible');
              starfieldCanvas.style.display = 'block';
              setTimeout(() => {
                starfieldCanvas.style.opacity = '1';
              }, 50);
            } else {
              starfieldCanvas.classList.remove('visible');
              starfieldCanvas.style.opacity = '0';
              setTimeout(() => {
                starfieldCanvas.style.display = 'none';
              }, 500);
            }
          }
        } else {
          console.error('toggleStarfield function not found after loading script');
        }
      } catch (error) {
        console.error('Error loading starfield script:', error);
      }
    };
    
    loadStarfield();
    
    // Cleanup function
    return () => {
      // Hide starfield when component unmounts
      if (typeof window.toggleStarfield === 'function') {
        window.toggleStarfield(false);
      }
    };
  }, [isFuturistic]); // React to theme changes
  
  // Effect to handle window resize for the starfield
  useEffect(() => {
    const handleResize = () => {
      const starfieldCanvas = document.getElementById('space-travel-effect');
      if (starfieldCanvas) {
        starfieldCanvas.width = window.innerWidth;
        starfieldCanvas.height = window.innerHeight;
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [starfieldLoaded]);
  
  // Return null as this is just a background effect
  return null;
};

export default StarfieldBackground;
