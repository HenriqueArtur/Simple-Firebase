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

export interface EnvOptions {
  env: "test" | "prod";
  port?: {
    auth?: number;
    functions?: number;
    firestore?: number;
    hosting?: number;
  };
}

interface EnvOptionsFilled {
  env: "test" | "prod";
  port: {
    auth: number;
    functions: number;
    firestore: number;
    hosting: number;
  };
}

export async function BuildFirebase(
  firebaseConfig: FirebaseConfig,
  anAppName: string,
  opts: EnvOptions
): Promise<FirebaseEntity> {
  const optFilled: EnvOptionsFilled = {
    env: opts.env,
    port: {
      auth: opts.port && opts.port.auth ? opts.port.auth : 9099,
      functions: opts.port && opts.port.functions ? opts.port.functions : 5001,
      firestore: opts.port && opts.port.firestore ? opts.port.firestore : 8080,
      hosting: opts.port && opts.port.hosting ? opts.port.hosting : 5000
    }
  };
  const anApp = appExists(anAppName);
  return anApp
    ? getServicesRef(anApp)
    : await buildServices(initializeApp(firebaseConfig, anAppName), optFilled);
}

function appExists(name: string): FirebaseApp | undefined {
  try {
    return getApp(name);
  } catch (error) {
    return;
  }
}

async function buildServices(firebaseRef: FirebaseApp, opts: EnvOptionsFilled) {
  const AUTH_WEB = getAuth(firebaseRef);
  const CLOUD_FUNCTIONS_WEB = getFunctions(firebaseRef);
  const FIRESTORE_WEB = getFirestore(firebaseRef);
  if (opts.env == "test") {
    const authUrl = `http://localhost:${opts.port.auth}`;
    await fetch(authUrl);
    connectAuthEmulator(AUTH_WEB, authUrl, {
      disableWarnings: true
    });
    connectFunctionsEmulator(CLOUD_FUNCTIONS_WEB, "localhost", opts.port.functions);
    connectFirestoreEmulator(FIRESTORE_WEB, "localhost", opts.port.firestore);
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
