import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type User } from "firebase/auth"; // Firebase's User type
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

// Define the shape of the store's state and actions
interface AuthState {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
}

// Zustand store
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,

      // Save logged-in user
      login: (userData) => set({ user: userData }),

      // Log out via Firebase
      logout: async () => {
        await signOut(auth);
        set({ user: null });
      },
    }),
    {
      name: "auth-storage", // persisted key in localStorage
      partialize: (state) => ({ user: state.user }), // only persist user
    }
  )
);

// 🔥 Sync Zustand with Firebase Auth state
onAuthStateChanged(auth, (firebaseUser) => {
  const store = useAuthStore.getState();
  if (firebaseUser) {
    store.login(firebaseUser);
    store.loading = false;
  } else {
    store.user = null;
    store.loading = false;
  }
});

export default useAuthStore;