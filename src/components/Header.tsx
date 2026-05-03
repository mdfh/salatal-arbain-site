"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/LangProvider";
import { getDownloadCount } from "@/lib/downloadCounter";
import { Menu, X } from "lucide-react";
import DownloadButton from "@/components/DownloadButton";

export default function Header() {
  const { lang } = useLang();

  const [count, setCount] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    getDownloadCount()
      .then(setCount)
      .catch(() => setCount(0));
  }, []);

  // prevent background scroll when menu is open
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const onSuccessfulDownload = () => {};

  const items = [
    { href: "#book-presenter", label: "BOOK PRESENTER / کتاب پیش کار" },
    { href: "#about-author", label: "INTRODUCTION / تعارف" },
    { href: "#contact-us", label: "CONTACT US / رابطہ کریں" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#005c31] border-b border-black/15">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        {/* Left: Download + count */}
        <div className="flex flex-col items-start">
          <DownloadButton
            onSuccess={onSuccessfulDownload}
            label={lang === "ur" ? "ڈاؤن لوڈ کریں / Download" : "Download / ڈاؤن لوڈ کریں"}
            className="border border-black/10 hover:opacity-90 transition"
          />
        </div>

        {/* Right: Nav icon */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 p-2 text-white hover:bg-[#f5c24b] hover:text-black transition"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Drawer menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60]">
          {/* overlay */}
          <button
            aria-label="Close menu overlay"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/55"
          />

          {/* panel */}
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-[#005c31] border-l border-white/10 shadow-2xl font-en">
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
              <div className="text-sm font-semibold tracking-wider text-white/90">
                MENU
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-2 text-white/90 hover:bg-[#f5c24b] hover:text-black transition"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="p-4">
              <ul className="space-y-2">
                {items.map((it) => (
                  <li key={it.href}>
                    <a
                      href={it.href}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-xl px-3 py-3 text-white/90 hover:bg-[#f5c24b] hover:text-black transition"
                    >
                      {it.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
