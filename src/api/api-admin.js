import { supabaseAdmin } from '@/utils/supabase-admin';

// Get all users (uses service role)
export const getAllUsers = async () => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error('Error fetching users:', error);
      return { data: null, error };
    }

    return { data: data.users, error: null };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { data: null, error };
  }
};

// Delete user (uses service role)
export const deleteUser = async (userId) => {
  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (error) {
      console.error('Error deleting user:', error);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { error };
  }
};

// Update user metadata (uses service role)
export const updateUserMetadata = async (userId, metadata) => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: metadata
    });
    
    if (error) {
      console.error('Error updating user metadata:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating user metadata:', error);
    return { data: null, error };
  }
};

// Get user by ID (uses service role)
export const getUserById = async (userId) => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (error) {
      console.error('Error fetching user:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user:', error);
    return { data: null, error };
  }
};

// Invite user (uses service role)
export const inviteUser = async (email, password) => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      password,
      data: { invited_by: 'admin' }
    });
    
    if (error) {
      console.error('Error inviting user:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error inviting user:', error);
    return { data: null, error };
  }
};

// Generate email confirmation link (uses service role)
export const generateEmailConfirmationLink = async (email) => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email
    });
    
    if (error) {
      console.error('Error generating confirmation link:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error generating confirmation link:', error);
    return { data: null, error };
  }
};

// Get user statistics
export const getUserStats = async () => {
  try {
    const { data: users, error } = await getAllUsers();
    
    if (error || !users) {
      return { data: null, error };
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const stats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.last_sign_in_at).length,
      pendingUsers: users.filter(u => !u.email_confirmed_at).length,
      adminUsers: users.filter(u => {
        const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',').map(email => email.trim().toLowerCase()) || [];
        return adminEmails.includes(u.email?.toLowerCase());
      }).length,
      signupsToday: users.filter(u => new Date(u.created_at) >= today).length,
      signupsThisWeek: users.filter(u => new Date(u.created_at) >= weekAgo).length,
      signupsThisMonth: users.filter(u => new Date(u.created_at) >= monthAgo).length
    };

    return { data: stats, error: null };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return { data: null, error };
  }
};

// Ban/Unban user (uses service role)
export const banUser = async (userId, reason = '') => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { 
        banned: true, 
        ban_reason: reason,
        banned_at: new Date().toISOString()
      }
    });
    
    if (error) {
      console.error('Error banning user:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error banning user:', error);
    return { data: null, error };
  }
};

export const unbanUser = async (userId) => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { 
        banned: false, 
        ban_reason: null,
        banned_at: null,
        unbanned_at: new Date().toISOString()
      }
    });
    
    if (error) {
      console.error('Error unbanning user:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error unbanning user:', error);
    return { data: null, error };
  }
};

// Send password reset email (uses service role)
export const sendPasswordResetEmail = async (email) => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `${window.location.origin}/reset-password`
      }
    });
    
    if (error) {
      console.error('Error generating password reset link:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error generating password reset link:', error);
    return { data: null, error };
  }
};

// Create user (uses service role)
export const createUser = async (email, password, userData = {}) => {
  try {
    console.log('CreateUser API called with:', { email, userData });
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('Service role key exists:', !!import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY);
    
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name: userData.name || '',
        division: userData.division || '',
        year: userData.year || '',
        moodle_id: userData.moodle_id || userData.moodleId || '',
        ...userData
      },
      email_confirm: true // Auto-confirm email for admin-created users
    });
    
    console.log('Supabase createUser response:', { data, error });
    
    if (error) {
      console.error('Error creating user:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error creating user:', error);
    return { data: null, error };
  }
};

// Bulk create users from spreadsheet data
export const bulkCreateUsers = async (usersData) => {
  const results = {
    successful: [],
    failed: [],
    total: usersData.length
  };

  for (const userData of usersData) {
    try {
      // Validate email format
      if (!userData.email || !userData.email.includes('@')) {
        results.failed.push({
          email: userData.email || 'Invalid email',
          error: 'Invalid email format'
        });
        continue;
      }

      // Validate email domain
      const emailDomain = userData.email.toLowerCase().split('@')[1];
      if (emailDomain !== 'apsit.edu.in') {
        results.failed.push({
          email: userData.email,
          error: 'Email must be from apsit.edu.in domain'
        });
        continue;
      }

      // Generate password from moodle ID
      const password = userData.moodleId ? `${userData.moodleId}@Apsit` : 'DefaultPass@123';

      // Create user
      const { data, error } = await createUser(
        userData.email,
        password,
        {
          name: userData.name || '',
          moodle_id: userData.moodleId || userData.moodle_id || '',
          division: userData.division || '',
          year: userData.year || '',
          bulk_created: true,
          created_by: 'admin_bulk_upload'
        }
      );

      if (error) {
        results.failed.push({
          email: userData.email,
          error: error.message || 'Failed to create user'
        });
      } else {
        results.successful.push({
          email: userData.email,
          moodleId: userData.moodleId,
          password: password // Note: In production, don't return passwords
        });
      }

      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      results.failed.push({
        email: userData.email || 'Unknown',
        error: error.message || 'Unexpected error'
      });
    }
  }

  return results;
};
