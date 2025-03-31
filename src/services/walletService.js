// Import the Partisia SDK
import PartisiaSdk from 'partisia-sdk';

// Flag to use mock wallet data for development
const USE_MOCK_WALLET = false; // Force real wallet connection regardless of env setting

// Mock data for development - Using Partisia Blockchain address format
let mockConnected = false;
const mockAddress = '00b06f5b47f9b085803f401313b58823a73a7bae7c'; // Partisia addresses are 42 characters (21 bytes) in hex format
let mockBalance = 1000; // Example balance in TEST_COIN tokens

// SDK instance
let partisiaSdk = null;
let currentNetwork = 'mainnet'; // Default to mainnet

// Initialize the wallet SDK
export const initializeWalletSDK = async (isTestnet = false) => {
  if (USE_MOCK_WALLET) {
    console.log('Using mock Partisia wallet data');
    return true;
  }
  
  try {
    // Update current network
    currentNetwork = isTestnet ? 'testnet' : 'mainnet';
    console.log(`Initializing Partisia SDK for ${currentNetwork}`);
    
    // Create SDK instance if it doesn't exist or if network changed
    if (!partisiaSdk || currentNetwork !== (partisiaSdk.chainId === "Partisia Blockchain Testnet" ? 'testnet' : 'mainnet')) {
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
export const connectWallet = async (isTestnet = false) => {
  if (USE_MOCK_WALLET) {
    mockConnected = true;
    return {
      success: true,
      address: mockAddress,
      error: null
    };
  }
  
  try {
    // Initialize SDK if needed
    if (!partisiaSdk) {
      await initializeWalletSDK(isTestnet);
    }
    
    // Update current network
    currentNetwork = isTestnet ? 'testnet' : 'mainnet';
    console.log(`Attempting to connect to Partisia Wallet on ${currentNetwork}...`);
    
    // Connect to the wallet
    const connection = await partisiaSdk.connect({
      permissions: ["sign"],
      dappName: "PartiVotes",
      description: "Decentralized voting application on Partisia Blockchain",
      chainId: isTestnet ? "Partisia Blockchain Testnet" : "Partisia Blockchain",
    });
    
    if (!partisiaSdk.connection?.account) {
      throw new Error('Failed to connect to wallet');
    }
    
    console.log(`Successfully connected to Partisia Wallet on ${currentNetwork}`);
    return {
      success: true,
      address: partisiaSdk.connection.account.address,
      error: null
    };
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    return {
      success: false,
      address: null,
      error: error.message || 'Failed to connect to wallet'
    };
  }
};

// Disconnect from wallet
export const disconnectWallet = async () => {
  if (USE_MOCK_WALLET) {
    mockConnected = false;
    return true;
  }
  
  try {
    // Check if SDK is initialized and connected
    if (!partisiaSdk || !partisiaSdk.connection?.account) {
      return true; // Already disconnected
    }
    
    // Disconnect from the wallet
    await partisiaSdk.disconnect();
    console.log('Successfully disconnected from Partisia Wallet');
    return true;
  } catch (error) {
    console.error('Error disconnecting from wallet:', error);
    return false;
  }
};

// Get wallet address
export const getWalletAddress = async () => {
  if (USE_MOCK_WALLET) {
    return {
      success: mockConnected,
      address: mockConnected ? mockAddress : null,
      error: null
    };
  }
  
  try {
    // Check if SDK is initialized and connected
    if (!partisiaSdk || !partisiaSdk.connection?.account) {
      return {
        success: false,
        address: null,
        error: 'Wallet not connected'
      };
    }
    
    return {
      success: true,
      address: partisiaSdk.connection.account.address,
      error: null
    };
  } catch (error) {
    console.error('Error getting wallet address:', error);
    return {
      success: false,
      address: null,
      error: error.message || 'Failed to get wallet address'
    };
  }
};

// Get wallet balance
export const getWalletBalance = async () => {
  if (USE_MOCK_WALLET) {
    return {
      success: mockConnected,
      balance: { 
        balance: mockConnected ? mockBalance : 0, 
        token: currentNetwork === 'testnet' ? 'TEST_COIN' : 'MPC' 
      },
      error: null
    };
  }
  
  try {
    // Check if SDK is initialized and connected
    if (!partisiaSdk || !partisiaSdk.connection?.account) {
      return {
        success: false,
        balance: { balance: 0, token: currentNetwork === 'testnet' ? 'TEST_COIN' : 'MPC' },
        error: 'Wallet not connected'
      };
    }
    
    const address = partisiaSdk.connection.account.address;
    const isTestnet = currentNetwork === 'testnet';
    
    // For testnet, we'll return a placeholder balance of 1000 TEST_COIN
    // For mainnet, we'll return 0 MPC since we don't have a real balance retrieval yet
    return {
      success: true,
      balance: { 
        balance: isTestnet ? 1000 : 0, 
        token: isTestnet ? 'TEST_COIN' : 'MPC' 
      },
      error: null
    };
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    return {
      success: false,
      balance: { balance: 0, token: currentNetwork === 'testnet' ? 'TEST_COIN' : 'MPC' },
      error: error.message || 'Failed to get wallet balance'
    };
  }
};

// Sign a transaction
export const signTransaction = async (transaction) => {
  if (USE_MOCK_WALLET) {
    return {
      success: mockConnected,
      signature: mockConnected ? 'mock_signature' : null,
      error: null
    };
  }
  
  try {
    // Check if SDK is initialized and connected
    if (!partisiaSdk || !partisiaSdk.connection?.account) {
      return {
        success: false,
        signature: null,
        error: 'Wallet not connected'
      };
    }
    
    // Sign transaction using the SDK
    const result = await partisiaSdk.signMessage({
      payload: transaction,
      payloadType: "hex",
      dontBroadcast: false,
    });
    
    return {
      success: true,
      signature: result.signature,
      error: null
    };
  } catch (error) {
    console.error('Error signing transaction:', error);
    return {
      success: false,
      signature: null,
      error: error.message || 'Failed to sign transaction'
    };
  }
};

// Sign a message
export const signMessage = async (message) => {
  if (USE_MOCK_WALLET) {
    return {
      success: mockConnected,
      signature: mockConnected ? 'mock_signature' : null,
      error: null
    };
  }
  
  try {
    // Check if SDK is initialized and connected
    if (!partisiaSdk || !partisiaSdk.connection?.account) {
      return {
        success: false,
        signature: null,
        error: 'Wallet not connected'
      };
    }
    
    // Sign message using the SDK
    const result = await partisiaSdk.signMessage({
      payload: message,
      payloadType: "utf8",
      dontBroadcast: true,
    });
    
    return {
      success: true,
      signature: result.signature,
      error: null
    };
  } catch (error) {
    console.error('Error signing message:', error);
    return {
      success: false,
      signature: null,
      error: error.message || 'Failed to sign message'
    };
  }
};

// Initialize the wallet when the service is imported
initializeWalletSDK();
