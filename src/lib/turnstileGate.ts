// src/lib/turnstileGate.ts
type GateFn = () => Promise<string | null>;

let gateFn: GateFn | null = null;

export function registerTurnstileGate(fn: GateFn) {
  gateFn = fn;
}

export async function requireTurnstileToken(): Promise<string | null> {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // If Turnstile isn't configured, allow download without captcha
  if (!siteKey) return "NO_CAPTCHA";

  if (!gateFn) {
    throw new Error(
      "TurnstileGateProvider is not mounted. Wrap your app with <TurnstileGateProvider />."
    );
  }

  return gateFn();
}
