import { type FirebaseApp, getApp, initializeApp } from "firebase/app"
import { type Auth, connectAuthEmulator, getAuth } from "firebase/auth"
import { connectFirestoreEmulator, type Firestore, getFirestore } from "firebase/firestore"
import { connectFunctionsEmulator, type Functions, getFunctions } from "firebase/functions"

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
  };
}

interface EnvOptionsFilled {
  env: "test" | "prod";
  port: {
    auth: number;
    functions: number;
    firestore: number;
  };
}

const DEFAULT_PORT = {
  AUTH: 9099,
  FUNCTIONS: 5001,
  FIRESTORE: 8080
}

export async function BuildFirebase(
  firebase_config: FirebaseConfig,
  an_app_name: string,
  opts: EnvOptions
): Promise<FirebaseEntity> {
  const opt_filled: EnvOptionsFilled = {
    env: opts.env,
    port: {
      auth: Boolean(opts.port) && Boolean(opts.port!.auth)
        ? opts.port!.auth!
        : DEFAULT_PORT.AUTH,
      functions: Boolean(opts.port) && Boolean(opts.port!.functions)
        ? opts.port!.functions!
        : DEFAULT_PORT.FIRESTORE,
      firestore: Boolean(opts.port) && Boolean(opts.port!.firestore)
        ? opts.port!.firestore!
        : DEFAULT_PORT.FIRESTORE
    }
  }
  const { exists, an_app } = appExists(an_app_name)
  return exists
    ? getServicesRef(an_app)
    : await buildServices(initializeApp(firebase_config, an_app_name), opt_filled)
}

interface AppExistsTrue {
  exists: true
  an_app: FirebaseApp
}
interface AppExistsFalse {
  exists: false
  an_app: undefined
}
type AppExists = AppExistsTrue | AppExistsFalse
function appExists(name: string): AppExists {
  try {
    const an_app = getApp(name)
    return { exists: true, an_app }
  } catch (error) {
    return { exists: false, an_app: undefined }
  }
}

async function buildServices(firebase_ref: FirebaseApp, opts: EnvOptionsFilled) {
  const AUTH_WEB = getAuth(firebase_ref)
  const CLOUD_FUNCTIONS_WEB = getFunctions(firebase_ref)
  const FIRESTORE_WEB = getFirestore(firebase_ref)
  if (opts.env === "test") {
    const auth_url = `http://localhost:${opts.port.auth}`
    await fetch(auth_url)
    connectAuthEmulator(AUTH_WEB, auth_url, {
      disableWarnings: true
    })
    connectFunctionsEmulator(CLOUD_FUNCTIONS_WEB, "localhost", opts.port.functions)
    connectFirestoreEmulator(FIRESTORE_WEB, "localhost", opts.port.firestore)
  }
  return { AUTH_WEB, CLOUD_FUNCTIONS_WEB, FIRESTORE_WEB }
}

function getServicesRef(firebase_ref: FirebaseApp) {
  return {
    AUTH_WEB: getAuth(firebase_ref),
    CLOUD_FUNCTIONS_WEB: getFunctions(firebase_ref),
    FIRESTORE_WEB: getFirestore(firebase_ref)
  }
}
