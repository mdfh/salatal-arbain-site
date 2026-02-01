"use client";

import { useLang } from "./LangProvider";


export default function Footer() {
  const { lang } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="w-full bg-gradient-to-b from-[#2C5F34] to-[#1B3B20]">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <p className="text-white/90 text-2xl md:text-3xl font-medium tracking-wide font-en">
            Ma’arif at Tajweed
          </p>

          <p className="mt-4 text-white/70 text-sm">
            © {year}{" "}
            {lang === "ur"
              ? "معارف التجوید — جملہ حقوق محفوظ ہیں"
              : "Ma’arif at Tajweed — All rights reserved"}
          </p>
        </div>
      </div>
    </footer>
  );
}
