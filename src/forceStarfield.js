// SPACE TRAVEL EFFECT - FIXED VERSION
(function() {
  // Create the starfield
  function createStarfield() {
    // Get existing canvas or create a new one
    let canvas = document.getElementById('space-travel-effect');
    if (canvas) return canvas; // Return existing if found

    console.log('Creating new starfield canvas');
    canvas = document.createElement('canvas');
    canvas.id = 'space-travel-effect';
    
    // CRITICAL STYLING FOR FIXED BACKGROUND
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw'; // Use vw/vh for viewport units
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-999'; // Ensure it's behind everything
    canvas.style.pointerEvents = 'none';
    canvas.style.display = 'none'; // Start hidden
    canvas.style.opacity = '0'; // Start transparent
    canvas.style.transition = 'opacity 0.5s ease'; // Smooth fade
    canvas.style.backgroundColor = '#000'; // Ensure background is black

    // Append to body first so it's at the bottom of the stack
    document.body.prepend(canvas);
    
    // Set dimensions (redundant with 100vw/vh but keep for context compatibility)
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
    for (let i = 0; i < 1000; i++) {
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
      ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
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
    console.log('toggleStarfield called with show =', show);
    const canvas = document.getElementById('space-travel-effect') || createStarfield();
    
    if (show) {
      console.log('Showing starfield');
      canvas.style.display = 'block';
      
      // Force a reflow before setting opacity to ensure transition works
      canvas.offsetHeight;
      
      canvas.style.opacity = '1';
      
      if (!window._animationId) {
        window._animationActive = true;
        startAnimation(canvas);
      }
    } else {
      console.log('Hiding starfield');
      canvas.style.opacity = '0';
      setTimeout(() => { 
        if (canvas.style.opacity === '0') {
          canvas.style.display = 'none'; 
        }
      }, 500);
      
      if (window._animationId) {
        window._animationActive = false;
        cancelAnimationFrame(window._animationId);
        window._animationId = null;
      }
    }
  };
  
  // Initialize canvas creation on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      createStarfield();
      // Force starfield to be visible immediately in futuristic mode
      const savedTheme = localStorage.getItem('partivotes-theme');
      if (savedTheme === 'futuristic') {
        console.log('Applying futuristic theme from localStorage on page load');
        setTimeout(() => window.toggleStarfield(true), 100);
      }
    });
  } else {
    createStarfield();
    // Force starfield to be visible immediately in futuristic mode
    const savedTheme = localStorage.getItem('partivotes-theme');
    if (savedTheme === 'futuristic') {
      console.log('Applying futuristic theme from localStorage on page load');
      setTimeout(() => window.toggleStarfield(true), 100);
    }
  }
  
  // Force apply starfield if currently in futuristic theme
  const savedTheme = localStorage.getItem('partivotes-theme');
  if (savedTheme === 'futuristic') {
    console.log('Forcing starfield activation due to futuristic theme');
    setTimeout(() => {
      if (typeof window.toggleStarfield === 'function') {
        window.toggleStarfield(true);
      }
    }, 500);
  }
})();