import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp,
  collection,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase';
import { User, UserPreferences, DEFAULT_USER_PREFERENCES, UserRole } from '../types/user';

const USERS_COLLECTION = 'users';

export class UserService {
  /**
   * Create a new user profile in Firestore
   */
  static async createUserProfile(firebaseUser: any, additionalData?: Partial<User>): Promise<User> {
    const userRef = doc(db, USERS_COLLECTION, firebaseUser.uid);
    
    const userData: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      photoURL: firebaseUser.photoURL || undefined,
      role: 'basic' as UserRole,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      preferences: DEFAULT_USER_PREFERENCES,
      ...additionalData
    };

    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });

    return userData;
  }

  /**
   * Get user profile from Firestore
   */
  static async getUserProfile(uid: string): Promise<User | null> {
    try {
      const userRef = doc(db, USERS_COLLECTION, uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
        } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile in Firestore
   */
  static async updateUserProfile(uid: string, updates: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Update user preferences
   */
  static async updateUserPreferences(uid: string, preferences: Partial<UserPreferences>): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, uid);
      await updateDoc(userRef, {
        'preferences': preferences,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  /**
   * Update last login timestamp
   */
  static async updateLastLogin(uid: string): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, uid);
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating last login:', error);
      // Don't throw error for last login update failures
    }
  }

  /**
   * Check if user profile exists
   */
  static async userProfileExists(uid: string): Promise<boolean> {
    try {
      const userRef = doc(db, USERS_COLLECTION, uid);
      const userSnap = await getDoc(userRef);
      return userSnap.exists();
    } catch (error) {
      console.error('Error checking user profile existence:', error);
      return false;
    }
  }

  /**
   * Get all users (admin only)
   */
  static async getAllUsers(): Promise<User[]> {
    try {
      const usersRef = collection(db, USERS_COLLECTION);
      const usersSnap = await getDocs(usersRef);
      
      return usersSnap.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
        } as User;
      });
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  /**
   * Update user role (admin only)
   */
  static async updateUserRole(uid: string, role: UserRole): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, uid);
      await updateDoc(userRef, {
        role,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }
}
