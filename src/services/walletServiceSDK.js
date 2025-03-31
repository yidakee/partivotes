// Import the Partisia SDK
import PartisiaSdk from 'partisia-sdk';

// Flag to use mock wallet data for development
const USE_MOCK_WALLET = false;

// Mock data for development
let mockConnected = false;
const mockAddress = '00b06f5b47f9b085803f401313b58823a73a7bae7c';
let mockBalance = 1000;

// SDK instance
let partisiaSdk = null;

// Initialize the wallet SDK
export const initializeWalletSDK = async () => {
  if (USE_MOCK_WALLET) {
    console.log('Using mock Partisia wallet data');
    return true;
  }
  
  try {
    // Create SDK instance if it doesn't exist
    if (!partisiaSdk) {
      partisiaSdk = new PartisiaSdk();
      console.log('Partisia SDK initialized');
    }
    return true;
  } catch (error) {
    console.error('Failed to initialize Partisia SDK:', error);
    return false;
  }
};

// Check if wallet is connected
export const isWalletConnected = async () => {
  if (USE_MOCK_WALLET) {
    return mockConnected;
  }
  
  try {
    // Check if SDK is initialized
    if (!partisiaSdk) {
      await initializeWalletSDK();
    }
    
    // Check if we have an active connection
    return !!partisiaSdk.connection?.account;
  } catch (error) {
    console.error('Error checking wallet connection:', error);
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
    // Initialize SDK if needed
    if (!partisiaSdk) {
      await initializeWalletSDK();
    }
    
    console.log('Attempting to connect to Partisia Wallet...');
    
    // Connect to the wallet
    const connection = await partisiaSdk.connect({
      permissions: ["sign"],
      dappName: "PartiVotes",
      description: "Decentralized voting application on Partisia Blockchain",
      chainId: "Partisia Blockchain", // Use "Partisia Blockchain Testnet" for testnet
    });
    
    if (!partisiaSdk.connection?.account) {
      throw new Error('Failed to connect to wallet');
    }
    
    console.log('Successfully connected to Partisia Wallet');
    return true;
  } catch (error) {
    console.error('Error connecting to wallet:', error);
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
    // Check if SDK is initialized
    if (!partisiaSdk) {
      return true; // Nothing to disconnect
    }
    
    // Disconnect from wallet
    await partisiaSdk.disconnect();
    console.log('Disconnected from Partisia Wallet');
    return true;
  } catch (error) {
    console.error('Error disconnecting from wallet:', error);
    throw error;
  }
};

// Get wallet address
export const getWalletAddress = async () => {
  if (USE_MOCK_WALLET) {
    return mockConnected ? mockAddress : null;
  }
  
  try {
    // Check if SDK is initialized and connected
    if (!partisiaSdk || !partisiaSdk.connection?.account) {
      return null;
    }
    
    return partisiaSdk.connection.account.address;
  } catch (error) {
    console.error('Error getting wallet address:', error);
    return null;
  }
};

// Get wallet balance
export const getWalletBalance = async () => {
  if (USE_MOCK_WALLET) {
    return mockConnected ? mockBalance : 0;
  }
  
  try {
    // Check if SDK is initialized and connected
    if (!partisiaSdk || !partisiaSdk.connection?.account) {
      return 0;
    }
    
    // Get balance using the SDK
    // Note: The SDK doesn't have a direct getBalance method, so we'd need to
    // implement this using the blockchain API client
    // For now, returning a placeholder
    return 0; // This needs to be implemented with the proper API call
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    return 0;
  }
};

// Sign a transaction
export const signTransaction = async (transaction) => {
  if (USE_MOCK_WALLET) {
    return { signature: 'mock_signature' };
  }
  
  try {
    // Check if SDK is initialized and connected
    if (!partisiaSdk || !partisiaSdk.connection?.account) {
      throw new Error('Wallet not connected');
    }
    
    // Sign transaction using the SDK
    return await partisiaSdk.signMessage({
      payload: transaction,
      payloadType: "hex",
      dontBroadcast: false,
    });
  } catch (error) {
    console.error('Error signing transaction:', error);
    throw error;
  }
};

// Sign a message
export const signMessage = async (message) => {
  if (USE_MOCK_WALLET) {
    return { signature: 'mock_signature' };
  }
  
  try {
    // Check if SDK is initialized and connected
    if (!partisiaSdk || !partisiaSdk.connection?.account) {
      throw new Error('Wallet not connected');
    }
    
    // Sign message using the SDK
    return await partisiaSdk.signMessage({
      payload: message,
      payloadType: "utf8",
      dontBroadcast: true,
    });
  } catch (error) {
    console.error('Error signing message:', error);
    throw error;
  }
};

// Export a simple test function to verify SDK is working
export const testSDK = () => {
  try {
    const sdk = new PartisiaSdk();
    return !!sdk;
  } catch (error) {
    console.error('Error testing SDK:', error);
    return false;
  }
};
