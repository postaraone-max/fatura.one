"use client";

import React from "react";
import LangProvider, { type Lang } from "./LangProvider";

function readCookieLang(): Lang {
  try {
    const m = document.cookie.match(/(?:^|; )lang=([^;]+)/);
    const v = m ? decodeURIComponent(m[1]) : "";
    return v === "en" ? "en" : "sv";
  } catch {
    return "sv";
  }
}

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const initialLang = readCookieLang();
  return <LangProvider initialLang={initialLang}>{children}</LangProvider>;
}

