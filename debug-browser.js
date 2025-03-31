// Debug script to add to index.html
// This will print critical environment information to the console

// Function to add to window onload
function debugEnvironment() {
  console.log('==== ENVIRONMENT DEBUG INFO ====');
  console.log('Current hostname:', window.location.hostname);
  console.log('Current pathname:', window.location.pathname);
  console.log('Is production check:', 
    window.location.hostname === 'partivotes.xyz' || 
    window.location.hostname === 'www.partivotes.xyz');
  console.log('=================================');
  
  // Force MongoDB check
  const isProduction = 
    window.location.hostname === 'partivotes.xyz' || 
    window.location.hostname === 'www.partivotes.xyz';
  
  console.log('Should be using MongoDB?', isProduction ? 'YES' : 'NO');
}

// Inject this script into index.html
/*
<script>
  window.addEventListener('load', function() {
    console.log('==== ENVIRONMENT DEBUG INFO ====');
    console.log('Current hostname:', window.location.hostname);
    console.log('Current pathname:', window.location.pathname);
    console.log('Is production check:', 
      window.location.hostname === 'partivotes.xyz' || 
      window.location.hostname === 'www.partivotes.xyz');
    console.log('=================================');
    
    // Force MongoDB check
    const isProduction = 
      window.location.hostname === 'partivotes.xyz' || 
      window.location.hostname === 'www.partivotes.xyz';
    
    console.log('Should be using MongoDB?', isProduction ? 'YES' : 'NO');
  });
</script>
*/
