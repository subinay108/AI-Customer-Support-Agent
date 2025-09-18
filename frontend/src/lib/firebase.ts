// src/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAzclme7RV1v1gokaiepp-wYIDgDmAs0ts",
  authDomain: "ai-customer-support-agen-74767.firebaseapp.com",
  projectId: "ai-customer-support-agen-74767",
  storageBucket: "ai-customer-support-agen-74767.firebasestorage.app",
  messagingSenderId: "521126987147",
  appId: "1:521126987147:web:0df56aa0f6e931abdbdb8e",
  measurementId: "G-FWKJMCT9TB"
};

// Prevent re-init in dev
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
