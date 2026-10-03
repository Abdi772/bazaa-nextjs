 'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

export type BazaaLanguage = 'English' | 'Amharic' | 'Oromo';

type LanguageContextType = {
  language: BazaaLanguage;
  t: (key: string) => string;
};

const translations: Record<BazaaLanguage, Record<string, string>> = {
  English: {
    home: 'Home',
    browse: 'Browse',
    sell: 'Sell',
    profile: 'Profile',
    settings: 'Settings',
    search: 'Search',
    categories: 'Categories',
    electronics: 'Electronics',
    phones: 'Phones',
    messages: 'Messages',
    saved: 'Saved',
    myAdverts: 'My adverts',
    postListing: 'Post a listing',
    logout: 'Log out',
    language: 'Language',
    changeLanguage: 'Change language',
    changeEmail: 'Change email',
    phoneNumber: 'Phone number',
    appearance: 'Appearance',
    notifications: 'Notifications',
    feedback: 'Feedback',
    password: 'Password',
    deleteAccount: 'Delete account',
    buyAndSell: 'Buy and sell anything, right in your area.',
  },

  Amharic: {
    home: 'መነሻ',
    browse: 'ይፈልጉ',
    sell: 'ይሽጡ',
    profile: 'መገለጫ',
    settings: 'ቅንብሮች',
    search: 'ፈልግ',
    categories: 'ምድቦች',
    electronics: 'ኤሌክትሮኒክስ',
    phones: 'ስልኮች',
    messages: 'መልዕክቶች',
    saved: 'የተቀመጡ',
    myAdverts: 'የእኔ ማስታወቂያዎች',
    postListing: 'ማስታወቂያ ይለጥፉ',
    logout: 'ውጣ',
    language: 'ቋንቋ',
    changeLanguage: 'ቋንቋ ቀይር',
    changeEmail: 'ኢሜይል ቀይር',
    phoneNumber: 'ስልክ ቁጥር',
    appearance: 'ገጽታ',
    notifications: 'ማሳወቂያዎች',
    feedback: 'አስተያየት',
    password: 'የይለፍ ቃል',
    deleteAccount: 'መለያ ሰርዝ',
    buyAndSell: 'በአካባቢዎ ማንኛውንም ነገር ይግዙ እና ይሽጡ።',
  },

  Oromo: {
    home: 'Mana',
    browse: 'Barbaadi',
    sell: 'Gurguri',
    profile: 'Profaayilii',
    settings: 'Qindaa’ina',
    search: 'Barbaadi',
    categories: 'Ramaddii',
    electronics: 'Elektirooniksii',
    phones: 'Bilbila',
    messages: 'Ergaawwan',
    saved: 'Kan olkaa’ame',
    myAdverts: 'Beeksisa koo',
    postListing: 'Beeksisa maxxansi',
    logout: 'Ba’i',
    language: 'Afaan',
    changeLanguage: 'Afaan jijjiiri',
    changeEmail: 'Imeelii jijjiiri',
    phoneNumber: 'Lakkoofsa bilbilaa',
    appearance: 'Mul’ata',
    notifications: 'Beeksisawwan',
    feedback: 'Yaada',
    password: 'Jecha iccitii',
    deleteAccount: 'Herrega haqii',
    buyAndSell: 'Naannoo kee keessatti waan kamiyyuu bitaa fi gurguri.',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'English',
  t: (key) => translations.English[key] || key,
});

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] =
    useState<BazaaLanguage>('English');

  useEffect(() => {
    const loadLanguage = () => {
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
    };

    loadLanguage();

    window.addEventListener(
      'bazaa-language-change',
      loadLanguage
    );

    return () => {
      window.removeEventListener(
        'bazaa-language-change',
        loadLanguage
      );
    };
  }, []);

  function t(key: string) {
    return translations[language][key] || translations.English[key] || key;
  }

  return (
    <LanguageContext.Provider value={{ language, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
