import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { 
  EyeIcon, 
  EyeOffIcon, 
  X, 
  User, 
  BookOpen, 
  FolderOpen, 
  FileText, 
  Bookmark, 
  Shield, 
  LogOut 
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Google Icon Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// Simple Tabs Components (since we don't have them in UI)
const Tabs = ({ defaultValue, children, className, value, onValueChange }) => {
  const [activeTab, setActiveTab] = useState(value || defaultValue);
  
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    if (onValueChange) onValueChange(newValue);
  };

  return (
    <div className={cn("w-full", className)}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { activeTab, onTabChange: handleTabChange })
      )}
    </div>
  );
};

const TabsList = ({ children, className, activeTab, onTabChange }) => (
  <div className={cn(
    "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full",
    className
  )}>
    {React.Children.map(children, child =>
      React.cloneElement(child, { activeTab, onTabChange })
    )}
  </div>
);

const TabsTrigger = ({ value, children, className, activeTab, onTabChange }) => (
  <button
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      activeTab === value
        ? "bg-background text-foreground shadow-sm"
        : "hover:bg-background/50",
      className
    )}
    onClick={() => onTabChange(value)}
  >
    {children}
  </button>
);

const TabsContent = ({ value, children, className, activeTab }) => {
  if (activeTab !== value) return null;
  return (
    <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}>
      {children}
    </div>
  );
};

// Component to conditionally render content when user is signed in
export const SignedIn = ({ children }) => {
  const { isSignedIn } = useAuth();
  return isSignedIn ? children : null;
};

// Component to conditionally render content when user is signed out
export const SignedOut = ({ children }) => {
  const { isSignedIn } = useAuth();
  return !isSignedIn ? children : null;
};

// Sign In Form Component (updated with immediate modal close)
const SignInForm = ({ onSuccess }) => {
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    
    try {
      const { data, error } = await signInWithGoogle();
      
      if (error) {
        setError(error.message);
        toast.error('Google sign in failed: ' + error.message);
      } else {
        toast.success('Successfully signed in!');
        // Close modal immediately
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const emailDomain = email.toLowerCase().split('@')[1];
    if (emailDomain !== 'apsit.edu.in') {
      setError('Only apsit.edu.in email addresses are allowed');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
        toast.error('Sign in failed: ' + error.message);
      } else if (data?.user) {
        toast.success('Successfully signed in!');
        // Close modal immediately
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
      >
        <GoogleIcon />
        {googleLoading ? 'Connecting...' : 'Continue with Google'}
      </Button>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="your.name@apsit.edu.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Only APSIT email addresses are allowed
          </p>
        </div>
        
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </div>
  );
};

// Enhanced Sign Up Form Component with First/Last Name
const SignUpForm = ({ onSuccess }) => {
  const { signUp, signInWithGoogle } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    
    try {
      const { data, error } = await signInWithGoogle();
      
      if (error) {
        setError(error.message);
        toast.error('Google sign in failed: ' + error.message);
      } else {
        toast.success('Redirecting to Google...');
        // Close modal immediately when redirecting to Google
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    const emailDomain = email.toLowerCase().split('@')[1];
    if (emailDomain !== 'apsit.edu.in') {
      setError('Only apsit.edu.in email addresses are allowed to register');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error } = await signUp(email, password, {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`
      });
      
      if (error) {
        setError(error.message);
        toast.error('Sign up failed: ' + error.message);
      } else {
        setSuccess('Check your APSIT email for the confirmation link!');
        toast.success('Sign up successful! Check your email for confirmation.');
        // Clear form
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
      >
        <GoogleIcon />
        {googleLoading ? 'Connecting...' : 'Continue with Google'}
      </Button>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <Input
            type="email"
            placeholder="your.name@apsit.edu.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Only APSIT email addresses are allowed
          </p>
        </div>
        
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>
    </div>
  );
};

// Enhanced Auth Modal Component using UI Dialog
export const AuthModal = ({ isOpen, onClose, defaultTab = "signin" }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Welcome to CodersHub</DialogTitle>
          <DialogDescription className="text-center">
            Join the APSIT coding community
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <Tabs defaultValue={defaultTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <SignInForm onSuccess={onClose} />
            </TabsContent>
            
            <TabsContent value="signup">
              <SignUpForm onSuccess={onClose} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Global modal state management
let globalModalState = {
  isOpen: false,
  closeCallback: null
};

// Auth Button Component with global modal management
export const AuthButton = ({ children, defaultTab = "signin", className, ...props }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const reloadTimeoutRef = useRef(null);

  useEffect(() => {
    if (isSignedIn && isModalOpen) {
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current);
      }
      
      setIsModalOpen(false);
      globalModalState.isOpen = false;
      
      reloadTimeoutRef.current = setTimeout(() => {
        window.location.reload();
      }, 100);
    }

    return () => {
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current);
      }
    };
  }, [isSignedIn, isModalOpen]);

  const handleOpenModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Close any existing modal first
    if (globalModalState.isOpen && globalModalState.closeCallback) {
      globalModalState.closeCallback();
    }
    
    if (!isSignedIn && !globalModalState.isOpen) {
      setIsModalOpen(true);
      globalModalState.isOpen = true;
      globalModalState.closeCallback = handleCloseModal;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    globalModalState.isOpen = false;
    globalModalState.closeCallback = null;
  };

  return (
    <>
      <Button
        onClick={handleOpenModal}
        className={className}
        disabled={isSignedIn}
        {...props}
      >
        {children}
      </Button>
      {isModalOpen && (
        <AuthModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          defaultTab={defaultTab}
        />
      )}
    </>
  );
};

// Enhanced User Button Component with improved styling and features
export const UserButton = () => {
  const { user, signOut, isAdmin } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      setShowDropdown(false);
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  if (!user) return null;

  // Get user initials from full name or email
  const getInitials = () => {
    const fullName = user.user_metadata?.full_name;
    if (fullName) {
      return fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user.email?.charAt(0).toUpperCase() || 'U';
  };

  const getDisplayName = () => {
    return user.user_metadata?.full_name || 
           user.user_metadata?.first_name || 
           user.email?.split('@')[0] || 
           'User';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-button-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  return (
    <div className="relative user-button-container">
      <Button
        variant="ghost"
        className={cn(
          "relative h-10 w-10 rounded-full p-0 transition-all duration-200 hover:scale-105",
          showDropdown && "ring-2 ring-primary/20 bg-primary/5"
        )}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200 relative",
          isAdmin 
            ? "bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg" 
            : "bg-gradient-to-br from-primary/80 to-primary text-primary-foreground shadow-md"
        )}>
          {getInitials()}

        </div>
        
        {/* Online indicator */}
        <div className="absolute bottom-0.5 right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background shadow-sm" />
      </Button>
      
      {showDropdown && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 z-40 md:hidden" 
            onClick={() => setShowDropdown(false)}
          />
          
          <div className="absolute right-0 top-full mt-3 w-72 rounded-xl border bg-popover/95 backdrop-blur-md p-0 text-popover-foreground shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200">
            {/* Header Section */}
            <div className="px-4 py-3 border-b bg-gradient-to-r from-primary/5 to-transparent rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm",
                  isAdmin 
                    ? "bg-gradient-to-br from-purple-500 to-purple-700 text-white" 
                    : "bg-gradient-to-br from-primary/80 to-primary text-primary-foreground"
                )}>
                  {getInitials()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-sm truncate">{getDisplayName()}</div>
                    {isAdmin && (
                      <Badge className="text-white text-xs border-0 shadow-sm">
                        <Shield className="w-3 h-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                    <span className="text-xs text-green-600 font-medium">Online</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation Section */}
            <div className="p-2">
              <Link to="/profile" onClick={() => setShowDropdown(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-10 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  <User className="w-4 h-4 mr-3 text-primary" />
                  <span>Manage Profile</span>
                </Button>
              </Link>
            </div>
            
            <div className="h-px bg-border mx-2" />
            
            {/* Saved Items Section */}
            <div className="p-2">
              <div className="px-2 py-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Saved Items
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <Link to="/saved-notes" onClick={() => setShowDropdown(false)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs h-9 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5 mr-2 text-blue-600" />
                      Notes
                    </Button>
                  </Link>
                  <Link to="/saved-resources" onClick={() => setShowDropdown(false)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs h-9 rounded-lg hover:bg-green-50 hover:text-green-700 transition-colors"
                    >
                      <FolderOpen className="w-3.5 h-3.5 mr-2 text-green-600" />
                      Resources
                    </Button>
                  </Link>
                  <Link to="/saved-projects" onClick={() => setShowDropdown(false)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs h-9 rounded-lg hover:bg-orange-50 hover:text-orange-700 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 mr-2 text-orange-600" />
                      Projects
                    </Button>
                  </Link>
                  <Link to="/saved-blogs" onClick={() => setShowDropdown(false)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs h-9 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors"
                    >
                      <Bookmark className="w-3.5 h-3.5 mr-2 text-purple-600" />
                      Blogs
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="h-px bg-border mx-2" />
            
            {/* Footer Section */}
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm h-10 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors rounded-lg"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Sign Out Button Component
export const SignOutButton = ({ children, className, ...props }) => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  if (children) {
    return (
      <div onClick={handleSignOut} className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <Button onClick={handleSignOut} className={className} {...props}>
      Sign Out
    </Button>
  );
};
