// API Debug Script for PartiVotes
// This file can be added to your site to test API connectivity

console.log('=== PartiVotes API Debug ===');

// Test direct API calls 
async function testApiEndpoints() {
  const endpoints = [
    '/api/polls',
    '/api/polls?status=ACTIVE',
    '/api/polls?status=PENDING',
    '/api/polls?status=ENDED'
  ];
  
  console.log('Testing API endpoints:');
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Fetching ${endpoint}...`);
      
      const response = await fetch(endpoint);
      console.log(`Status: ${response.status} ${response.statusText}`);
      
      // Check content type
      const contentType = response.headers.get('content-type');
      console.log(`Content-Type: ${contentType}`);
      
      // If HTML is returned instead of JSON, this indicates a routing problem
      if (contentType && contentType.includes('text/html')) {
        console.error('ERROR: Received HTML instead of JSON - API endpoint not configured correctly');
        const text = await response.text();
        console.log('First 100 characters:', text.substring(0, 100) + '...');
      } else {
        try {
          const data = await response.json();
          console.log(`Data received: ${JSON.stringify(data).substring(0, 100)}...`);
          console.log(`Found ${Array.isArray(data) ? data.length : 0} items`);
        } catch (parseError) {
          console.error('ERROR: Failed to parse JSON response:', parseError);
          const text = await response.text();
          console.log('First 100 characters of response:', text.substring(0, 100) + '...');
        }
      }
    } catch (error) {
      console.error(`ERROR fetching ${endpoint}:`, error);
    }
    
    console.log('---');
  }
}

// Test fallback to localStorage
function testLocalStorage() {
  console.log('Checking localStorage fallback:');
  
  try {
    const polls = JSON.parse(localStorage.getItem('polls') || '[]');
    console.log(`Found ${polls.length} polls in localStorage`);
    
    if (polls.length > 0) {
      console.log('Sample poll:', polls[0]);
    }
  } catch (error) {
    console.error('ERROR accessing localStorage:', error);
  }
}

// Simple alternative for immediate data display
function useMockData() {
  console.log('Loading mock data as temporary solution...');
  
  const mockPolls = [
    { 
      id: 'mock1', 
      title: 'Mock Active Poll', 
      status: 'ACTIVE',
      creator: '0x123...',
      options: ['Option 1', 'Option 2'],
      startTime: new Date(),
      endTime: new Date(Date.now() + 86400000)
    },
    { 
      id: 'mock2', 
      title: 'Mock Pending Poll', 
      status: 'PENDING',
      creator: '0x456...',
      options: ['Option A', 'Option B'],
      startTime: new Date(Date.now() + 3600000),
      endTime: new Date(Date.now() + 86400000 * 2)
    },
    { 
      id: 'mock3', 
      title: 'Mock Ended Poll', 
      status: 'ENDED',
      creator: '0x789...',
      options: ['Yes', 'No'],
      startTime: new Date(Date.now() - 86400000 * 2),
      endTime: new Date(Date.now() - 86400000)
    }
  ];
  
  // Store in localStorage
  localStorage.setItem('mock_polls', JSON.stringify(mockPolls));
  console.log('Mock data loaded successfully.');
  
  return mockPolls;
}

// Print environment information
function printEnvironmentInfo() {
  console.log('Environment Information:');
  console.log('- URL:', window.location.href);
  console.log('- Hostname:', window.location.hostname);
  console.log('- Pathname:', window.location.pathname);
  console.log('- User Agent:', navigator.userAgent);
  
  // Test connectivity
  fetch('/api/health')
    .then(response => {
      console.log('API Health Check:', response.status);
    })
    .catch(error => {
      console.error('API Health Check Failed:', error);
    });
}

// Run the tests
window.runApiTests = async function() {
  console.log('Running API tests...');
  printEnvironmentInfo();
  await testApiEndpoints();
  testLocalStorage();
  console.log('API tests completed.');
};

// Auto-run if script is loaded directly
setTimeout(() => {
  console.log('Automatically running API tests in 2 seconds...');
  window.runApiTests();
}, 2000);

// Export for direct use
window.partiVotesDebug = {
  testApi: testApiEndpoints,
  testLocalStorage: testLocalStorage,
  useMockData: useMockData,
  runAll: window.runApiTests
};
