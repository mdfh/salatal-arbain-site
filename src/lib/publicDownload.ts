"use client";

export async function downloadFromPublic(options: {
  href: string;      // e.g. "/book-en.pdf"
  filename: string;  // e.g. "Maarif-Al-Tajweed-English.pdf"
}): Promise<void> {
  // Fetch as blob to force download with filename (works across browsers)
  const res = await fetch(options.href, { cache: "no-store" });
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
