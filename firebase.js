// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHfCawp53DLnlQsqiGd8L4Nify3p4zd_w",
  authDomain: "expand-global-website.firebaseapp.com",
  projectId: "expand-global-website",
  storageBucket: "expand-global-website.firebasestorage.app",
  messagingSenderId: "774607729532",
  appId: "1:774607729532:web:49781f43c212b84befeaf9",
  measurementId: "G-4NKW3XVVEG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);