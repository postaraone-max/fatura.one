export type Lang = "sv" | "en";

export const DICT = {
  // Common
  back: { sv: "Tillbaka", en: "Back" },
  content: { sv: "Innehåll", en: "Content" },
  status: { sv: "Status:", en: "Status:" },
  created: { sv: "Skapad:", en: "Created:" },

  // Decisions (actions)
  submitForApproval: { sv: "Skicka för godkännande", en: "Submit for approval" },
  approve: { sv: "Godkänn", en: "Approve" },
  lockDecision: { sv: "Lås beslut", en: "Lock decision" },
  working: { sv: "Arbetar...", en: "Working..." },
  somethingWentWrong: { sv: "Något gick fel.", en: "Something went wrong." },

  // Generic errors
  notFound: { sv: "Hittades inte.", en: "Not found." },
} as const;

export type I18nKey = keyof typeof DICT;

export function t(lang: Lang, key: I18nKey): string {
  return DICT[key][lang];
}

export function normalizeLang(input: unknown): Lang {
  return input === "sv" ? "sv" : "en";
}
