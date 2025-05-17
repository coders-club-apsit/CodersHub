import express from 'express';
import { clerkClient } from '@clerk/clerk-sdk-node';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    // Fetch users from Clerk API
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

// Get user by ID
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await clerkClient.users.getUser(userId);
    res.json(user);
  } catch (error) {
    console.error(`Error fetching user ${req.params.userId}:`, error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;