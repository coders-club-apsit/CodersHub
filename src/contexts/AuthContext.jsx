import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Get admin emails from environment variable
  const adminEmails = useMemo(() => {
    const emails = import.meta.env.VITE_ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];
    return emails;
  }, []);

  // Check if current user is admin
  const isAdmin = useMemo(() => {
    if (!user?.email) return false;
    return adminEmails.includes(user.email.toLowerCase());
  }, [user?.email, adminEmails]);

  // Enhanced user object with admin status
  const enhancedUser = useMemo(() => {
    if (!user) return null;
    return {
      ...user,
      isAdmin,
      role: isAdmin ? 'admin' : 'user'
    };
  }, [user, isAdmin]);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user || null);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
        setIsLoaded(true);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
      setIsLoaded(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auto logout after 24 hours of inactivity
  useEffect(() => {
    if (user && session) {
      const checkSession = () => {
        const lastActivity = localStorage.getItem('lastActivityTimestamp');
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        if (lastActivity && (now - parseInt(lastActivity)) > twentyFourHours) {
          signOut();
          return;
        }
        
        // Update last activity timestamp
        localStorage.setItem('lastActivityTimestamp', now.toString());
      };

      checkSession();
      const interval = setInterval(checkSession, 60000); // Check every minute
      
      return () => clearInterval(interval);
    }
  }, [user, session]);

  // Sign up function with domain restriction
  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true);
      
      // Check if email domain is allowed
      const allowedDomain = 'apsit.edu.in';
      const emailDomain = email.toLowerCase().split('@')[1];
      
      if (emailDomain !== allowedDomain) {
        return { 
          data: null, 
          error: { 
            message: `Only ${allowedDomain} email addresses are allowed to register.` 
          } 
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData // This will be stored in user_metadata
        },
      });

      return { data, error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            hd: 'apsit.edu.in' // Restrict to apsit.edu.in domain
          }
        }
      });
      return { data, error };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { data: null, error };
    }
  };

  // Sign in function with domain restriction
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      
      // Check if email domain is allowed
      const allowedDomain = 'apsit.edu.in';
      const emailDomain = email.toLowerCase().split('@')[1];
      
      if (emailDomain !== allowedDomain) {
        return { 
          data: null, 
          error: { 
            message: `Only ${allowedDomain} email addresses are allowed to sign in.` 
          } 
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // Update activity timestamp on successful sign in
      if (data.user && !error) {
        localStorage.setItem('lastActivityTimestamp', Date.now().toString());
        // Force immediate reload to sync auth state
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
      
      return { data, error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      // Clear session timer data
      localStorage.removeItem('lastActivityTimestamp');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
      
      // Clear local state
      setUser(null);
      setSession(null);
      
      // Force page reload to ensure clean state
      setTimeout(() => {
        window.location.reload();
      }, 100);
      
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { data, error };
    } catch (error) {
      console.error('Reset password error:', error);
      return { data: null, error };
    }
  };

  // Update password function
  const updatePassword = async (password) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password,
      });
      return { data, error };
    } catch (error) {
      console.error('Update password error:', error);
      return { data: null, error };
    }
  };

  // Update user profile function
  const updateUserProfile = async (userData) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: userData // This updates user_metadata
      });
      return { data, error };
    } catch (error) {
      console.error('Update profile error:', error);
      return { data: null, error };
    }
  };

  // Get session token for Supabase API calls
  const getToken = async () => {
    try {
      if (!session) return null;
      return session.access_token;
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  };

  const value = {
    user: enhancedUser, // Use enhanced user with admin status
    session,
    loading,
    isLoaded,
    isSignedIn: !!user,
    isAdmin, // Direct admin check
    adminEmails, // Expose admin emails list
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    updateUserProfile,
    getToken,
    supabase, // Expose supabase client for direct use
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to replace Clerk's useUser with admin support
export const useUser = () => {
  const { user, isLoaded, isSignedIn, isAdmin } = useAuth();
  return {
    user,
    isLoaded,
    isSignedIn,
    isAdmin,
  };
};

// Hook to replace Clerk's useSession
export const useSession = () => {
  const { session, getToken } = useAuth();
  return {
    session: session ? {
      ...session,
      getToken: async (options) => {
        if (options?.template === 'supabase') {
          return getToken();
        }
        return getToken();
      }
    } : null,
  };
};

export default supabase;
