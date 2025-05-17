import { ADMIN_EMAILS } from "@/config/admin";

export const getUsers = async (token) => {
  try {
    // Make the API call with the provided token
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};