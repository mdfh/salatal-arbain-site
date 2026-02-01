import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, logEvent, type Analytics } from "firebase/analytics";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getFirestore, type Firestore } from "firebase/firestore";

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;
let storage: FirebaseStorage | null = null;
let db: Firestore | null = null;


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

export type AnalyticsParams = Record<string, unknown>;

function getOrInitApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null;
  if (!hasConfig()) return null;

  if (!app) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseStorage(): FirebaseStorage | null {
  const a = getOrInitApp();
  if (!a) return null;

  if (!storage) {
    storage = getStorage(a);
  }
  return storage;
}

export async function initFirebaseAnalytics(): Promise<Analytics | null> {
  const a = getOrInitApp();
  if (!a) return null;

  if (!analytics) {
    const supported = await isSupported();
    if (!supported) return null;
    analytics = getAnalytics(a); // keep analytics enabled
  }

  return analytics;
}

export async function track(eventName: string, params?: AnalyticsParams) {
  const a = await initFirebaseAnalytics();
  if (!a) return;
  logEvent(a, eventName, params);
}

export function getFirebaseDb(): Firestore | null {
  const a = getOrInitApp();
  if (!a) return null;

  if (!db) {
    db = getFirestore(a);
  }
  return db;
}

function hasConfig() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
  );
}
