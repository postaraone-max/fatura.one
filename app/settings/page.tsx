"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/provider";

export default function Settings() {
  const { t } = useI18n();
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("language");
    if (saved) {
      setLanguage(saved);
    }
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
    window.location.reload();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{t("settings")}</h1>

      <div className="space-y-6">
        {/* Language Setting */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">{t("language")}</h2>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="en">{t("english")}</option>
            <option value="sv">{t("swedish")}</option>
            <option value="ku">{t("kurdish")}</option>
            <option value="ar">{t("arabic")}</option>
          </select>
        </div>

        {/* Profile Section */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">{t("profile")}</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">{t("name")}</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                placeholder={t("name")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t("email")}</label>
              <input
                type="email"
                className="w-full p-2 border rounded-lg"
                placeholder={t("email")}
              />
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              {t("updateProfile")}
            </button>
          </div>
        </div>

        {/* Password Section */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">{t("changePassword")}</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">{t("currentPassword")}</label>
              <input
                type="password"
                className="w-full p-2 border rounded-lg"
                placeholder={t("currentPassword")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t("newPassword")}</label>
              <input
                type="password"
                className="w-full p-2 border rounded-lg"
                placeholder={t("newPassword")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t("confirmPassword")}</label>
              <input
                type="password"
                className="w-full p-2 border rounded-lg"
                placeholder={t("confirmPassword")}
              />
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              {t("changePassword")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}