"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { LangCode, SUPPORTED_LANGS, DEFAULT_LANG } from "./i18nConfig";

export type Lang = LangCode;

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

const LangContext = createContext<Ctx | null>(null);

const ALLOWED_CODES: LangCode[] = SUPPORTED_LANGS.map((l) => l.code);

function normalizeLang(value: string | null | undefined): Lang {
  const fallback: Lang = DEFAULT_LANG;
  if (!value) return fallback;
  const v = value as LangCode;
  return ALLOWED_CODES.includes(v) ? v : fallback;
}

function readCookieLang(): Lang | null {
  try {
    const m = document.cookie.match(new RegExp("(^| )lang=([^;]+)"));
    if (!m) return null;
    return normalizeLang(decodeURIComponent(m[2]));
  } catch {
    return null;
  }
}

function writeCookieLang(lang: Lang) {
  document.cookie = `lang=${encodeURIComponent(lang)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

function readInitial(fallback: Lang): Lang {
  const c = readCookieLang();
  if (c) return c;

  try {
    const stored =
      (typeof window !== "undefined" && localStorage.getItem("lang")) || fallback;
    return normalizeLang(stored);
  } catch {
    return fallback;
  }
}

export default function LangProvider({
  children,
  initialLang,
}: {
  children: React.ReactNode;
  initialLang: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(normalizeLang(initialLang));

  // On mount, reconcile with cookie/localStorage (cookie remains authoritative)
  useEffect(() => {
    const initial = readInitial(normalizeLang(initialLang));
    setLangState(initial);

    try {
      localStorage.setItem("lang", initial);
    } catch {}

    try {
      writeCookieLang(initial);
    } catch {}
  }, [initialLang]);

  function setLang(next: Lang) {
    setLangState(next);
    try {
      localStorage.setItem("lang", next);
    } catch {}
    try {
      writeCookieLang(next);
    } catch {}
  }

  const value = useMemo<Ctx>(() => ({ lang, setLang }), [lang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): Ctx {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}

