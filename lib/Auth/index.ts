import { type Email } from "@src/types.js"
import { type Auth, signInWithEmailAndPassword } from "firebase/auth"

export function BuildFirebaseAuth(a_firebase_auth: Auth) {
  return {
    signInWithEmail: async (email: Email, password: string) =>
      await signInWithEmailAndPassword(a_firebase_auth, email, password),
    signOut: async () => { await a_firebase_auth.signOut() },
    isLoggedIn: () => {
      if (a_firebase_auth.currentUser === null)
        return null
      return a_firebase_auth.currentUser
    }
  }
}
