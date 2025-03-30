/**
 * Poll utility functions
 */

/**
 * Mock function to simulate blockchain transaction confirmation
 * @param {string} txHash - Transaction hash
 * @returns {Promise} Promise that resolves when the transaction is confirmed
 */
export const waitForConfirmation = async (txHash) => {
  console.log(`Waiting for confirmation of transaction: ${txHash}`);
  
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Transaction ${txHash} confirmed!`);
      resolve({
        status: 'confirmed',
        txHash,
        blockNumber: Math.floor(Math.random() * 1000000) + 10000000
      });
    }, 2000);
  });
};
