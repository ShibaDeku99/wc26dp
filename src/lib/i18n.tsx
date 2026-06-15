'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'vi';

export const translations = {
  en: { nav: { dashboard: 'Dashboard', fixtures: 'Fixtures', results: 'Results', groups: 'Groups', standings: 'Standings', stats: 'Statistics', bracket: 'Bracket' } },
  vi: { nav: { dashboard: 'Trang chủ', fixtures: 'Lịch thi đấu', results: 'Kết quả', groups: 'Vòng bảng', standings: 'Bảng xếp hạng', stats: 'Thống kê', bracket: 'Sơ đồ đấu' } },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('vi');

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language | null;
    if (saved === 'en' || saved === 'vi') setLanguageState(saved);
  }, []);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    localStorage.setItem('language', nextLanguage);
  };

  const t = (path: string) => {
    const keys = path.split('.');
    let current: unknown = translations[language];
    for (const key of keys) {
      if (!current || typeof current !== 'object' || !(key in current)) return path;
      current = (current as Record<string, unknown>)[key];
    }
    return typeof current === 'string' ? current : path;
  };

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext) ?? {
    language: 'vi' as Language,
    setLanguage: () => undefined,
    t: (path: string) => path,
  };
}
