import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Environment variables configuration with fallback for sandbox/local-dev mode
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key-neuroweave",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "neuroweave-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "neuroweave-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "neuroweave-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "888888888888",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:888888888888:web:abcdef888888"
};

// Check if we are running in full demo mode (i.e. no Firebase variables set)
export const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Custom Google provider configurations
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { app, auth, googleProvider };
export default app;
