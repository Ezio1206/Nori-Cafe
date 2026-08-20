// Firebase initialization for Nori Coffee.
//
// Fill in your project's credentials in a `.env` file at the project root
// (copy `.env.example` to `.env` first). These come from:
// Firebase Console -> Project settings -> General -> "Your apps" -> SDK setup and configuration.
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Note: Firebase Storage is intentionally not used. Drink images are plain
// URL strings stored directly on the drink's Firestore document.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
