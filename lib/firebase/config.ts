import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

/* Prefer environment variables (see .env.local.example) so the Firebase
 * project isn't hardcoded in source. Falls back to the existing project so
 * this keeps working out of the box until NEXT_PUBLIC_FIREBASE_* is set on
 * Vercel / locally. */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyC8fBOxaUeHlhbpSrFcxwR34OXpN4ygEp0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "salescrm-15f34.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "salescrm-15f34",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "salescrm-15f34.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "224518640251",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:224518640251:web:99a0c95cdcd7fa00f308de",
};

// Initialize Firebase (singleton pattern for Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
