"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/components/LangProvider";
import { ArrowRight, ShieldCheck, X } from "lucide-react";
import { registerTurnstileGate } from "@/lib/turnstileGate";

export default function TurnstileGateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { lang } = useLang();

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const captchaEnabled = Boolean(siteKey);

  const [open, setOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  // Promise controls
  const resolverRef = useRef<((value: string | null) => void) | null>(null);

  const verifyCaptcha = async (t: string) => {
    if (!captchaEnabled) return true;

    const res = await fetch("/api/turnstile", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: t }),
    });

    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data?.success);
  };

  // Register global gate function once
  useEffect(() => {
    registerTurnstileGate(async () => {
      if (!captchaEnabled) return "NO_CAPTCHA";

      setErr(null);
      setToken(null);
      setOpen(true);

      return new Promise<string | null>((resolve) => {
        resolverRef.current = resolve;
      });
    });
  }, [captchaEnabled]);

  // Load Turnstile script only when modal opens
  useEffect(() => {
    if (!captchaEnabled || !open) return;
    if (document.querySelector('script[data-turnstile="1"]')) return;

    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    s.async = true;
    s.defer = true;
    s.setAttribute("data-turnstile", "1");
    document.head.appendChild(s);
  }, [captchaEnabled, open]);

  // Turnstile callback handler
  useEffect(() => {
    if (!captchaEnabled || !open) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).onTajweedTurnstile = (t: string) => {
      setToken(t);
      setErr(null);
    };

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).onTajweedTurnstile;
    };
  }, [captchaEnabled, open]);

  const closeAndResolve = (value: string | null) => {
    setOpen(false);
    setVerifying(false);
    setToken(null);
    setErr(null);

    resolverRef.current?.(value);
    resolverRef.current = null;
  };

  return (
    <>
      {children}

      {open && captchaEnabled && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
          <button
            aria-label="Close captcha"
            onClick={() => closeAndResolve(null)}
            className="absolute inset-0 bg-black/60"
          />

          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              aria-label="Close"
              onClick={() => closeAndResolve(null)}
              className="absolute right-3 top-3 rounded-xl p-2 text-black/60 hover:bg-black/5"
            >
              <X size={18} />
            </button>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-2xl bg-[#f5c24b]/25 p-2">
                <ShieldCheck size={20} className="text-black" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black">
                  Verify to download
                </h3>
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

            {err && <p className="mt-4 text-sm text-red-600">{err}</p>}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => closeAndResolve(null)}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-black/70 hover:bg-black/5"
              >
                {lang === "ur" ? "منسوخ" : "Cancel"}
              </button>

              <button
                type="button"
                disabled={!token || verifying}
                onClick={async () => {
                  if (!token) return;
                  setErr(null);
                  setVerifying(true);

                  const ok = await verifyCaptcha(token);
                  if (!ok) {
                    setVerifying(false);
                    setErr(
                      lang === "ur"
                        ? "کیپچا ویریفائی نہیں ہو سکا۔ دوبارہ کوشش کریں۔"
                        : "Captcha verification failed. Please try again."
                    );
                    return;
                  }

                  closeAndResolve(token);
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
