export async function getDownloadCount(): Promise<number> {
  const res = await fetch("/api/downloads", { cache: "no-store" });
  const data = (await res.json()) as { count: number };
  return Number(data.count ?? 0);
}

export function incrementDownloadCount(payload: { lang: "en" | "ur"; file: string }) {
  try {
    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    const ok = navigator.sendBeacon("/api/downloads", blob);
    if (ok) return;
  } catch {}

  void fetch("/api/downloads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  });
}
