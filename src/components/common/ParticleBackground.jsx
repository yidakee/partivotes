import React, { useContext, useEffect, useRef } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';

const ParticleBackground = () => {
  const { themeMode } = useContext(ThemeContext);
  const isFuturistic = themeMode === 'futuristic';
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!isFuturistic || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    // Set canvas to full window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5; // Reduced size
        this.speedX = Math.random() * 0.5 - 0.25; // Reduced speed
        this.speedY = Math.random() * 0.5 - 0.25; // Reduced speed
        this.color = this.getRandomColor();
      }

      getRandomColor() {
        const colors = [
          'rgba(0, 255, 234, 0.5)',  // Cyan with reduced opacity
          'rgba(255, 0, 255, 0.5)',  // Magenta with reduced opacity
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Wrap around screen edges
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize particles - significantly reduced count
    const initParticles = () => {
      particles = [];
      // Limit to a much smaller number of particles
      const particleCount = Math.min(Math.floor(window.innerWidth * window.innerHeight / 40000), 30);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    // Animation loop with reduced frame rate
    let lastTime = 0;
    const frameInterval = 50; // 20 fps instead of 60 fps
    
    const animate = (timestamp) => {
      const deltaTime = timestamp - lastTime;
      
      if (deltaTime > frameInterval) {
        lastTime = timestamp;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
          particle.update();
          particle.draw();
        });
        
        // Connect particles with lines if they're close enough
        // Only do this every other frame to save processing
        if (Math.floor(timestamp / frameInterval) % 2 === 0) {
          connectParticles();
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Connect nearby particles with lines - optimized
    const connectParticles = () => {
      const maxDistance = 80; // Reduced connection distance
      
      for (let i = 0; i < particles.length; i++) {
        // Only check connections with a subset of other particles
        for (let j = i; j < Math.min(i + 5, particles.length); j++) {
          if (i !== j) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
              // Opacity based on distance
              const opacity = 1 - (distance / maxDistance);
              ctx.strokeStyle = `rgba(0, 255, 240, ${opacity * 0.15})`; // Reduced opacity
              ctx.lineWidth = 0.3; // Thinner lines
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }
    };

    // Start animation
    initParticles();
    animationRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isFuturistic]);

  if (!isFuturistic) return null;

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.7, // Reduced overall opacity
      }}
    />
  );
};

export default ParticleBackground;
