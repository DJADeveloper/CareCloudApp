import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCy9t-s_1ePmC3sr0RevVr8T9P4852gq1U",
//   authDomain: "carecloud2-39ff9.firebaseapp.com",
//   projectId: "carecloud2-39ff9",
//   storageBucket: "carecloud2-39ff9.appspot.com",
//   messagingSenderId: "188013981817",
//   appId: "1:188013981817:web:887f0a13c3e3c20d6be4a8",
//   measurementId: "G-53CXW22DLL",
// };

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.FIREBASE_DATABASE_URL, // Server-only variable
  measurementId: process.env.FIREBASE_MEASUREMENT_ID, // Server-only variable
};

export default firebaseConfig;

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
