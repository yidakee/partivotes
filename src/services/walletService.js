// Flag to use mock wallet data for development
const USE_MOCK_WALLET = process.env.REACT_APP_USE_MOCK_DATA === 'true';

// Mock data for development
let mockConnected = false;
const mockAddress = '0x1234567890123456789012345678901234567890';
let mockBalance = 1000; // Example balance in MPC tokens

// Initialize the wallet SDK
export const initializeWalletSDK = async () => {
  if (USE_MOCK_WALLET) {
    console.log('Using mock wallet data');
    return true;
  }
  
  try {
    // In a real implementation, this would initialize the Partisia Wallet SDK
    // await PartisiaWalletSDK.initialize();
    console.log('Wallet SDK initialized');
    return true;
  } catch (error) {
    console.error('Failed to initialize wallet SDK:', error);
    return false;
  }
};

// Check if wallet is connected
export const checkWalletConnection = async () => {
  if (USE_MOCK_WALLET) {
    return mockConnected;
  }
  
  try {
    // In a real implementation, this would check the connection status with the Partisia Wallet SDK
    // return await PartisiaWalletSDK.isConnected();
    return false;
  } catch (error) {
    console.error('Failed to check wallet connection:', error);
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
    // In a real implementation, this would connect to the Partisia Wallet
    // await PartisiaWalletSDK.connect();
    console.log('Wallet connected');
    return true;
  } catch (error) {
    console.error('Failed to connect wallet:', error);
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
    // In a real implementation, this would disconnect from the Partisia Wallet
    // await PartisiaWalletSDK.disconnect();
    console.log('Wallet disconnected');
    return true;
  } catch (error) {
    console.error('Failed to disconnect wallet:', error);
    throw error;
  }
};

// Get wallet address
export const getWalletAddress = async () => {
  if (USE_MOCK_WALLET) {
    return mockConnected ? mockAddress : '';
  }
  
  try {
    // In a real implementation, this would get the address from the Partisia Wallet
    // return await PartisiaWalletSDK.getAddress();
    return '';
  } catch (error) {
    console.error('Failed to get wallet address:', error);
    throw error;
  }
};

// Get wallet balance
export const getWalletBalance = async () => {
  if (USE_MOCK_WALLET) {
    return mockConnected ? mockBalance : 0;
  }
  
  try {
    // In a real implementation, this would get the balance from the Partisia Wallet
    // return await PartisiaWalletSDK.getBalance();
    return 0;
  } catch (error) {
    console.error('Failed to get wallet balance:', error);
    throw error;
  }
};

// Sign transaction
export const signTransaction = async (transaction) => {
  if (USE_MOCK_WALLET) {
    console.log('Mock signing transaction:', transaction);
    return { signature: 'mock_signature', transaction };
  }
  
  try {
    // In a real implementation, this would sign a transaction with the Partisia Wallet
    // return await PartisiaWalletSDK.signTransaction(transaction);
    return null;
  } catch (error) {
    console.error('Failed to sign transaction:', error);
    throw error;
  }
};

// Sign message
export const signMessage = async (message) => {
  if (USE_MOCK_WALLET) {
    console.log('Mock signing message:', message);
    return { signature: 'mock_signature', message };
  }
  
  try {
    // In a real implementation, this would sign a message with the Partisia Wallet
    // return await PartisiaWalletSDK.signMessage(message);
    return null;
  } catch (error) {
    console.error('Failed to sign message:', error);
    throw error;
  }
};

// Verify signature
export const verifySignature = async (message, signature, address) => {
  if (USE_MOCK_WALLET) {
    console.log('Mock verifying signature:', { message, signature, address });
    return true;
  }
  
  try {
    // In a real implementation, this would verify a signature with the Partisia Wallet SDK
    // return await PartisiaWalletSDK.verifySignature(message, signature, address);
    return false;
  } catch (error) {
    console.error('Failed to verify signature:', error);
    throw error;
  }
};

// Initialize the wallet SDK when the service is imported
initializeWalletSDK();
