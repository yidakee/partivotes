// SPACE TRAVEL EFFECT - FIXED VERSION
(function() {
  // Create the starfield
  function createStarfield() {
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'space-travel-effect';
    
    // Style canvas to cover everything but stay behind content
    Object.assign(canvas.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      zIndex: '-1',  // Always behind content
      pointerEvents: 'none',
      opacity: '1',  // Make fully visible
      background: 'black' // Black background to ensure stars are visible
    });
    
    // Add to beginning of body
    document.body.insertBefore(canvas, document.body.firstChild);
    
    // Set dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    return canvas;
  }
  
  // Draw stars and animate them
  function startAnimation(canvas) {
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Create stars - more stars for better effect
    const stars = [];
    for (let i = 0; i < 800; i++) {
      const angle = Math.random() * Math.PI * 2;
      stars.push({
        angle: angle,
        distance: Math.random() * (canvas.width / 3),
        size: 0.5 + Math.random() * 2.5,
        speed: 0.5 + Math.random() * 3,
        color: Math.random() > 0.2 ? '#FFFFFF' : '#A0DDFF'
      });
    }
    
    // Animation function
    function animate() {
      // Clear canvas with black background
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        
        // Move star outward
        star.distance += star.speed;
        const x = centerX + Math.cos(star.angle) * star.distance;
        const y = centerY + Math.sin(star.angle) * star.distance;
        
        // Draw star
        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();
        
        // Reset if off screen
        if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) {
          star.distance = Math.random() * 20;
        }
      }
      
      // Continue animation
      if (window._animationActive) {
        window._animationId = requestAnimationFrame(animate);
      }
    }
    
    // Start animation
    window._animationActive = true;
    window._animationId = requestAnimationFrame(animate);
    
    // Handle window resize
    window.addEventListener('resize', function() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }
  
  // Global toggle function
  window.toggleStarfield = function(show) {
    const canvas = document.getElementById('space-travel-effect') || createStarfield();
    
    if (show) {
      canvas.style.display = 'block';
      canvas.style.opacity = '1';
      
      if (!window._animationId) {
        window._animationActive = true;
        startAnimation(canvas);
      }
    } else {
      canvas.style.opacity = '0';
      setTimeout(() => { canvas.style.display = 'none'; }, 500);
      
      if (window._animationId) {
        window._animationActive = false;
        cancelAnimationFrame(window._animationId);
        window._animationId = null;
      }
    }
  };
  
  // Initialize and activate for futuristic theme
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      createStarfield();
      // Check for futuristic theme
      if (localStorage.getItem('partivotes-theme') === 'futuristic') {
        window.toggleStarfield(true);
      }
    });
  } else {
    createStarfield();
    // Check for futuristic theme
    if (localStorage.getItem('partivotes-theme') === 'futuristic') {
      window.toggleStarfield(true);
    }
  }
})();
