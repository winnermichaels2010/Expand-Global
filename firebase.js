import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC_ow2W4ZJrE9pI4ABkUfV3kIRkQx8Eju4",
  authDomain: "expand-global.firebaseapp.com",
  databaseURL: "https://expand-global-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "expand-global",
  storageBucket: "expand-global.firebasestorage.app",
  messagingSenderId: "560755259124",
  appId: "1:560755259124:web:af83b35d706978845c50a1",
  measurementId: "G-WJH5BXQJL8"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
export const db = getFirestore(app);
export const storage = getStorage(app);
export const rtdb = getDatabase(app);
export default app;
