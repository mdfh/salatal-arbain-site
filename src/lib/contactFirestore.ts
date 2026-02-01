import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb } from "./firebase";

export async function saveContactMessage(input: {
  name: string;
  email: string;
  message: string;
  lang?: "en" | "ur";
  userAgent?: string;
  page?: string;
}) {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firestore is not available on the server.");

  const docRef = await addDoc(collection(db, "contactMessages"), {
    ...input,
    createdAt: serverTimestamp(),
    createdAtISO: new Date().toISOString(),
  });

  return { id: docRef.id };
}
