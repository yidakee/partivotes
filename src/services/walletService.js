// Flag to use mock wallet data for development
const USE_MOCK_WALLET = process.env.REACT_APP_USE_MOCK_DATA === 'true';

// Mock data for development - Using Partisia Blockchain address format
let mockConnected = false;
const mockAddress = '00b06f5b47f9b085803f401313b58823a73a7bae7c'; // Partisia addresses are 42 characters (21 bytes) in hex format
let mockBalance = 1000; // Example balance in TEST_COIN tokens

// Initialize the wallet SDK
export const initializeWalletSDK = async () => {
  if (USE_MOCK_WALLET) {
    console.log('Using mock Partisia wallet data');
    return true;
  }
  
  try {
    // In a real implementation, this would initialize the Partisia Blockchain Wallet SDK
    // For example: await PartisiaBlockchain.initialize();
    // See: https://partisiablockchain.gitlab.io/documentation/sdk/sdk-client.html
    console.log('Partisia Wallet SDK initialized');
    return true;
  } catch (error) {
    console.error('Failed to initialize Partisia wallet SDK:', error);
    return false;
  }
};

// Check if wallet is connected
export const checkWalletConnection = async () => {
  if (USE_MOCK_WALLET) {
    return mockConnected;
  }
  
  try {
    // Check if the Partisia Wallet Browser Extension is installed
    if (typeof window.partisiawallet === 'undefined') {
      console.warn('Partisia Wallet Browser Extension not detected');
      return false;
    }
    
    // Check if the wallet is connected
    const isConnected = await window.partisiawallet.isConnected();
    return isConnected;
  } catch (error) {
    console.error('Failed to check Partisia wallet connection:', error);
    return false;
  }
};

// Connect to wallet
export const connectWallet = async () => {
  if (USE_MOCK_WALLET) {
    mockConnected = true;
    return true;
  }
  
  try {
    // Check if the Partisia Wallet Browser Extension is installed
    if (typeof window.partisiawallet === 'undefined') {
      throw new Error('Partisia Wallet Browser Extension not detected. Please install the extension from the Chrome Web Store.');
    }
    
    // Connect to the Partisia Wallet
    await window.partisiawallet.connect({
      name: 'PartiVotes',
      description: 'Decentralized voting application on Partisia Blockchain',
      url: window.location.origin,
    });
    
    console.log('Partisia Wallet connected');
    return true;
  } catch (error) {
    console.error('Failed to connect Partisia wallet:', error);
    throw error;
  }
};

// Disconnect from wallet
export const disconnectWallet = async () => {
  if (USE_MOCK_WALLET) {
    mockConnected = false;
    return true;
  }
  
  try {
    // Check if the Partisia Wallet Browser Extension is installed
    if (typeof window.partisiawallet === 'undefined') {
      console.warn('Partisia Wallet Browser Extension not detected');
      return true;
    }
    
    // Disconnect from the Partisia Wallet
    await window.partisiawallet.disconnect();
    console.log('Partisia Wallet disconnected');
    return true;
  } catch (error) {
    console.error('Failed to disconnect Partisia wallet:', error);
    throw error;
  }
};

// Get wallet address
export const getWalletAddress = async () => {
  if (USE_MOCK_WALLET) {
    return mockConnected ? mockAddress : '';
  }
  
  try {
    // Check if the Partisia Wallet Browser Extension is installed
    if (typeof window.partisiawallet === 'undefined') {
      console.warn('Partisia Wallet Browser Extension not detected');
      return '';
    }
    
    // Get the address from the Partisia Wallet
    const address = await window.partisiawallet.getAddress();
    return address;
  } catch (error) {
    console.error('Failed to get Partisia wallet address:', error);
    throw error;
  }
};

// Get wallet balance
export const getWalletBalance = async () => {
  if (USE_MOCK_WALLET) {
    return mockConnected ? mockBalance : 0;
  }
  
  try {
    // Check if the Partisia Wallet Browser Extension is installed
    if (typeof window.partisiawallet === 'undefined') {
      console.warn('Partisia Wallet Browser Extension not detected');
      return 0;
    }
    
    // Get the wallet address
    const address = await getWalletAddress();
    if (!address) {
      return 0;
    }
    
    // Get the balance from the Partisia Wallet
    // Note: This is a simplified implementation. In a real-world scenario,
    // you would need to query the blockchain for the account balance.
    const balance = await window.partisiawallet.getBalance();
    return balance;
  } catch (error) {
    console.error('Failed to get Partisia wallet balance:', error);
    throw error;
  }
};

// Sign transaction
export const signTransaction = async (transaction) => {
  if (USE_MOCK_WALLET) {
    console.log('Mock signing Partisia transaction:', transaction);
    // Partisia uses a different signature format than Ethereum
    return { signature: 'mock_partisia_signature', transaction };
  }
  
  try {
    // Check if the Partisia Wallet Browser Extension is installed
    if (typeof window.partisiawallet === 'undefined') {
      throw new Error('Partisia Wallet Browser Extension not detected');
    }
    
    // Sign the transaction with the Partisia Wallet
    const result = await window.partisiawallet.signTransaction(transaction);
    return result;
  } catch (error) {
    console.error('Failed to sign Partisia transaction:', error);
    throw error;
  }
};

// Sign message
export const signMessage = async (message) => {
  if (USE_MOCK_WALLET) {
    console.log('Mock signing message with Partisia wallet:', message);
    return { signature: 'mock_partisia_signature', message };
  }
  
  try {
    // Check if the Partisia Wallet Browser Extension is installed
    if (typeof window.partisiawallet === 'undefined') {
      throw new Error('Partisia Wallet Browser Extension not detected');
    }
    
    // Sign the message with the Partisia Wallet
    const signature = await window.partisiawallet.signMessage(message);
    return { signature };
  } catch (error) {
    console.error('Failed to sign message with Partisia wallet:', error);
    throw error;
  }
};

// Verify signature
export const verifySignature = async (message, signature, address) => {
  if (USE_MOCK_WALLET) {
    console.log('Mock verifying Partisia signature:', { message, signature, address });
    return true;
  }
  
  try {
    // Check if the Partisia Wallet Browser Extension is installed
    if (typeof window.partisiawallet === 'undefined') {
      throw new Error('Partisia Wallet Browser Extension not detected');
    }
    
    // Verify the signature with the Partisia Wallet
    const isValid = await window.partisiawallet.verifySignature(message, signature, address);
    return isValid;
  } catch (error) {
    console.error('Failed to verify Partisia signature:', error);
    throw error;
  }
};

// Initialize the wallet SDK when the service is imported
initializeWalletSDK();
