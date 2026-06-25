import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app;
let auth;
let db;
let storage;
let isMockEnabled = false;

// Check if valid Firebase credentials are provided
const isConfigValid = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "your_api_key_here" &&
  firebaseConfig.apiKey.length > 5;

if (isConfigValid) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log("Firebase successfully initialized.");
  } catch (error) {
    console.error("Firebase initialization failed: ", error);
    isMockEnabled = true;
  }
} else {
  console.warn("Firebase configuration is missing or invalid. Running in Mock Data Mode.");
  isMockEnabled = true;
}

const googleProvider = new GoogleAuthProvider();

export { app, auth, db, storage, googleProvider, isMockEnabled };
