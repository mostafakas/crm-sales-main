import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8fBOxaUeHlhbpSrFcxwR34OXpN4ygEp0",
  authDomain: "salescrm-15f34.firebaseapp.com",
  projectId: "salescrm-15f34",
  storageBucket: "salescrm-15f34.firebasestorage.app",
  messagingSenderId: "224518640251",
  appId: "1:224518640251:web:99a0c95cdcd7fa00f308de"
};

// Initialize Firebase (singleton pattern for Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
