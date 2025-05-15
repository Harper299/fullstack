import { useState, useEffect } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import type { User } from '@/types';
import { onAuthStateChange, getCurrentUser } from '@/services/auth';

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  firebaseUser: FirebaseUser | null;
  user: User | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    firebaseUser: null,
    user: null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        const user = await getCurrentUser();
        setState({
          isLoading: false,
          isAuthenticated: true,
          firebaseUser,
          user
        });
      } else {
        setState({
          isLoading: false,
          isAuthenticated: false,
          firebaseUser: null,
          user: null
        });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return state;
}
