import React, { useState } from 'react';
import { SignedIn, SignedOut, AuthButton, AuthModal, UserButton } from '@/components/auth/AuthComponents';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, User, Mail, Calendar, UserPlus, LogIn } from 'lucide-react';

const AuthDemo = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('signin');
  const { user, session, loading, isSignedIn, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            🔐 Supabase Auth Demo
          </h1>
          <p className="text-muted-foreground text-lg">
            Testing the migration from Clerk to Supabase Authentication
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Authentication Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {isSignedIn ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <Badge variant="success" className="bg-green-100 text-green-800">
                      Signed In
                    </Badge>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-500" />
                    <Badge variant="destructive" className="bg-red-100 text-red-800">
                      Signed Out
                    </Badge>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                User Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {user?.email || 'Not signed in'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Session Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {session ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Active Session
                    </Badge>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-gray-500" />
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                      No Session
                    </Badge>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Auth Components Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Signed Out Section */}
          <SignedOut>
            <Card>
              <CardHeader>
                <CardTitle>🔓 Enhanced Authentication Modal</CardTitle>
                <CardDescription>
                  You are currently signed out. Try our new unified authentication modal with signup and signin options.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AuthButton 
                    defaultTab="signin" 
                    variant="default" 
                    className="w-full"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </AuthButton>
                  
                  <AuthButton 
                    defaultTab="signup" 
                    variant="outline" 
                    className="w-full"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </AuthButton>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Or test the modal programmatically:
                  </p>
                  <div className="flex gap-2 mt-2 justify-center">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setModalTab('signin');
                        setIsModalOpen(true);
                      }}
                    >
                      Open Sign In
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setModalTab('signup');
                        setIsModalOpen(true);
                      }}
                    >
                      Open Sign Up
                    </Button>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">✨ New Features:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Unified modal with Sign In/Sign Up tabs</li>
                    <li>• Google OAuth integration</li>
                    <li>• APSIT domain restriction</li>
                    <li>• First & Last name collection</li>
                    <li>• Enhanced user profile display</li>
                    <li>• Improved error handling</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </SignedOut>

          {/* Test Modal */}
          <AuthModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            defaultTab={modalTab}
          />

          {/* Signed In Section */}
          <SignedIn>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  🔒 User Dashboard
                  <UserButton />
                </CardTitle>
                <CardDescription>
                  You are successfully signed in with Supabase Auth!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">User Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-mono">{user?.email}</span>
                    </div>
                    {user?.user_metadata?.first_name && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">First Name:</span>
                        <span>{user.user_metadata.first_name}</span>
                      </div>
                    )}
                    {user?.user_metadata?.last_name && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Name:</span>
                        <span>{user.user_metadata.last_name}</span>
                      </div>
                    )}
                    {user?.user_metadata?.full_name && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Full Name:</span>
                        <span>{user.user_metadata.full_name}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">User ID:</span>
                      <span className="font-mono text-xs">{user?.id?.substring(0, 8)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email Verified:</span>
                      <Badge variant={user?.email_confirmed_at ? "success" : "secondary"}>
                        {user?.email_confirmed_at ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="text-xs">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Session Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Session ID:</span>
                      <span className="font-mono text-xs">{session?.access_token?.substring(0, 12)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expires:</span>
                      <span className="text-xs">
                        {session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={signOut} 
                  variant="outline" 
                  className="w-full"
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </SignedIn>

          {/* Debug Info */}
          <Card>
            <CardHeader>
              <CardTitle>🐛 Debug Information</CardTitle>
              <CardDescription>
                Technical details for development purposes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm mb-1">Loading State:</h4>
                  <Badge variant={loading ? "secondary" : "outline"}>
                    {loading ? "Loading..." : "Ready"}
                  </Badge>
                </div>
                
                <div>  
                  <h4 className="font-semibold text-sm mb-1">Auth Context Values:</h4>
                  <div className="bg-muted p-3 rounded text-xs font-mono">
                    <div>isSignedIn: {String(isSignedIn)}</div>
                    <div>user: {user ? "Object" : "null"}</div>
                    <div>session: {session ? "Object" : "null"}</div>
                    <div>loading: {String(loading)}</div>
                  </div>
                </div>

                {user && (
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Raw User Object:</h4>
                    <div className="bg-muted p-3 rounded text-xs font-mono max-h-32 overflow-y-auto">
                      <pre>{JSON.stringify(user, null, 2)}</pre>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Migration Success Message */}
        <Card className="mt-8 border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              ✅ Migration Complete!
            </CardTitle>
            <CardDescription className="text-green-700">
              Successfully migrated from Clerk to Supabase Auth
            </CardDescription>
          </CardHeader>
          <CardContent className="text-green-800">
            <ul className="space-y-1 text-sm">
              <li>• Replaced all Clerk hooks with Supabase Auth hooks</li>
              <li>• Updated user object structure (email instead of primaryEmailAddress)</li>
              <li>• Created custom auth components (SignedIn, SignedOut, UserButton, etc.)</li>
              <li>• Updated session management and token handling</li>
              <li>• Removed Clerk dependencies from package.json</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthDemo;
