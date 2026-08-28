import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

export type Locale = 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'kn' | 'ml' | 'mr' | 'gu' | 'pa' | 'or' | 'as' | 'ur' | 'ne' | 'kok' | 'ks' | 'sd' | 'sa' | 'sat' | 'mni' | 'brx' | 'mai' | 'doi';
const locales = new Set<Locale>(['en', 'hi', 'bn', 'ta', 'te', 'kn', 'ml', 'mr', 'gu', 'pa', 'or', 'as', 'ur', 'ne', 'kok', 'ks', 'sd', 'sa', 'sat', 'mni', 'brx', 'mai', 'doi']);

const fallback: Record<string, Record<string, string>> = {
  en: {
    'nav.report': 'Report', 'nav.detect': 'Detect', 'nav.track': 'Track', 'nav.awareness': 'Awareness', 'nav.contact': 'Contact', 'nav.call': 'Call 1930',
    'brand.name': 'Cyber Crime India', 'brand.tagline': 'Report · Detect · Track',
    'home.hero.title': 'Report. Detect. Stay safe.', 'home.hero.description': 'One citizen-first portal to report cyber crimes, check suspicious links, track your complaint and learn to stay protected. Your safety. Our priority.', 'home.hero.report': 'Report a cyber crime', 'home.hero.detect': 'Detect cyber crime', 'home.helpline': '24×7 helpline', 'home.official': 'Official citizen portal',
  },
  hi: {
    'nav.report': 'शिकायत दर्ज करें', 'nav.detect': 'जाँच करें', 'nav.track': 'स्थिति देखें', 'nav.awareness': 'जागरूकता', 'nav.contact': 'संपर्क करें', 'nav.call': '1930 पर कॉल करें',
    'brand.name': 'साइबर अपराध भारत', 'brand.tagline': 'शिकायत · जाँच · स्थिति',
    'home.hero.title': 'शिकायत करें। जाँचें। सुरक्षित रहें।', 'home.hero.description': 'साइबर अपराध की शिकायत दर्ज करने, संदिग्ध लिंक जाँचने, शिकायत की स्थिति देखने और सुरक्षित रहने के लिए नागरिकों का एक पोर्टल। आपकी सुरक्षा हमारी प्राथमिकता है।', 'home.hero.report': 'साइबर अपराध की शिकायत करें', 'home.hero.detect': 'साइबर अपराध जाँचें', 'home.helpline': '24×7 हेल्पलाइन', 'home.official': 'आधिकारिक नागरिक पोर्टल',
  },
};

type I18nValue = { locale: Locale; setLocale: (locale: Locale) => void; t: (key: string) => string };
const I18nContext = createContext<I18nValue>({ locale: 'en', setLocale: () => {}, t: (key) => fallback.en[key] ?? key });

function applyGoogleLocale(locale: Locale) {
  const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
  if (!select) return false;
  // Google uses `or` for Odia, while the voice API uses `od-IN`.
  const googleLocale = locale === 'or' ? 'or' : locale;
  select.value = googleLocale;
  select.dispatchEvent(new Event('change'));
  return true;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => { const saved = localStorage.getItem('preferred-locale') as Locale | null; return saved && locales.has(saved) ? saved : 'en'; });
  const rows = useQuery(api.translations.list, { locale });
  const setLocale = (next: Locale) => {
    setLocaleState(next);
    localStorage.setItem('preferred-locale', next);
    if (!applyGoogleLocale(next)) {
      window.setTimeout(() => applyGoogleLocale(next), 500);
    }
  };
  const translations = useMemo(() => ({ ...fallback[locale], ...(rows ?? []).reduce<Record<string, string>>((all, row) => { all[row.key] = row.value; return all; }, {}) }), [locale, rows]);
  useEffect(() => {
    document.documentElement.lang = locale;
    if (locale !== 'en') window.setTimeout(() => applyGoogleLocale(locale), 250);
  }, [locale]);
  return <I18nContext.Provider value={{ locale, setLocale, t: (key) => translations[key] ?? fallback.en[key] ?? key }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
