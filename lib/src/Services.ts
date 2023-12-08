import { FirebaseApp, getApp, initializeApp } from "firebase/app";
import { Auth, connectAuthEmulator, getAuth } from "firebase/auth";
import { Firestore, connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { Functions, connectFunctionsEmulator, getFunctions } from "firebase/functions";

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface FirebaseEntity {
  AUTH_WEB: Auth;
  CLOUD_FUNCTIONS_WEB: Functions;
  FIRESTORE_WEB: Firestore;
}

export async function BuildFirebase(
  firebaseConfig: FirebaseConfig,
  anAppName: string,
  ENV: "test" | "prod"
): Promise<FirebaseEntity> {
  const anApp = appExists(anAppName);
  return anApp
    ? getServicesRef(anApp)
    : await buildServices(initializeApp(firebaseConfig, anAppName), ENV);
}

function appExists(name: string): FirebaseApp | undefined {
  try {
    return getApp(name);
  } catch (error) {
    return;
  }
}

async function buildServices(firebaseRef: FirebaseApp, ENV: "test" | "prod") {
  const AUTH_WEB = getAuth(firebaseRef);
  const CLOUD_FUNCTIONS_WEB = getFunctions(firebaseRef);
  const FIRESTORE_WEB = getFirestore(firebaseRef);
  if (ENV == "test") {
    const authUrl = "http://localhost:9099";
    await fetch(authUrl);
    connectAuthEmulator(AUTH_WEB, authUrl, {
      disableWarnings: true
    });
    connectFunctionsEmulator(CLOUD_FUNCTIONS_WEB, "localhost", 5001);
    connectFirestoreEmulator(FIRESTORE_WEB, "localhost", 8080);
  }
  return { AUTH_WEB, CLOUD_FUNCTIONS_WEB, FIRESTORE_WEB };
}

function getServicesRef(firebaseRef: FirebaseApp) {
  return {
    AUTH_WEB: getAuth(firebaseRef),
    CLOUD_FUNCTIONS_WEB: getFunctions(firebaseRef),
    FIRESTORE_WEB: getFirestore(firebaseRef)
  };
}
