import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserIcon, 
  Settings, 
  BookOpen, 
  FolderOpen, 
  FileText, 
  Bookmark,
  Shield,
  Mail,
  Calendar,
  Clock,
  Edit2,
  Save,
  X,
  ArrowLeft,
  LogOut,
  Star,
  Award,
  Users,
  TrendingUp,
  Activity
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUserProfile, signOut, isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  useEffect(() => {
    if (user?.user_metadata) {
      setProfileData({
        firstName: user.user_metadata.first_name || '',
        lastName: user.user_metadata.last_name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!profileData.firstName.trim() || !profileData.lastName.trim()) {
      toast.error('First name and last name are required');
      return;
    }

    setLoading(true);
    try {
      const { error } = await updateUserProfile({
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        full_name: `${profileData.firstName} ${profileData.lastName}`
      });

      if (error) {
        toast.error('Failed to update profile: ' + error.message);
      } else {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    toast.success('Signed out successfully');
  };

  const getInitials = () => {
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name[0]}${user.user_metadata.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md shadow-lg border-0 bg-card/60 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
              <p className="text-muted-foreground mb-6">Please sign in to view your profile and access personalized features.</p>
              <Button asChild className="w-full">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go to Home
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 p-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Enhanced Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild className="hover:bg-white/10 transition-colors">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Profile
                </h1>
                <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Enhanced Profile Info Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="xl:col-span-1"
            >
              <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm">
                <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent"></div>
                <CardHeader className="text-center -mt-12 pb-2">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                        <AvatarImage src={user?.user_metadata?.avatar_url} />
                        <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-background flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="flex items-center justify-center gap-2 text-xl">
                    {user?.user_metadata?.full_name || 'User'}
                    {isAdmin && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-md">
                        <Shield className="w-3 h-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center justify-center gap-2 text-base">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Account Info */}
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Member since</div>
                        <div className="text-muted-foreground">{formatDate(user?.created_at)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">Last active</div>
                        <div className="text-muted-foreground">{formatDate(user?.last_sign_in_at)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                  
                  <Button 
                    variant="outline" 
                    className="w-full group hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit2 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Main Content */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="xl:col-span-3"
            >
              {/* Enhanced Tab Navigation */}
              <div className="flex flex-wrap gap-2 bg-card/60 backdrop-blur-sm p-2 rounded-xl mb-8 border-0 shadow-lg">
                {[
                  { id: 'overview', label: 'Overview', icon: UserIcon },
                  { id: 'notes', label: 'Notes', icon: BookOpen },
                  { id: 'resources', label: 'Resources', icon: FolderOpen },
                  { id: 'projects', label: 'Projects', icon: FileText },
                  { id: 'blogs', label: 'Blogs', icon: Bookmark }
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                        : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </motion.button>
                ))}
              </div>

              {/* Tab Content with Animation */}
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-primary" />
                          </div>
                          Profile Information
                        </CardTitle>
                        <CardDescription className="text-base">
                          Manage your personal information and account settings
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {isEditing ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label htmlFor="firstName" className="text-sm font-semibold text-foreground">
                                  First Name
                                </label>
                                <Input
                                  id="firstName"
                                  value={profileData.firstName}
                                  onChange={(e) => setProfileData({
                                    ...profileData,
                                    firstName: e.target.value
                                  })}
                                  placeholder="Enter first name"
                                  className="h-12 bg-background/50"
                                />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="lastName" className="text-sm font-semibold text-foreground">
                                  Last Name
                                </label>
                                <Input
                                  id="lastName"
                                  value={profileData.lastName}
                                  onChange={(e) => setProfileData({
                                    ...profileData,
                                    lastName: e.target.value
                                  })}
                                  placeholder="Enter last name"
                                  className="h-12 bg-background/50"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="email" className="text-sm font-semibold text-foreground">
                                Email Address (Read Only)
                              </label>
                              <Input
                                id="email"
                                value={profileData.email}
                                disabled
                                className="h-12 bg-muted/50 cursor-not-allowed"
                              />
                            </div>
                            <div className="flex gap-3">
                              <Button 
                                onClick={handleSaveProfile}
                                disabled={loading}
                                className="flex-1 h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                              >
                                <Save className="w-4 h-4 mr-2" />
                                {loading ? 'Saving...' : 'Save Changes'}
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => setIsEditing(false)}
                                className="h-12"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                              </Button>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                  First Name
                                </label>
                                <p className="text-xl font-medium">{user?.user_metadata?.first_name || 'Not set'}</p>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                  Last Name
                                </label>
                                <p className="text-xl font-medium">{user?.user_metadata?.last_name || 'Not set'}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                  Division
                                </label>
                                <p className="text-xl font-medium">
                                  {user?.user_metadata?.division ? (
                                    <Badge variant="outline" className="text-base px-3 py-1">
                                      Division {user.user_metadata.division}
                                    </Badge>
                                  ) : (
                                    <span className="text-gray-500">Not assigned</span>
                                  )}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                  Year
                                </label>
                                <p className="text-xl font-medium">
                                  {user?.user_metadata?.year ? (
                                    <Badge variant="outline" className="text-base px-3 py-1">
                                      {user.user_metadata.year}
                                    </Badge>
                                  ) : (
                                    <span className="text-gray-500">Not assigned</span>
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                Email Address
                              </label>
                              <p className="text-xl font-medium">{user?.email}</p>
                            </div>
                            {user?.user_metadata?.moodle_id && (
                              <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                  Moodle ID
                                </label>
                                <p className="text-xl font-medium font-mono text-blue-600">
                                  {user.user_metadata.moodle_id}
                                </p>
                              </div>
                            )}
                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                Account Type
                              </label>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge 
                                  className={`px-3 py-1 text-sm ${
                                    isAdmin 
                                      ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg" 
                                      : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                                  }`}
                                >
                                  {isAdmin ? (
                                    <>
                                      <Shield className="w-4 h-4 mr-1" />
                                      Administrator
                                    </>
                                  ) : (
                                    <>
                                      <Users className="w-4 h-4 mr-1" />
                                      Student
                                    </>
                                  )}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Enhanced Quick Actions */}
                    {/*<Card className="border-0 shadow-xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl">
                          <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                            <Settings className="w-5 h-5 text-green-600" />
                          </div>
                          Quick Actions
                        </CardTitle>
                        <CardDescription className="text-base">
                          Access your saved content and manage your learning journey
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {[
                            { to: '/saved-notes', icon: BookOpen, label: 'Saved Notes', count: '12', color: 'blue' },
                            { to: '/saved-resources', icon: FolderOpen, label: 'Resources', count: '8', color: 'green' },
                            { to: '/saved-projects', icon: FileText, label: 'Projects', count: '15', color: 'orange' },
                            { to: '/saved-blogs', icon: Bookmark, label: 'Saved Blogs', count: '7', color: 'purple' }
                          ].map((item, index) => (
                            <motion.div
                              key={item.to}
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Button 
                                variant="outline" 
                                asChild 
                                className={`h-auto p-6 flex flex-col items-center space-y-3 bg-gradient-to-br from-${item.color}-500/5 to-${item.color}-500/10 hover:from-${item.color}-500/10 hover:to-${item.color}-500/20 border-${item.color}-200/50 hover:border-${item.color}-300 transition-all duration-300 group`}
                              >
                                <Link to={item.to}>
                                  <div className={`w-12 h-12 bg-${item.color}-500/10 rounded-xl flex items-center justify-center group-hover:bg-${item.color}-500/20 transition-colors`}>
                                    <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold">{item.label}</div>
                                  </div>
                                </Link>
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>*/}

                  </motion.div>
                )}
                
                {/* Enhanced Saved Content Tabs */}
                {['notes', 'resources', 'projects', 'blogs'].map(tabId => {
                  const tabConfig = {
                    notes: { icon: BookOpen, title: 'Your Saved Notes', description: 'Access all your saved notes and study materials', color: 'blue' },
                    resources: { icon: FolderOpen, title: 'Your Saved Resources', description: 'Browse through your collection of saved learning resources', color: 'green' },
                    projects: { icon: FileText, title: 'Your Saved Projects', description: 'Explore your saved project ideas and implementations', color: 'orange' },
                    blogs: { icon: Bookmark, title: 'Your Saved Blogs', description: 'Read through your bookmarked blog articles', color: 'purple' }
                  };
                  
                  const config = tabConfig[tabId];
                  
                  return activeTab === tabId && (
                    <motion.div
                      key={tabId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="border-0 shadow-xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3 text-xl">
                            <div className={`w-10 h-10 bg-${config.color}-500/10 rounded-lg flex items-center justify-center`}>
                              <config.icon className={`w-5 h-5 text-${config.color}-600`} />
                            </div>
                            {config.title}
                          </CardTitle>
                          <CardDescription className="text-base">
                            {config.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-16">
                            <div className={`w-20 h-20 bg-${config.color}-500/10 rounded-full flex items-center justify-center mx-auto mb-6`}>
                              <config.icon className={`w-10 h-10 text-${config.color}-600`} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No {tabId} saved yet</h3>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                              Start exploring and save {tabId} that interest you. They'll appear here for easy access.
                            </p>
                            <Button asChild className={`bg-gradient-to-r from-${config.color}-500 to-${config.color}-600 hover:from-${config.color}-600 hover:to-${config.color}-700`}>
                              <Link to={`/saved-${tabId}`}>
                                <config.icon className="w-4 h-4 mr-2" />
                                Browse {config.title.split(' ').pop()}
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
