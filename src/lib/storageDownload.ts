"use client";

import { ref, getDownloadURL } from "firebase/storage";
import { getFirebaseStorage } from "./firebase";

export async function downloadFromStorage(options: {
  storagePath: string;
  filename: string;
}): Promise<void> {
  const storage = getFirebaseStorage();
  if (!storage) {
    throw new Error("Firebase Storage is not initialized. Check NEXT_PUBLIC_* env vars.");
  }

  const fileRef = ref(storage, options.storagePath);
  const url = await getDownloadURL(fileRef);

  // Fetch as blob so we can force a real download with a filename
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to download file");

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = options.filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(objectUrl);
}
