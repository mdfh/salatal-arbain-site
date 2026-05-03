"use client";

import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/components/LangProvider";
import { track } from "@/lib/firebase";
import { downloadFromStorage } from "@/lib/storageDownload";
import { downloadFromPublic } from "@/lib/publicDownload";
import { incrementDownloadCount } from "@/lib/downloadCounter";
import { ArrowRight, ShieldCheck, X } from "lucide-react";

type DownloadButtonProps = {
  className?: string;
  label?: string;
  onSuccess?: () => void;
};

// Switch mode here (or make it env-based)
type DownloadMode = "public" | "storage";
const internetArchiveHref = "https://archive.org/details/MiladNamaHazratSyedAbdullahShahNaqshbandiQuadriRh";
const DOWNLOAD_MODE: DownloadMode =
  (process.env.NEXT_PUBLIC_DOWNLOAD_MODE as DownloadMode) ?? "public";

export default function DownloadButton({
  className,
  label,
  onSuccess,
}: DownloadButtonProps) {
  const { lang } = useLang();
  const [loading, setLoading] = useState(false);

  // Captcha gate (Cloudflare Turnstile)
  const [captchaOpen, setCaptchaOpen] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const captchaEnabled = false; //Boolean(siteKey);

  // --- Public files (Netlify/Next public folder) ---
  const publicHref = "/pdf/salawatal-arbain.pdf";

  // --- Firebase Storage paths (keep for later) ---
  const storagePath =
    lang === "ur"
      ? "pdf/salawatal-arbain.pdf"
      : "pdf/salawatal-arbain.pdf";

  const filename =
    lang === "ur" ? "salawatal-arbain.pdf" : "salawatal-arbain.pdf";

  const fileForCount = useMemo(
    () => (DOWNLOAD_MODE === "storage" ? storagePath : publicHref),
    [storagePath, publicHref]
  );

  const verifyCaptcha = async (token: string) => {
    // If no captcha configured, allow.
    if (!captchaEnabled) return true;

    const res = await fetch("/api/turnstile", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean; error?: string };
    return Boolean(data?.success);
  };

  const startDownload = async () => {

  try {
    window.open(internetArchiveHref, "_blank", "noopener,noreferrer");

    track("internet_archive_open_success", {
      lang,
      file: internetArchiveHref,
    });

    onSuccess?.();
  } catch (e) {
    track("internet_archive_open_failed", {
      lang,
      file: internetArchiveHref,
    });

    alert(lang === "ur" ? "لنک نہیں کھل سکا" : "Could not open link");
  }
};

  const onClick = async () => {
    console.log('OnClick');
    if (loading) return;

    // If captcha is enabled, show gate first.
    if (captchaEnabled) {
      setCaptchaError(null);
      setCaptchaToken(null);
      setCaptchaOpen(true);
      return;
    }

    await startDownload();
  };

  // Load Turnstile script only when needed
  useEffect(() => {
    if (!captchaEnabled || !captchaOpen) return;
    if (document.querySelector('script[data-turnstile="1"]')) return;

    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    s.async = true;
    s.defer = true;
    s.setAttribute("data-turnstile", "1");
    document.head.appendChild(s);
  }, [captchaEnabled, captchaOpen]);

  // Turnstile callback handler
  useEffect(() => {
    if (!captchaEnabled || !captchaOpen) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).onTajweedTurnstile = (token: string) => {
      setCaptchaToken(token);
      setCaptchaError(null);
    };

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).onTajweedTurnstile;
    };
  }, [captchaEnabled, captchaOpen]);

  return (
    <>
      <button
        onClick={onClick}
        className={
          "rounded-xl bg-[#f5c24b] px-5 py-2.5 text-sm font-semibold text-black disabled:opacity-60 " +
          (className ?? "")
        }
        disabled={loading}
      >
        {loading
          ? lang === "ur"
            ? "ڈاؤن لوڈ ہو رہا ہے…"
            : "Downloading…"
          : label ?? (lang === "ur" ? "ڈاؤن لوڈ" : "Download")}
      </button>

      {/* Captcha modal */}
      {captchaOpen && captchaEnabled && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
          <button
            aria-label="Close captcha"
            onClick={() => setCaptchaOpen(false)}
            className="absolute inset-0 bg-black/60"
          />

          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setCaptchaOpen(false)}
              className="absolute right-3 top-3 rounded-xl p-2 text-black/60 hover:bg-black/5"
            >
              <X size={18} />
            </button>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-2xl bg-[#f5c24b]/25 p-2">
                <ShieldCheck size={20} className="text-black" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black">Verify to download</h3>
                <p className="mt-1 text-sm text-black/70">
                  {lang === "ur"
                    ? "براہِ کرم ڈاؤن لوڈ سے پہلے کیپچا مکمل کریں۔"
                    : "Please complete the captcha before downloading."}
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-center">
              <div
                className="cf-turnstile"
                data-sitekey={siteKey}
                data-callback="onTajweedTurnstile"
              />
            </div>

            {captchaError && (
              <p className="mt-4 text-sm text-red-600">{captchaError}</p>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setCaptchaOpen(false)}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-black/70 hover:bg-black/5"
              >
                {lang === "ur" ? "منسوخ" : "Cancel"}
              </button>
              <button
                type="button"
                disabled={!captchaToken || loading}
                onClick={async () => {
                  if (!captchaToken) return;
                  setCaptchaError(null);
                  const ok = await verifyCaptcha(captchaToken);
                  if (!ok) {
                    setCaptchaError(
                      lang === "ur"
                        ? "کیپچا ویریفائی نہیں ہو سکا۔ دوبارہ کوشش کریں۔"
                        : "Captcha verification failed. Please try again."
                    );
                    return;
                  }
                  setCaptchaOpen(false);
                  await startDownload();
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-[#f5c24b] px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
              >
                {lang === "ur" ? "ڈاؤن لوڈ" : "Download"}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
