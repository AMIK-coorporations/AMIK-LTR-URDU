import { useContext } from "react";
import { I18nContext, I18nContextProps } from "./I18nContext";

export const useTranslation = (): I18nContextProps => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
};
