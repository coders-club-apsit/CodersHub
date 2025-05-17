import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { clerkClient } from '@clerk/clerk-sdk-node';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors({
  origin: 'http://localhost:3001', // Your frontend URL
  credentials: true
}));
app.use(express.json());

// Admin middleware - check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    // Get auth token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token with Clerk
    const { sub } = await clerkClient.verifyToken(token);
    
    // Get user from Clerk
    const user = await clerkClient.users.getUser(sub);
    const userEmail = user.emailAddresses[0]?.emailAddress;
    
    if (!userEmail) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Check if user is admin
    const adminEmails = process.env.VITE_ADMIN_EMAILS?.split(',') || [];
    if (adminEmails.map(e => e.toLowerCase()).includes(userEmail.toLowerCase())) {
      req.userId = sub;
      next();
    } else {
      res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Get all users - Admin only endpoint
app.get('/api/admin/users', isAdmin, async (req, res) => {
  try {
    const users = await clerkClient.users.getUserList({
      limit: 100,
      orderBy: '-created_at',
    });
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});