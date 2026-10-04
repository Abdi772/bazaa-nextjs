 'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type BazaaLanguage =
  | 'English'
  | 'Amharic'
  | 'Oromo';

type TranslationMap = Record<string, string>;

type LanguageContextType = {
  language: BazaaLanguage;
  t: (key: string) => string;
};

const translations: Record<
  BazaaLanguage,
  TranslationMap
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
   admin: 'Admin',
    loading: 'Loading...',
    yourProfile: 'Your profile',
    profileLoginHint:
      'Use the Log in / Sign up button at the top of the page to see your profile.',
back: 'Back',
    seller: 'Seller',
    sellingSince: 'selling since',
    noListings: 'No listings',
    sellerNoListings:
      'This seller has no active listings right now.',
   
    /* Actual category names */
    electronicsCategory: 'Electronics',
    vehiclesCategory: 'Vehicles',
    furnitureCategory: 'Furniture',
    fashionCategory: 'Fashion',
    propertyCategory: 'Property',
    otherCategory: 'Other',

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
   admin: 'አስተዳዳሪ',
    loading: 'በመጫን ላይ...',
    yourProfile: 'የእርስዎ መገለጫ',
    profileLoginHint:
      'መገለጫዎን ለማየት በገጹ ላይኛው ክፍል ያለውን “ግባ / ተመዝገብ” ቁልፍ ይጠቀሙ።',
back: 'ተመለስ',
    seller: 'ሻጭ',
    sellingSince: 'መሸጥ የጀመረው',
    noListings: 'ማስታወቂያ የለም',
    sellerNoListings:
      'ይህ ሻጭ አሁን ምንም ንቁ ማስታወቂያ የለውም።',
   
    /* Actual category names */
    electronicsCategory: 'ኤሌክትሮኒክስ',
    vehiclesCategory: 'ተሽከርካሪዎች',
    furnitureCategory: 'የቤት ዕቃዎች',
    fashionCategory: 'ፋሽን',
    propertyCategory: 'ንብረት',
    otherCategory: 'ሌሎች',

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
   admin: 'Bulchaa',
    loading: 'Fe’aa jira...',
    yourProfile: 'Piroofaayilii kee',
    profileLoginHint:
      'Piroofaayilii kee ilaaluuf button “Seeni / Galmaa’i” gubbaa fuula kanaa jiru fayyadami.',
back: 'Duubatti',
    seller: 'Gurgurtaa',
    sellingSince: 'Gurguruu kan jalqabe',
    noListings: 'Beeksisni hin jiru',
    sellerNoListings:
      'Gurgurtichi kun yeroo ammaa beeksisa hojii irra jiru hin qabu.',
   
    /* Actual category names */
    electronicsCategory: 'Elektirooniksii',
    vehiclesCategory: 'Konkolaattota',
    furnitureCategory: 'Meeshaalee Manaa',
    fashionCategory: 'Faashinii',
    propertyCategory: 'Qabeenya',
    otherCategory: 'Kan biraa',

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

    backTo:
      'Gara duubaatti deebi’i',

    ad: 'beeksisa',
    ads: 'beeksisawwan',

    seeAllIn:
      'Hunda keessatti ilaali',

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

function isValidLanguage(
  value: string | null,
): value is BazaaLanguage {
  return (
    value === 'English' ||
    value === 'Amharic' ||
    value === 'Oromo'
  );
}

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] =
    useState<BazaaLanguage>('English');

  useEffect(() => {
    function loadLanguage() {
      const saved =
        localStorage.getItem('bazaa-language');

      if (isValidLanguage(saved)) {
        setLanguage(saved);
      } else {
        setLanguage('English');
      }
    }

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

  const t = useMemo(() => {
    return (key: string): string => {
      return (
        translations[language][key] ??
        translations.English[key] ??
        key
      );
    };
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      t,
    }),
    [language, t],
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
