"use client";

import React from "react";
import { useLang } from "./LangProvider";

export default function LangSelector() {
  const { lang, setLang } = useLang();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as "en" | "sv" | "ar";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "15px",
        right: "20px",
        zIndex: 2000,
      }}
    >
      <select
        value={lang}
        onChange={handleChange}
        style={{
          padding: "6px 10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          background: "white",
          fontSize: "0.9rem",
        }}
      >
        <option value="en">English</option>
        <option value="sv">Svenska</option>
        <option value="ar">العربية</option>
      </select>
    </div>
  );
}

