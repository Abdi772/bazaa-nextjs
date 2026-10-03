'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type BazaaLanguage = 'English' | 'Amharic' | 'Oromo';

type LanguageContextType = {
  language: BazaaLanguage;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'English',
});

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<BazaaLanguage>('English');

  useEffect(() => {
    function loadLanguage() {
      const saved = localStorage.getItem('bazaa-language');

      if (
        saved === 'English' ||
        saved === 'Amharic' ||
        saved === 'Oromo'
      ) {
        setLanguage(saved);
      } else {
        setLanguage('English');
      }
    }

    loadLanguage();

    window.addEventListener('bazaa-language-change', loadLanguage);

    return () => {
      window.removeEventListener(
        'bazaa-language-change',
        loadLanguage
      );
    };
  }, []);

  const value = useMemo(
    () => ({
      language,
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
