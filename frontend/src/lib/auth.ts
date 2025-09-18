// src/services/auth.ts
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider, 
  signInWithPopup,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

// Register new user
export async function register({ email, password, name }: RegisterData) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set display name
    await updateProfile(user, { displayName: name });

    // Save extra info in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      email,
      createdAt: serverTimestamp(),
    });

    return { user };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// Sign in existing user
export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error: any) {
    throw new Error(error.message);
  }
}


export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    return { user };
  } catch (error: any) {
    throw new Error(error.message);
  }
}


// Sign out current user
export async function signOut() {
  try {
    await firebaseSignOut(auth);
    console.log('signout')
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// Listen for auth state changes
export function subscribeToAuthChanges(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}