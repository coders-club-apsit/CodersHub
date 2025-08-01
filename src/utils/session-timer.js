
/**
 * Session timer utility to automatically sign out users after a set period
 */
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Session timeout in milliseconds (2 hours and 15 minutes = 135 minutes)
const SESSION_TIMEOUT = 135 * 60 * 1000;

export const useSessionTimeout = () => {
  const { signOut, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) return;

    // Set last active timestamp when component mounts
    let lastActivity = Date.now();
    localStorage.setItem('lastActivityTimestamp', lastActivity.toString());

    // Function to check if session has expired
    const checkSessionTimeout = () => {
      const lastActivityTime = parseInt(localStorage.getItem('lastActivityTimestamp') || '0');
      const currentTime = Date.now();
      
      if (currentTime - lastActivityTime > SESSION_TIMEOUT) {
        // Session expired, sign out user
        console.log('Session expired. Signing out...');
        signOut();
        localStorage.removeItem('lastActivityTimestamp');
      }
    };

    // Update last activity timestamp on user interaction
    const updateActivity = () => {
      lastActivity = Date.now();
      localStorage.setItem('lastActivityTimestamp', lastActivity.toString());
    };

    // Set up event listeners for user activity
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    activityEvents.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    // Check session timeout periodically (every minute)
    const intervalId = setInterval(checkSessionTimeout, 60000);

    // Clean up event listeners and interval
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      clearInterval(intervalId);
    };
  }, [isSignedIn, signOut]);
};