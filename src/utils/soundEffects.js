/**
 * Utility functions for triggering sound effects in the application
 */

// Play a success sound effect
export const playSuccessSound = () => {
  const event = new CustomEvent('partivotes-success');
  document.dispatchEvent(event);
};

// Play an error sound effect
export const playErrorSound = () => {
  const event = new CustomEvent('partivotes-error');
  document.dispatchEvent(event);
};

// Play a notification sound effect
export const playNotificationSound = () => {
  const event = new CustomEvent('partivotes-notification');
  document.dispatchEvent(event);
};

// Direct access to play any sound (if window.playSound is available)
export const playSound = (soundName) => {
  if (window.playSound && typeof window.playSound === 'function') {
    window.playSound(soundName);
  }
};
