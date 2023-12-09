import { Email } from "@src/types.js";
import { Auth, signInWithEmailAndPassword } from "firebase/auth";

export function BuildFirebaseAuth(aFirebaseAuth: Auth) {
  return {
    signInWithEmail: async (email: Email, password: string) => {
      return await signInWithEmailAndPassword(aFirebaseAuth, email, password);
    },
    signOut: async () => await aFirebaseAuth.signOut(),
    isLoggedIn: () => {
      if (!aFirebaseAuth.currentUser) {
        return null;
      }
      return aFirebaseAuth.currentUser;
    }
  };
}
