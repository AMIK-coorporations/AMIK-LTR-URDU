import React, { createContext, useState, ReactNode } from "react";
import { en } from "./locales/en";
import { ur } from "./locales/ur";

export type Language = "en" | "ur";

export interface I18nContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const I18nContext = createContext<I18nContextProps | undefined>(undefined);

const locales = { en, ur };

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("ltr-urdu-amik-lang");
    return (saved === "en" || saved === "ur" ? saved : "ur") as Language;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("ltr-urdu-amik-lang", lang);
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = locales[language];
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    return typeof value === "string" ? value : key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};
