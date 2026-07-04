import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, addDoc, collection } from 'firebase/firestore';
import { auth, googleProvider, storage, db } from '../../firebase';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function loginWithGoogle() {
    return signInWithPopup(auth, googleProvider);
  }

  function logout() {
    return signOut(auth);
  }

  async function getUserProfile(userId) {
    try {
      const docSnap = await getDoc(doc(db, 'users', userId));
      return docSnap.exists() ? docSnap.data() : null;
    } catch {
      return null;
    }
  }

  async function saveUserProfile(userId, profile) {
    try {
      await setDoc(doc(db, 'users', userId), {
        ...profile,
        active: true,
        createdAt: profile.createdAt || new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.error('Failed to save user profile:', err);
    }
  }

  async function getRegisteredUsers() {
    try {
      const snap = await getDocs(collection(db, 'users'));
      return snap.docs.map((d) => ({ userId: d.id, ...d.data() }));
    } catch {
      return [];
    }
  }

  async function deleteRegisteredUser(userId) {
    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  }

  async function hasProfilePicture(userId) {
    try {
      const profile = await getUserProfile(userId);
      return !!(profile && profile.profilePicture);
    } catch {
      return false;
    }
  }

  async function updateProfilePicture(userId, pictureDataUrl) {
    try {
      const storageRef = ref(storage, `profilePictures/${userId}`);
      await uploadString(storageRef, pictureDataUrl, 'data_url');
      const downloadUrl = await getDownloadURL(storageRef);
      await setDoc(doc(db, 'users', userId), { profilePicture: downloadUrl }, { merge: true });
      return downloadUrl;
    } catch (err) {
      console.error('Failed to upload profile picture:', err);
      return null;
    }
  }

  async function getDesignRequests() {
    try {
      const snap = await getDocs(collection(db, 'designRequests'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch {
      return [];
    }
  }

  async function saveDesignRequest(request) {
    try {
      await addDoc(collection(db, 'designRequests'), {
        ...request,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Failed to save design request:', err);
    }
  }

  async function toggleUserStatus(userId) {
    try {
      const docSnap = await getDoc(doc(db, 'users', userId));
      if (docSnap.exists()) {
        const current = docSnap.data().active !== false;
        await updateDoc(doc(db, 'users', userId), { active: !current });
      }
    } catch (err) {
      console.error('Failed to toggle user status:', err);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
    getUserProfile,
    saveUserProfile,
    getRegisteredUsers,
    deleteRegisteredUser,
    hasProfilePicture,
    updateProfilePicture,
    getDesignRequests,
    saveDesignRequest,
    toggleUserStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
