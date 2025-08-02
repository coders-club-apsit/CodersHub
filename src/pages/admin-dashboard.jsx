import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Trash2, Search, Filter, ChevronDown, Download, Mail, Calendar, Settings, Plus, Ban, RefreshCw, Upload, FileSpreadsheet, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/contexts/AuthContext';
import { getAllUsers, deleteUser as deleteUserApi, banUser, unbanUser, sendPasswordResetEmail, createUser, bulkCreateUsers } from '@/api/api-admin';
import { toast } from 'sonner';
import ErrorBoundary from '@/components/ErrorBoundary';
import Papa from 'papaparse';

const AdminDashboard = () => {
  const { user, isAdmin } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkUploadFile, setBulkUploadFile] = useState(null);
  const [bulkUploadResults, setBulkUploadResults] = useState(null);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [createUserData, setCreateUserData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    adminUsers: 0
  });

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      window.location.href = '/access-denied';
    }
  }, [isAdmin]);

  // Fetch users and stats
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Get real users from Supabase using admin API
      const { data: usersData, error } = await getAllUsers();
      
      if (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users: ' + (error.message || 'Unknown error'));
        return;
      }

      // Get admin emails from environment
      const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',').map(email => email.trim().toLowerCase()) || [];

      // Format users data
      const formattedUsers = usersData.map(user => ({
        id: user.id,
        email: user.email,
        emailConfirmed: !!user.email_confirmed_at,
        createdAt: user.created_at,
        lastSignIn: user.last_sign_in_at,
        provider: user.app_metadata?.provider || 'email',
        userMetadata: user.user_metadata || {},
        rawUserMetadata: user.raw_user_metadata || {},
        isAdmin: adminEmails.includes(user.email?.toLowerCase()),
        isBanned: user.user_metadata?.banned || false,
        banReason: user.user_metadata?.ban_reason || null
      }));

      setUsers(formattedUsers);
      
      // Calculate stats
      const totalUsers = formattedUsers.length;
      const activeUsers = formattedUsers.filter(u => u.lastSignIn).length;
      const pendingUsers = formattedUsers.filter(u => !u.emailConfirmed).length;
      const adminUsers = formattedUsers.filter(u => u.isAdmin).length;

      setStats({
        totalUsers,
        activeUsers,
        pendingUsers,
        adminUsers
      });

    } catch (error) {
      console.error('Error in fetchUsers:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const searchMatch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return searchMatch;
    if (filterStatus === 'active') return searchMatch && user.lastSignIn && !user.isBanned;
    if (filterStatus === 'pending') return searchMatch && !user.emailConfirmed;
    if (filterStatus === 'admin') return searchMatch && user.isAdmin;
    if (filterStatus === 'banned') return searchMatch && user.isBanned;
    
    return searchMatch;
  });

  // Delete user function
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      toast.loading('Deleting user...');
      
      const { error } = await deleteUserApi(userId);
      
      if (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user: ' + (error.message || 'Unknown error'));
        return;
      }

      toast.success('User deleted successfully');
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error in deleteUser:', error);
      toast.error('Failed to delete user');
    }
  };

  // Ban user function
  const handleBanUser = async (userId, reason = '') => {
    if (!window.confirm('Are you sure you want to ban this user?')) {
      return;
    }

    try {
      toast.loading('Banning user...');
      
      const { error } = await banUser(userId, reason);
      
      if (error) {
        console.error('Error banning user:', error);
        toast.error('Failed to ban user: ' + (error.message || 'Unknown error'));
        return;
      }

      toast.success('User banned successfully');
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error in banUser:', error);
      toast.error('Failed to ban user');
    }
  };

  // Unban user function
  const handleUnbanUser = async (userId) => {
    if (!window.confirm('Are you sure you want to unban this user?')) {
      return;
    }

    try {
      toast.loading('Unbanning user...');
      
      const { error } = await unbanUser(userId);
      
      if (error) {
        console.error('Error unbanning user:', error);
        toast.error('Failed to unban user: ' + (error.message || 'Unknown error'));
        return;
      }

      toast.success('User unbanned successfully');
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error in unbanUser:', error);
      toast.error('Failed to unban user');
    }
  };

  // Send password reset function
  const handleSendPasswordReset = async (email) => {
    try {
      toast.loading('Sending password reset email...');
      
      const { error } = await sendPasswordResetEmail(email);
      
      if (error) {
        console.error('Error sending password reset:', error);
        toast.error('Failed to send password reset: ' + (error.message || 'Unknown error'));
        return;
      }

      toast.success('Password reset email sent successfully');
    } catch (error) {
      console.error('Error in sendPasswordReset:', error);
      toast.error('Failed to send password reset email');
    }
  };

  // Create user function
  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    if (!createUserData.email || !createUserData.password) {
      toast.error('Email and password are required');
      return;
    }

    // Validate email domain
    const allowedDomain = 'apsit.edu.in';
    const emailDomain = createUserData.email.toLowerCase().split('@')[1];
    
    if (emailDomain !== allowedDomain) {
      toast.error(`Only ${allowedDomain} email addresses are allowed`);
      return;
    }

    try {
      toast.loading('Creating user...');
      
      const { error } = await createUser(
        createUserData.email,
        createUserData.password,
        { name: createUserData.name }
      );
      
      if (error) {
        console.error('Error creating user:', error);
        toast.error('Failed to create user: ' + (error.message || 'Unknown error'));
        return;
      }

      toast.success('User created successfully');
      setShowCreateUser(false);
      setCreateUserData({ email: '', password: '', name: '' });
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error in createUser:', error);
      toast.error('Failed to create user');
    }
  };

  // Handle bulk upload file selection
  const handleBulkUploadFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['.csv', '.xlsx', '.xls'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validTypes.includes(fileExtension)) {
      toast.error('Please upload a CSV or Excel file');
      return;
    }

    setBulkUploadFile(file);
    setBulkUploadResults(null);
  };

  // Process bulk upload
  const handleBulkUpload = async () => {
    if (!bulkUploadFile) {
      toast.error('Please select a file first');
      return;
    }

    setBulkUploading(true);
    
    try {
      // Parse CSV file
      Papa.parse(bulkUploadFile, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => {
          // Normalize header names
          const lowerHeader = header.toLowerCase().trim();
          if (lowerHeader.includes('email')) return 'email';
          if (lowerHeader.includes('moodle') && lowerHeader.includes('id')) return 'moodleId';
          if (lowerHeader.includes('name')) return 'name';
          return header;
        },
        complete: async (results) => {
          try {
            if (results.errors.length > 0) {
              console.error('CSV parsing errors:', results.errors);
              toast.error('Error parsing CSV file');
              return;
            }

            const userData = results.data.filter(row => row.email && row.email.trim());
            
            if (userData.length === 0) {
              toast.error('No valid email addresses found in the file');
              return;
            }

            toast.loading(`Processing ${userData.length} users...`);
            
            // Process bulk creation
            const results = await bulkCreateUsers(userData);
            setBulkUploadResults(results);
            
            toast.success(`Bulk upload completed: ${results.successful.length} created, ${results.failed.length} failed`);
            
            // Refresh user list
            fetchUsers();
            
          } catch (error) {
            console.error('Error in bulk upload:', error);
            toast.error('Failed to process bulk upload');
          } finally {
            setBulkUploading(false);
          }
        },
        error: (error) => {
          console.error('Error parsing file:', error);
          toast.error('Error reading file');
          setBulkUploading(false);
        }
      });
    } catch (error) {
      console.error('Error in handleBulkUpload:', error);
      toast.error('Failed to process file');
      setBulkUploading(false);
    }
  };

  // Download sample CSV template
  const downloadSampleCSV = () => {
    const sampleData = [
      { email: 'student1@apsit.edu.in', moodleId: 'STD001', name: 'John Doe' },
      { email: 'student2@apsit.edu.in', moodleId: 'STD002', name: 'Jane Smith' },
      { email: 'student3@apsit.edu.in', moodleId: 'STD003', name: 'Mike Johnson' }
    ];

    const csv = Papa.unparse(sampleData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk-users-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Export users to CSV
  const exportUsers = () => {
    const csvData = filteredUsers.map(user => ({
      Email: user.email,
      'Email Confirmed': user.emailConfirmed ? 'Yes' : 'No',
      'Created At': new Date(user.createdAt).toLocaleDateString(),
      'Last Sign In': user.lastSignIn ? new Date(user.lastSignIn).toLocaleDateString() : 'Never',
      Provider: user.provider,
      'Is Admin': user.isAdmin ? 'Yes' : 'No'
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              size="sm"
              className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 mt-2">Manage users and system settings</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => setShowCreateUser(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create User
            </Button>
            <Button onClick={() => setShowBulkUpload(true)} className="bg-green-600 hover:bg-green-700">
              <Upload className="w-4 h-4 mr-2" />
              Bulk Upload
            </Button>
            <Button onClick={fetchUsers} variant="outline" className="bg-gray-800 border-gray-700 hover:bg-gray-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={exportUsers} variant="outline" className="bg-gray-800 border-gray-700 hover:bg-gray-700">
              <Download className="w-4 h-4 mr-2" />
              Export Users
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-2xl font-bold text-white">{stats.totalUsers}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-300 rounded-full" />
                </div>
                <span className="text-2xl font-bold text-white">{stats.activeUsers}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Pending Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-yellow-400" />
                <span className="text-2xl font-bold text-white">{stats.pendingUsers}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                <span className="text-2xl font-bold text-white">{stats.adminUsers}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48 bg-gray-900 border-gray-700 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active Users</SelectItem>
              <SelectItem value="pending">Pending Verification</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
              <SelectItem value="banned">Banned Users</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Users ({filteredUsers.length})</CardTitle>
              <CardDescription className="text-gray-400">
                Manage and monitor user accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={user.userMetadata?.avatar_url} />
                          <AvatarFallback className="bg-gray-700 text-white">
                            {user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-white">{user.email}</p>
                            {user.isAdmin && (
                              <Badge variant="secondary" className="bg-purple-600 text-white">
                                Admin
                              </Badge>
                            )}
                            {!user.emailConfirmed && (
                              <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                                Unverified
                              </Badge>
                            )}
                            {user.isBanned && (
                              <Badge variant="destructive" className="bg-red-600 text-white">
                                Banned
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>Created: {new Date(user.createdAt).toLocaleDateString()}</span>
                            <span>
                              Last active: {user.lastSignIn ? new Date(user.lastSignIn).toLocaleDateString() : 'Never'}
                            </span>
                            <Badge variant="outline" className="border-gray-600 text-gray-300">
                              {user.provider}
                            </Badge>
                          </div>
                          {user.isBanned && user.banReason && (
                            <div className="text-xs text-red-400 mt-1">
                              Ban reason: {user.banReason}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 hover:bg-gray-600">
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-900 border-gray-700 text-white">
                            <DialogHeader>
                              <DialogTitle>User Details</DialogTitle>
                              <DialogDescription className="text-gray-400">
                                Complete information for {user.email}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm font-medium text-gray-300">User ID</p>
                                <p className="text-xs text-gray-400 font-mono">{user.id}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-300">Email</p>
                                <p className="text-white">{user.email}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-300">Status</p>
                                <div className="flex gap-2 mt-1">
                                  <Badge variant={user.emailConfirmed ? "default" : "outline"}>
                                    {user.emailConfirmed ? 'Verified' : 'Pending Verification'}
                                  </Badge>
                                  {user.isBanned && (
                                    <Badge variant="destructive">Banned</Badge>
                                  )}
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-300">Provider</p>
                                <p className="text-white capitalize">{user.provider}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-300">User Metadata</p>
                                <pre className="text-xs text-gray-400 bg-gray-800 p-2 rounded overflow-auto max-h-32">
                                  {JSON.stringify(user.userMetadata, null, 2)}
                                </pre>
                              </div>
                              <div className="flex gap-2 pt-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSendPasswordReset(user.email)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  <Mail className="w-4 h-4 mr-2" />
                                  Send Password Reset
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        {/* Ban/Unban Button */}
                        {user.isBanned ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnbanUser(user.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Unban
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBanUser(user.id, 'Banned by admin')}
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                          >
                            <Ban className="w-4 h-4" />
                          </Button>
                        )}
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteUser(user.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                  
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      No users found matching your criteria
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Create User Dialog */}
        <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
          <DialogContent className="bg-gray-900 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription className="text-gray-400">
                Create a new user account with email and password
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="user@apsit.edu.in"
                  value={createUserData.email}
                  onChange={(e) => setCreateUserData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={createUserData.password}
                  onChange={(e) => setCreateUserData(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">
                  Full Name (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="Enter full name"
                  value={createUserData.name}
                  onChange={(e) => setCreateUserData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateUser(false)}
                  className="bg-gray-800 border-gray-700 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create User
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Bulk Upload Dialog */}
        <Dialog open={showBulkUpload} onOpenChange={setShowBulkUpload}>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl">
            <DialogHeader>
              <DialogTitle>Bulk Upload Users</DialogTitle>
              <DialogDescription className="text-gray-400">
                Upload a CSV or Excel file with user data. Password will be auto-generated as moodleId@Apsit
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* File Format Instructions */}
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <h4 className="text-blue-200 font-medium mb-2">File Format Requirements:</h4>
                <ul className="text-blue-300/80 text-sm space-y-1">
                  <li>• <strong>email</strong>: APSIT email address (required)</li>
                  <li>• <strong>moodleId</strong>: Student Moodle ID (required for password generation)</li>
                  <li>• <strong>name</strong>: Full name (optional)</li>
                  <li>• Password will be auto-generated as: <code className="bg-gray-800 px-1 rounded">moodleId@Apsit</code></li>
                </ul>
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadSampleCSV}
                    className="bg-blue-800 border-blue-600 hover:bg-blue-700 text-blue-100"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Sample CSV
                  </Button>
                </div>
              </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-gray-300">Choose a CSV or Excel file to upload</p>
                  <p className="text-sm text-gray-500">Supported formats: .csv, .xlsx, .xls</p>
                </div>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleBulkUploadFile}
                  className="hidden"
                  id="bulk-upload-file"
                />
                <label
                  htmlFor="bulk-upload-file"
                  className="inline-block mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg cursor-pointer transition-colors"
                >
                  Select File
                </label>
              </div>

              {/* Selected File Info */}
              {bulkUploadFile && (
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-white font-medium">{bulkUploadFile.name}</p>
                      <p className="text-sm text-gray-400">
                        Size: {(bulkUploadFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setBulkUploadFile(null)}
                    variant="outline"
                    size="sm"
                    className="bg-red-600 border-red-500 hover:bg-red-700"
                  >
                    Remove
                  </Button>
                </div>
              )}

              {/* Upload Results */}
              {bulkUploadResults && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-green-900/20 border-green-500/30">
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-green-400">{bulkUploadResults.successful.length}</p>
                        <p className="text-sm text-green-300">Successful</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-red-900/20 border-red-500/30">
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-red-400">{bulkUploadResults.failed.length}</p>
                        <p className="text-sm text-red-300">Failed</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-900/20 border-blue-500/30">
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-blue-400">{bulkUploadResults.total}</p>
                        <p className="text-sm text-blue-300">Total</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Detailed Results */}
                  <div className="max-h-64 overflow-y-auto">
                    {bulkUploadResults.failed.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-red-400 font-medium mb-2">Failed Uploads:</h5>
                        <div className="space-y-1">
                          {bulkUploadResults.failed.map((item, index) => (
                            <div key={index} className="text-sm bg-red-900/20 p-2 rounded">
                              <span className="text-red-300">{item.email}</span>
                              <span className="text-red-400 ml-2">- {item.error}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {bulkUploadResults.successful.length > 0 && (
                      <div>
                        <h5 className="text-green-400 font-medium mb-2">Successful Uploads:</h5>
                        <div className="space-y-1">
                          {bulkUploadResults.successful.slice(0, 10).map((item, index) => (
                            <div key={index} className="text-sm bg-green-900/20 p-2 rounded">
                              <span className="text-green-300">{item.email}</span>
                              <span className="text-green-400 ml-2">- Password: {item.password}</span>
                            </div>
                          ))}
                          {bulkUploadResults.successful.length > 10 && (
                            <p className="text-sm text-gray-400">
                              ... and {bulkUploadResults.successful.length - 10} more
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowBulkUpload(false);
                    setBulkUploadFile(null);
                    setBulkUploadResults(null);
                  }}
                  className="bg-gray-800 border-gray-700 hover:bg-gray-700"
                >
                  Close
                </Button>
                {bulkUploadFile && !bulkUploadResults && (
                  <Button
                    onClick={handleBulkUpload}
                    disabled={bulkUploading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {bulkUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Users
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const AdminDashboardPage = () => {
  return (
    <ErrorBoundary>
      <AdminDashboard />
    </ErrorBoundary>
  );
};

export default AdminDashboardPage;
