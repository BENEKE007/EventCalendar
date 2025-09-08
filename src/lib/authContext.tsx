import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User as FirebaseUser, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebase';
import { UserService } from './userService';
import { User, UserPreferences } from '../types/user';

// Remove the local User interface since we're importing it from types/user

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Sign in with email and password
  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      // Set persistence based on remember me
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      
      await signInWithEmailAndPassword(auth, email, password);
      // User state will be updated by onAuthStateChanged
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Update display name
      if (result.user) {
        await updateProfile(result.user, { displayName });
      }
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };


  // Sign out
  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Update user preferences
  const updateUserPreferences = async (preferences: Partial<UserPreferences>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      await UserService.updateUserPreferences(user.uid, preferences);
      setUser(prev => prev ? { ...prev, preferences: { ...prev.preferences, ...preferences } } : null);
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      await UserService.updateUserProfile(user.uid, updates);
      setUser(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    try {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setFirebaseUser(firebaseUser);
        
        if (firebaseUser) {
          try {
            // Check if user profile exists in Firestore
            const userProfile = await UserService.getUserProfile(firebaseUser.uid);
            
            if (userProfile) {
              // Update last login
              await UserService.updateLastLogin(firebaseUser.uid);
              setUser(userProfile);
            } else {
              // Create new user profile
              const newUser = await UserService.createUserProfile(firebaseUser);
              setUser(newUser);
            }
          } catch (error) {
            console.error('Error handling user profile:', error);
            // Fallback to basic user info if Firestore fails
            const fallbackUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || undefined,
              photoURL: firebaseUser.photoURL || undefined,
              role: 'basic' as const,
              createdAt: new Date(),
              lastLoginAt: new Date(),
              preferences: {
                theme: 'system' as const,
                defaultView: 'month' as const,
                defaultRegion: 'All' as const,
                notifications: {
                  email: true,
                  push: false,
                  eventReminders: true,
                },
                calendar: {
                  showWeekends: true,
                  startOfWeek: 'monday' as const,
                  timeFormat: '24h' as const,
                },
                privacy: {
                  shareEvents: false,
                  showInPublicCalendar: false,
                },
              }
            };
            setUser(fallbackUser);
          }
        } else {
          setUser(null);
        }
        
        setLoading(false);
      });
    } catch (error) {
      console.error('Error initializing auth state listener:', error);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    signOut: signOutUser,
    updateUserPreferences,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};