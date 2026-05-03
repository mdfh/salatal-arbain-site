"use client";

import { useState } from "react";
import { track } from "@/lib/firebase";
import { saveContactMessage } from "@/lib/contactFirestore";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function ContactUsSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const n = name.trim();
    const em = email.trim();
    const msg = message.trim();

    if (!n || !em || !msg) {
      setStatus({ kind: "error", message: "Please fill in all fields." });
      track("contact_submit_invalid", { reason: "required" });
      return;
    }
    if (!isValidEmail(em)) {
      setStatus({ kind: "error", message: "Please enter a valid email." });
      track("contact_submit_invalid", { reason: "email" });
      return;
    }

    setStatus({ kind: "submitting" });

    try {
      const result = await saveContactMessage({
        name: n,
        email: em,
        message: msg,
        lang: "en",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        page: typeof window !== "undefined" ? window.location.pathname : undefined,
      });

      track("contact_submit_success", { docId: result.id });

      setStatus({ kind: "success" });
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      track("contact_submit_failed", {});
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <section id="contact-us" className="scroll-mt-24">
      <div className="bg-[#171112] py-14 font-en">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center">
            <p className="text-xs tracking-[0.35em] text-white/70">GET IN TOUCH</p>
            <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-white">
              Contact us
            </h2>
            <h2 className="mt-4 text-4xl md:text-5xl tracking-tight text-white font-urdu font-normal">
              رابطہ کریں
            </h2>
          </div>

          <form onSubmit={onSubmit} className="mx-auto mt-10 max-w-3xl">
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-white/60 mb-2">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="w-full rounded-md border border-white/15 bg-white px-4 py-3 text-base text-black outline-none focus:ring-2 focus:ring-white/40"
                  autoComplete="name"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full rounded-md border border-white/15 bg-white px-4 py-3 text-base text-black outline-none focus:ring-2 focus:ring-white/40"
                  autoComplete="email"
                  inputMode="email"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message"
                  rows={6}
                  className="w-full resize-none rounded-md border border-white/15 bg-white px-4 py-3 text-base text-black outline-none focus:ring-2 focus:ring-white/40"
                />
              </div>

              <button
                type="submit"
                disabled={status.kind === "submitting"}
                className="w-full rounded-md bg-[#f5c24b] py-4 text-sm font-semibold tracking-widest text-black hover:opacity-95 transition disabled:opacity-60"
              >
                {status.kind === "submitting" ? "SENDING…" : "SEND"}
              </button>

              {status.kind === "success" ? (
                <p className="text-center text-sm text-white/80">
                  Thanks! Your message was received.
                </p>
              ) : null}

              {status.kind === "error" ? (
                <p className="text-center text-sm text-red-200">{status.message}</p>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
