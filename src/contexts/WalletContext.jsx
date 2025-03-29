import React, { createContext, useState, useEffect, useCallback } from 'react';
import { 
  connectWallet, 
  disconnectWallet, 
  getWalletAddress, 
  getWalletBalance,
  checkWalletConnection
} from '../services/walletService';

// Create the context
export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  // State variables
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to connect wallet
  const connect = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // This will be implemented in walletService.js
      await connectWallet();
      
      const walletAddress = await getWalletAddress();
      const walletBalance = await getWalletBalance();
      
      setAddress(walletAddress);
      setBalance(walletBalance);
      setConnected(true);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to disconnect wallet
  const disconnect = useCallback(async () => {
    try {
      setLoading(true);
      
      // This will be implemented in walletService.js
      await disconnectWallet();
      
      setAddress('');
      setBalance(0);
      setConnected(false);
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      setError('Failed to disconnect wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to refresh balance
  const refreshBalance = useCallback(async () => {
    if (!connected) return;
    
    try {
      const walletBalance = await getWalletBalance();
      setBalance(walletBalance);
    } catch (err) {
      console.error('Error refreshing balance:', err);
      // Don't set error state here to avoid disrupting the UI
    }
  }, [connected]);

  // Check initial connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setLoading(true);
        const isConnected = await checkWalletConnection();
        
        if (isConnected) {
          const walletAddress = await getWalletAddress();
          const walletBalance = await getWalletBalance();
          
          setAddress(walletAddress);
          setBalance(walletBalance);
          setConnected(true);
        }
      } catch (err) {
        console.error('Error checking wallet connection:', err);
        // Don't set error state here to avoid disrupting initial load
      } finally {
        setLoading(false);
      }
    };
    
    checkConnection();
  }, []);

  // Periodically refresh balance when connected
  useEffect(() => {
    if (!connected) return;
    
    const intervalId = setInterval(refreshBalance, 30000); // Every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [connected, refreshBalance]);

  // Context value
  const value = {
    connected,
    address,
    balance,
    loading,
    error,
    connect,
    disconnect,
    refreshBalance,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
