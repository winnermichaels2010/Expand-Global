const ADMIN_EMAIL = 'adminemail@gmail.com';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, addDoc, collection, query, where, orderBy, onSnapshot, writeBatch } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, set, get } from 'firebase/database';
import { auth, googleProvider, db, storage, rtdb } from '../../firebase';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// eslint-disable-next-line react/prop-types
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
    } catch (err) {
      console.error('Failed to fetch registered users:', err);
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

  async function updateProfilePicture(userId, file) {
    try {
      const imageRef = storageRef(storage, `profile-pictures/${userId}`);
      await uploadBytes(imageRef, file);
      const downloadUrl = await getDownloadURL(imageRef);

      await Promise.all([
        setDoc(doc(db, 'users', userId), { profilePicture: downloadUrl }, { merge: true }),
        set(dbRef(rtdb, `users/${userId}/profilePicture`), downloadUrl),
      ]);

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
    } catch (err) {
      console.error('Failed to fetch design requests:', err);
      return [];
    }
  }

  async function saveDesignRequest(request) {
    await addDoc(collection(db, 'designRequests'), {
      ...request,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    });
    try {
      const q = query(collection(db, 'users'), where('email', '==', ADMIN_EMAIL));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const adminUser = snap.docs[0];
        await addDoc(collection(db, 'notifications'), {
          userId: adminUser.id,
          message: `New design request from ${request.name || 'a user'} (${request.service})`,
          type: 'design_request',
          read: false,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('Failed to notify admin:', err);
    }
  }

  async function updateDesignRequest(id, data) {
    try {
      await updateDoc(doc(db, 'designRequests', id), data);
    } catch (err) {
      console.error('Failed to update design request:', err);
    }
  }

  async function rejectDesignRequest(id, reason) {
    try {
      await updateDoc(doc(db, 'designRequests', id), {
        status: 'Rejected',
        rejectReason: reason,
        rejectedAt: new Date().toISOString(),
      });
      const requestDoc = await getDoc(doc(db, 'designRequests', id));
      const requestData = requestDoc.data();
      if (requestData?.email) {
        const q = query(collection(db, 'users'), where('email', '==', requestData.email));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const user = snap.docs[0];
          await addDoc(collection(db, 'notifications'), {
            userId: user.id,
            message: `Your design request "${requestData.service}" has been rejected. Reason: ${reason}`,
            type: 'design_request',
            read: false,
            createdAt: new Date().toISOString(),
          });
        }
      }
    } catch (err) {
      console.error('Failed to reject design request:', err);
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

  // ---------- Notifications ----------

  async function getNotifications(userId) {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch {
      return [];
    }
  }

  async function getUnreadNotificationCount(userId) {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('read', '==', false)
      );
      const snap = await getDocs(q);
      return snap.size;
    } catch {
      return 0;
    }
  }

  async function markNotificationAsRead(notifId) {
    try {
      await updateDoc(doc(db, 'notifications', notifId), { read: true });
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  }

  async function deleteNotification(notifId) {
    try {
      await deleteDoc(doc(db, 'notifications', notifId));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  }

  async function deleteAllNotifications(userId) {
    try {
      const q = query(collection(db, 'notifications'), where('userId', '==', userId));
      const snap = await getDocs(q);
      const batch = writeBatch(db);
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    } catch (err) {
      console.error('Failed to delete all notifications:', err);
    }
  }

  async function addNotification(userId, message, type = 'info') {
    try {
      await addDoc(collection(db, 'notifications'), {
        userId,
        message,
        type,
        read: false,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Failed to add notification:', err);
    }
  }

  function subscribeToNotifications(userId, callback) {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(notifs);
    });
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
    updateDesignRequest,
    rejectDesignRequest,
    toggleUserStatus,
    ADMIN_EMAIL,
    getNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    deleteNotification,
    deleteAllNotifications,
    addNotification,
    subscribeToNotifications,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
