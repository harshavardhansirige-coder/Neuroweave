import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../firebase/config';
import { supabase, isSupabaseConfigured } from '../supabase/client';
import { Profile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isDemoMode: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loginAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Sync profile logic
  const syncProfile = async (firebaseUser: User) => {
    if (!isSupabaseConfigured) {
      // Local Mock profile sync
      const mockProfile: Profile = {
        id: firebaseUser.uid,
        firebase_uid: firebaseUser.uid,
        email: firebaseUser.email || 'guest@learnforge.ai',
        display_name: firebaseUser.displayName || 'Guest Scholar',
        photo_url: firebaseUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${firebaseUser.uid}`,
        created_at: new Date().toISOString()
      };
      setProfile(mockProfile);
      localStorage.setItem('neuroweave_mock_profile', JSON.stringify(mockProfile));
      return;
    }

    try {
      // Fetch or Create profile in Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('firebase_uid', firebaseUser.uid)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile does not exist, insert it
        const newProfile = {
          firebase_uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          display_name: firebaseUser.displayName || 'Scholar',
          photo_url: firebaseUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${firebaseUser.uid}`
        };

        const { data: insertedProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (insertError) throw insertError;
        setProfile(insertedProfile);
      } else if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.error('Error syncing user profile with Supabase:', err);
    }
  };

  useEffect(() => {
    // Check if user was logged in via guest mode previously
    const storedGuestUser = localStorage.getItem('neuroweave_guest_user');
    const storedGuestProfile = localStorage.getItem('neuroweave_mock_profile');
    
    if (!isFirebaseConfigured || storedGuestUser) {
      if (storedGuestUser && storedGuestProfile) {
        setUser(JSON.parse(storedGuestUser));
        setProfile(JSON.parse(storedGuestProfile));
        setIsDemoMode(true);
        setLoading(false);
        return;
      }
    }

    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsDemoMode(false);
        await syncProfile(currentUser);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured) {
      loginAsGuest();
      return;
    }
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      await syncProfile(result.user);
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    if (!isFirebaseConfigured) {
      // Simulate guest mode using entered credentials
      simulateGuestLogin(email, email.split('@')[0]);
      return;
    }
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      await syncProfile(result.user);
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const signupWithEmail = async (email: string, password: string, name: string) => {
    if (!isFirebaseConfigured) {
      simulateGuestLogin(email, name);
      return;
    }
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      setUser(result.user);
      await syncProfile({ ...result.user, displayName: name } as User);
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const loginAsGuest = () => {
    simulateGuestLogin('scholar.demo@learnforge.ai', 'Forge Guest');
  };

  const simulateGuestLogin = (email: string, name: string) => {
    const fakeUid = 'guest-' + Math.random().toString(36).substring(2, 9);
    const mockUser = {
      uid: fakeUid,
      email: email,
      displayName: name,
      photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${fakeUid}`,
      emailVerified: true,
      metadata: {},
      providerData: []
    } as unknown as User;

    setUser(mockUser);
    setIsDemoMode(true);
    
    const mockProfile: Profile = {
      id: fakeUid,
      firebase_uid: fakeUid,
      email: email,
      display_name: name,
      photo_url: mockUser.photoURL,
      created_at: new Date().toISOString()
    };
    
    setProfile(mockProfile);
    localStorage.setItem('neuroweave_guest_user', JSON.stringify(mockUser));
    localStorage.setItem('neuroweave_mock_profile', JSON.stringify(mockProfile));
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    localStorage.removeItem('neuroweave_guest_user');
    localStorage.removeItem('neuroweave_mock_profile');
    if (isFirebaseConfigured) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error('Error logging out:', err);
      }
    }
    setUser(null);
    setProfile(null);
    setIsDemoMode(false);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      isDemoMode,
      loginWithGoogle,
      loginWithEmail,
      signupWithEmail,
      logout,
      loginAsGuest
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
