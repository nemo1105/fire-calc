import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { type Lang, detectLanguage } from "../lib/i18n";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    // 尝试从 localStorage 读取用户偏好
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lang");
      if (saved === "zh" || saved === "en") return saved;
    }
    return detectLanguage();
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = () => setLang(lang === "zh" ? "en" : "zh");

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
