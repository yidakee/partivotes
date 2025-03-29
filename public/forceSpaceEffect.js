// EMERGENCY DIRECT SPACE EFFECT
// This script bypasses all theme checks and directly creates and displays the space effect

console.log('🚨 EMERGENCY DIRECT SPACE EFFECT LOADING');

// Immediately create and show the starfield
function createAndShowSpaceEffect() {
  console.log('👽 FORCE CREATING SPACE TRAVEL EFFECT');
  
  // Remove any existing starfields first
  document.querySelectorAll('#space-effect, #space-travel-starfield, #starfield-force, #smooth-starfield').forEach(el => {
    console.log(`Removing existing element: ${el.id}`);
    el.remove();
  });
  
  // Create our container with a unique ID
  const container = document.createElement('div');
  container.id = 'space-effect';
  
  // Apply essential styles - FORCE VISIBILITY
  Object.assign(container.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 20, 0.9)',
    zIndex: '999', // Very high z-index to ensure visibility
    pointerEvents: 'none',
    opacity: '1', // FORCE VISIBLE
    overflow: 'hidden',
    perspective: '1000px',
  });
  
  // Add to document body as the FIRST child to avoid being covered
  document.body.prepend(container);
  console.log('Space effect container added to DOM with forced visibility');
  
  // Create and add essential animation styles
  const style = document.createElement('style');
  style.id = 'space-effect-styles';
  
  style.textContent = `
    @keyframes warpSpace {
      from { 
        transform: translate(-50%, -50%) scale(0.1);
        opacity: 0;
      }
      5% { opacity: 0.9; }
      95% { opacity: 0.9; }
      to { 
        transform: translate(-50%, -50%) scale(5);
        opacity: 0;
      }
    }
  `;
  
  document.head.appendChild(style);
  
  // Create stars with BRIGHT colors for visibility
  for (let i = 0; i < 250; i++) {
    const star = document.createElement('div');
    
    // Random position from center
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 40 + 5;
    
    // Calculate positions
    const x = 50 + Math.cos(angle) * distance; 
    const y = 50 + Math.sin(angle) * distance;
    
    // Random size and timing
    const size = Math.random() * 3 + 1;
    const duration = 5 + Math.random() * 8;
    const delay = Math.random() * 5;
    
    // Bright visible colors
    const colors = ['#ffffff', '#00ffff', '#ff00ff', '#ffff00'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Apply star styles
    Object.assign(star.style, {
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      backgroundColor: color,
      left: '50%',
      top: '50%',
      boxShadow: `0 0 5px ${color}`,
      animation: `warpSpace ${duration}s linear infinite`,
      animationDelay: `${delay}s`,
      transform: 'translate(-50%, -50%) scale(0.1)',
    });
    
    container.appendChild(star);
  }
  
  // Create bright warp streaks for emphasis
  for (let i = 0; i < 40; i++) {
    const streak = document.createElement('div');
    
    // Random position from center
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 30 + 5;
    
    // Calculate positions
    const x = 50 + Math.cos(angle) * distance;
    const y = 50 + Math.sin(angle) * distance;
    
    // Size and timing
    const size = 3 + Math.random() * 5;
    const duration = 4 + Math.random() * 6;
    const delay = Math.random() * 3;
    
    // Bright colors for visibility
    const colors = ['#00ffff', '#ff00ff', '#ffff00', '#ffffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Apply streak styles
    Object.assign(streak.style, {
      position: 'absolute',
      width: `${size}px`,
      height: `${size * 3}px`, // Extended for better streaking effect
      borderRadius: '30%',
      backgroundColor: color,
      left: '50%',
      top: '50%',
      boxShadow: `0 0 10px ${color}`,
      animation: `warpSpace ${duration}s linear infinite`,
      animationDelay: `${delay}s`,
      transform: 'translate(-50%, -50%) scale(0.1)',
    });
    
    container.appendChild(streak);
  }
  
  console.log('✅ EMERGENCY SPACE EFFECT CREATED AND DISPLAYED');
}

// Run immediately
createAndShowSpaceEffect();

// Also run when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createAndShowSpaceEffect);
} else {
  // Small delay to ensure proper rendering
  setTimeout(createAndShowSpaceEffect, 300);
}

// Run again after a delay to really force it
setTimeout(createAndShowSpaceEffect, 1000);

console.log('🔥 EMERGENCY SPACE EFFECT SCRIPT LOADED AND RUNNING 🔥');
