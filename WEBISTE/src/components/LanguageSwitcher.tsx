import React from "react";
import { useTranslation } from "../i18n/useTranslation";

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ur" : "en");
  };

  return (
    <button onClick={toggleLanguage} className="btn-lang-switcher">
      {language === "en" ? "اردو" : "English"}
    </button>
  );
};
