import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { seedDatabase } from '../lib/seed';

/**
 * Component that handles database seeding.
 * It only attempts to seed when an administrative user is logged in,
 * avoiding permission errors for general users.
 */
const DatabaseSeeder: React.FC = () => {
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    // Only attempt seeding if we have an admin session
    // This ensures request.auth.token.email is available for Firestore rules
    if (user && isAdmin) {
      seedDatabase();
    }
  }, [user, isAdmin]);

  return null; // This is a utility component, no UI
};

export default DatabaseSeeder;
