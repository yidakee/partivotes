import React, { createContext, useState, useEffect } from 'react';
import {
  initializeWalletSDK,
  isWalletConnected,
  connectWallet,
  disconnectWallet,
  getWalletAddress,
  getWalletBalance
} from '../services/walletService';

// Create the context
export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  // State variables
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTestnet, setIsTestnet] = useState(false); // Default to mainnet

  // Initialize wallet on component mount
  useEffect(() => {
    const init = async () => {
      try {
        // Initialize wallet SDK
        await initializeWalletSDK(isTestnet);
        
        // Check if wallet is already connected
        const walletConnected = await isWalletConnected();
        
        if (walletConnected) {
          setConnected(true);
          await updateWalletInfo();
        }
      } catch (err) {
        console.error('Error initializing wallet:', err);
      }
    };
    
    init();
  }, [isTestnet]); // Re-initialize when network changes

  // Update wallet info (address and balance)
  const updateWalletInfo = async () => {
    try {
      // Get wallet address
      const addressResult = await getWalletAddress();
      if (addressResult && addressResult.success && addressResult.address) {
        setAddress(addressResult.address);
        
        // Get wallet balance
        const balanceResult = await getWalletBalance();
        if (balanceResult && balanceResult.success) {
          setBalance(balanceResult.balance || { balance: 0, token: 'MPC' });
        }
      }
    } catch (err) {
      console.error('Error updating wallet info:', err);
      setError('Failed to get wallet information');
    }
  };

  // Toggle between testnet and mainnet
  const toggleNetwork = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Toggle the network state
      const newIsTestnet = !isTestnet;
      console.log(`Switching to ${newIsTestnet ? 'testnet' : 'mainnet'}`);
      
      // Always disconnect first, regardless of current connection state
      try {
        console.log('Disconnecting wallet before network switch');
        await disconnectWallet();
        setConnected(false);
        setAddress(null);
        setBalance(null);
      } catch (disconnectError) {
        console.warn('Error during disconnect:', disconnectError);
        // Continue with the network switch even if disconnect fails
      }
      
      // Update the state after disconnection
      setIsTestnet(newIsTestnet);
      
      // Wait a moment to ensure disconnection is complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Only reconnect if we were previously connected
      if (connected) {
        console.log(`Reconnecting to ${newIsTestnet ? 'testnet' : 'mainnet'}`);
        
        try {
          // Connect with new network
          const result = await connectWallet(newIsTestnet);
          
          if (result && result.success) {
            setConnected(true);
            setAddress(result.address);
            
            // Get wallet balance
            const balanceResult = await getWalletBalance();
            if (balanceResult && balanceResult.success) {
              setBalance(balanceResult.balance || { 
                balance: 0, 
                token: newIsTestnet ? 'TEST_COIN' : 'MPC' 
              });
            }
            
            console.log(`Successfully reconnected to ${newIsTestnet ? 'testnet' : 'mainnet'}`);
          } else {
            console.error('Failed to reconnect after network switch:', result?.error);
            setError(result?.error || `Failed to connect to ${newIsTestnet ? 'testnet' : 'mainnet'}`);
          }
        } catch (connectError) {
          console.error('Error reconnecting after network switch:', connectError);
          setError(connectError.message || 'Failed to reconnect after network switch');
        }
      } else {
        console.log(`Network switched to ${newIsTestnet ? 'testnet' : 'mainnet'}, not reconnecting (was not connected)`);
      }
    } catch (err) {
      console.error('Error toggling network:', err);
      setError(err.message || 'Failed to switch network');
    } finally {
      setLoading(false);
    }
  };

  // Connect wallet
  const connect = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('WalletContext: Connecting wallet...');
      const result = await connectWallet(isTestnet);
      
      if (result && result.success) {
        setConnected(true);
        await updateWalletInfo();
        console.log('WalletContext: Wallet connected successfully');
      } else {
        setError(result?.error || 'Failed to connect wallet');
      }
    } catch (err) {
      console.error('WalletContext: Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // Disconnect wallet
  const disconnect = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await disconnectWallet();
      setConnected(false);
      setAddress(null);
      setBalance(null);
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      setError(err.message || 'Failed to disconnect wallet');
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    connected,
    address,
    balance,
    loading,
    error,
    isTestnet,
    connect,
    disconnect,
    toggleNetwork
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
