"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "en" | "ur";

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

const LangContext = createContext<LangContextValue | null>(null);

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}

function applyHtmlAttributes(lang: Lang) {
  const isUrdu = lang === "ur";
  document.documentElement.lang = isUrdu ? "ur" : "en";
  document.documentElement.dir = isUrdu ? "rtl" : "ltr";
}

export default function LangProvider({ children }: { children: React.ReactNode }) {
  // Lazy initialization: no effect needed to set initial state
  const [lang, setLangState] = useState<Lang>("en");

  // Only side-effect: reflect lang onto <html>
  useEffect(() => {
    applyHtmlAttributes(lang);
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("lang", l);
    }
  };

  const value = useMemo(() => ({ lang, setLang }), [lang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}
