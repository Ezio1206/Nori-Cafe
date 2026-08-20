import { createContext, useContext, useEffect, useState } from 'react';
import { subscribeToAuthChanges, logout as firebaseLogout } from '../firebase/auth';
import { getUserById } from '../firebase/firestore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null); // Firestore users/{uid} doc (has role)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (user) => {
      setFirebaseUser(user);
      if (user) {
        const userProfile = await getUserById(user.uid);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function refreshProfile() {
    if (firebaseUser) {
      const userProfile = await getUserById(firebaseUser.uid);
      setProfile(userProfile);
    }
  }

  async function logout() {
    await firebaseLogout();
  }

  const value = {
    user: firebaseUser,
    profile,
    role: profile?.role || null,
    isAdmin: profile?.role === 'admin',
    loading,
    refreshProfile,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
