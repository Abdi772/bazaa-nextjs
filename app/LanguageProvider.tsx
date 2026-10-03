 'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

export type BazaaLanguage =
  | 'English'
  | 'Amharic'
  | 'Oromo';

type LanguageContextType = {
  language: BazaaLanguage;
  t: (key: string) => string;
};

const translations: Record<
  BazaaLanguage,
  Record<string, string>
> = {
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

    /* Category names */
    electronicsCategory: 'Electronics',
    vehiclesCategory: 'Vehicles',
    fashionCategory: 'Fashion',
    homeCategory: 'Home & Garden',
    jobsCategory: 'Jobs',
    servicesCategory: 'Services',

    buyAndSell:
      'Buy and sell anything, right in your area.',

    findWhatYouNeed:
      'Find what you need nearby, or list something in minutes.',

    searchPlaceholder:
      'What are you looking for?',

    popularCategories:
      'Popular categories',

    browseBy:
      'Browse by what you’re looking for',

    listings: 'listings',
    listing: 'listing',

    resultsFor: 'Results for',
    allListings: 'All listings',
    found: 'found',

    backToAllCategories:
      'Back to all categories',

    backTo: 'Back to',

    ad: 'ad',
    ads: 'ads',

    seeAllIn: 'See all in',

    noListingsMatch:
      'No listings match',

    tryDifferent:
      'Try a different search or category.',

    language: 'Language',
    changeLanguage: 'Change language',
    changeEmail: 'Change email',
    phoneNumber: 'Phone number',
    appearance: 'Appearance',
    notifications: 'Notifications',
    feedback: 'Feedback',
    password: 'Password',
    deleteAccount: 'Delete account',
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

    /* Category names */
    electronicsCategory: 'ኤሌክትሮኒክስ',
    vehiclesCategory: 'ተሽከርካሪዎች',
    fashionCategory: 'ፋሽን',
    homeCategory: 'ቤት እና የአትክልት እቃዎች',
    jobsCategory: 'ስራዎች',
    servicesCategory: 'አገልግሎቶች',

    buyAndSell:
      'በአካባቢዎ ማንኛውንም ነገር ይግዙ እና ይሽጡ።',

    findWhatYouNeed:
      'የሚፈልጉትን በአቅራቢያዎ ያግኙ፣ ወይም ማስታወቂያ በደቂቃዎች ውስጥ ይለጥፉ።',

    searchPlaceholder:
      'ምን እየፈለጉ ነው?',

    popularCategories:
      'ታዋቂ ምድቦች',

    browseBy:
      'የሚፈልጉትን ይምረጡ',

    listings: 'ማስታወቂያዎች',
    listing: 'ማስታወቂያ',

    resultsFor: 'የፍለጋ ውጤቶች',
    allListings: 'ሁሉም ማስታወቂያዎች',
    found: 'ተገኝተዋል',

    backToAllCategories:
      'ወደ ሁሉም ምድቦች ተመለስ',

    backTo: 'ወደ ኋላ ተመለስ',

    ad: 'ማስታወቂያ',
    ads: 'ማስታወቂያዎች',

    seeAllIn:
      'ሁሉንም በዚህ ውስጥ ይመልከቱ',

    noListingsMatch:
      'ምንም ተመሳሳይ ማስታወቂያ አልተገኘም',

    tryDifferent:
      'የተለየ ፍለጋ ወይም ምድብ ይሞክሩ።',

    language: 'ቋንቋ',
    changeLanguage: 'ቋንቋ ቀይር',
    changeEmail: 'ኢሜይል ቀይር',
    phoneNumber: 'ስልክ ቁጥር',
    appearance: 'ገጽታ',
    notifications: 'ማሳወቂያዎች',
    feedback: 'አስተያየት',
    password: 'የይለፍ ቃል',
    deleteAccount: 'መለያ ሰርዝ',
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

    /* Category names */
    electronicsCategory: 'Elektirooniksii',
    vehiclesCategory: 'Konkolaattota',
    fashionCategory: 'Faashinii',
    homeCategory: 'Mana fi Qonna',
    jobsCategory: 'Hojiiwwan',
    servicesCategory: 'Tajaajiloota',

    buyAndSell:
      'Naannoo kee keessatti waan kamiyyuu bitaa fi gurguri.',

    findWhatYouNeed:
      'Waan barbaaddu naannoo kee irraa argadhu, yookaan daqiiqaa muraasa keessatti beeksisa maxxansi.',

    searchPlaceholder:
      'Maal barbaadaa jirta?',

    popularCategories:
      'Ramaddiiwwan beekamoo',

    browseBy:
      'Waan barbaadduun barbaadi',

    listings: 'beeksisawwan',
    listing: 'beeksisa',

    resultsFor: 'Bu’aa barbaacha',
    allListings: 'Beeksisawwan hunda',
    found: 'argaman',

    backToAllCategories:
      'Gara ramaddiiwwan hundaatti deebi’i',

    backTo: 'Gara duubaatti deebi’i',

    ad: 'beeksisa',
    ads: 'beeksisawwan',

    seeAllIn: 'Hunda keessatti ilaali',

    noListingsMatch:
      'Beeksisni walsimu hin jiru',

    tryDifferent:
      'Barbaacha ykn ramaddii biraa yaali.',

    language: 'Afaan',
    changeLanguage: 'Afaan jijjiiri',
    changeEmail: 'Imeelii jijjiiri',
    phoneNumber: 'Lakkoofsa bilbilaa',
    appearance: 'Mul’ata',
    notifications: 'Beeksisawwan',
    feedback: 'Yaada',
    password: 'Jecha iccitii',
    deleteAccount: 'Herrega haqii',
  },
};

const LanguageContext =
  createContext<LanguageContextType>({
    language: 'English',
    t: (key) =>
      translations.English[key] || key,
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
      const saved =
        localStorage.getItem('bazaa-language');

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
      loadLanguage,
    );

    return () => {
      window.removeEventListener(
        'bazaa-language-change',
        loadLanguage,
      );
    };
  }, []);

  function t(key: string) {
    return (
      translations[language][key] ||
      translations.English[key] ||
      key
    );
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
     }
