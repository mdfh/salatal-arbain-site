"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 500);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed left-4 bottom-4 z-[70] inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-black/10 bg-[#f5c24b] shadow-lg backdrop-blur hover:bg-[#dcae43] transition"
    >
      <ArrowUp size={18} className="text-black" />
    </button>
  );
}
