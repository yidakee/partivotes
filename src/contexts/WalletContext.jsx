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
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState({ balance: 0, token: 'MPC' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize wallet on component mount
  useEffect(() => {
    const init = async () => {
      try {
        await initializeWalletSDK();
        // Check if already connected
        const connected = await isWalletConnected();
        if (connected) {
          setConnected(true);
          updateWalletInfo();
        }
      } catch (err) {
        console.error('Error initializing wallet:', err);
      }
    };
    
    init();
  }, []);

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

  // Connect wallet
  const connect = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('WalletContext: Connecting wallet...');
      const result = await connectWallet();
      
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
      setAddress('');
      setBalance({ balance: 0, token: 'MPC' });
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
    connect,
    disconnect
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
