import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUser, useAuth } from "@clerk/clerk-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { ADMIN_EMAILS } from "@/config/admin";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/Sidebar";
import { getUsers } from "@/api/api-users"; // Import the API function
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const UsersAdmin = () => {
  const { isLoaded, user } = useUser();
  const { getToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "created_at", direction: "desc" });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user && user.primaryEmailAddress?.emailAddress) {
      const email = user.primaryEmailAddress.emailAddress.toLowerCase();
      setIsAdmin(ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email));
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const token = await getToken();
      return getUsers(token);
    },
    enabled: isLoaded && isAdmin
  });

  // Sort function
  const sortedUsers = React.useMemo(() => {
    if (!users) return [];
    
    const sortableUsers = [...users];
    
    // Filter by search query
    const filteredUsers = sortableUsers.filter(user => {
      const searchLower = searchQuery.toLowerCase();
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      const email = user.emailAddresses?.[0]?.emailAddress || '';
      
      return (
        fullName.toLowerCase().includes(searchLower) || 
        email.toLowerCase().includes(searchLower)
      );
    });
    
    // Map keys to actual properties in the Clerk user object
    const getProperty = (user, key) => {
      switch(key) {
        case 'name': 
          return `${user.firstName || ''} ${user.lastName || ''}`.trim().toLowerCase();
        case 'email':
          return user.emailAddresses?.[0]?.emailAddress?.toLowerCase() || '';
        case 'created_at':
          return user.createdAt || 0;
        case 'lastSignIn':
          return user.lastSignInAt || 0;
        case 'active':
          return !user.banned;
        default:
          return user[key];
      }
    };
    
    // Sort based on current config
    return filteredUsers.sort((a, b) => {
      const aValue = getProperty(a, sortConfig.key);
      const bValue = getProperty(b, sortConfig.key);
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [users, sortConfig, searchQuery]);

  // Handle sort
  const requestSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Get sort icon
  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return null;
    
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider> {/* Add the SidebarProvider here */}
      <div className="flex bg-background text-foreground w-full relative">
        <Sidebar />
        <div className="flex flex-col flex-1 min-h-screen">
          <main className="flex-1 p-6 relative">
            <h1 className="text-3xl font-bold mb-6 text-primary">Users Management</h1>
            
            <div className="mb-6">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full bg-background text-foreground rounded-md"
                />
              </div>
            </div>
            
            <div className="rounded-md border shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:text-primary transition-colors w-[250px]"
                      onClick={() => requestSort('name')}
                    >
                      <div className="flex items-center">
                        User {getSortIcon('name')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:text-primary transition-colors"
                      onClick={() => requestSort('email')}
                    >
                      <div className="flex items-center">
                        Email {getSortIcon('email')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:text-primary transition-colors"
                      onClick={() => requestSort('created_at')}
                    >
                      <div className="flex items-center">
                        Joined Date {getSortIcon('created_at')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:text-primary transition-colors"
                      onClick={() => requestSort('lastSignIn')}
                    >
                      <div className="flex items-center">
                        Last Sign In {getSortIcon('lastSignIn')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:text-primary transition-colors"
                      onClick={() => requestSort('active')}
                    >
                      <div className="flex items-center">
                        Status {getSortIcon('active')}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // Loading skeletons
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                      </TableRow>
                    ))
                  ) : sortedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center">
                        {searchQuery ? (
                          <div className="text-muted-foreground">
                            No users matching "<span className="font-medium">{searchQuery}</span>"
                          </div>
                        ) : (
                          <div className="text-muted-foreground">No users found</div>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedUsers.map((user) => (
                      <TableRow key={user.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full overflow-hidden bg-muted">
                              {user.imageUrl ? (
                                <img src={user.imageUrl} alt={`${user.firstName} ${user.lastName}`} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary/80 font-medium text-sm">
                                  {user.firstName?.charAt(0) || user.lastName?.charAt(0) || '?'}
                                </div>
                              )}
                            </div>
                            <span>{`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'No Name'}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.emailAddresses?.[0]?.emailAddress || 'No Email'}</TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>{formatDate(user.lastSignInAt)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            !user.banned 
                              ? 'bg-green-500/20 text-green-500' 
                              : 'bg-amber-500/20 text-amber-500'
                          }`}>
                            {!user.banned ? 'Active' : 'Suspended'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Total users: {sortedUsers.length}
            </p>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UsersAdmin;