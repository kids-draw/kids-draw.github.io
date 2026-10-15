import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, type SupportedLanguageCode } from './languages';
import en from './locales/en.json';
import es from './locales/es.json';
import pt from './locales/pt.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import ja from './locales/ja.json';
import zh from './locales/zh.json';

const translations: Record<SupportedLanguageCode, typeof en> = {
  en,
  es,
  pt,
  de,
  fr,
  ja,
  zh,
};

export function getTranslations(locale?: string): typeof en {
  if (locale && locale in translations) {
    return translations[locale as SupportedLanguageCode];
  }
  return translations[DEFAULT_LANGUAGE as SupportedLanguageCode];
}

export function isValidLocale(locale: string): locale is SupportedLanguageCode {
  return SUPPORTED_LANGUAGES.some((lang) => lang.code === locale);
}

export function getLocalizedPath(pathname: string, targetLocale: string): string {
  // Strip leading slash and current locale prefix if any
  let cleanPath = pathname.replace(/^\/+/, '');
  
  // Check if first segment is a supported locale
  const segments = cleanPath.split('/');
  if (segments.length > 0 && isValidLocale(segments[0])) {
    segments.shift();
    cleanPath = segments.join('/');
  }

  if (targetLocale === DEFAULT_LANGUAGE) {
    return cleanPath ? `/${cleanPath}` : '/';
  }

  return cleanPath ? `/${targetLocale}/${cleanPath}` : `/${targetLocale}/`;
}

export function getHreflangLinks(currentPath: string, siteUrl: string = 'https://kids-draw.github.io') {
  return SUPPORTED_LANGUAGES.map((lang) => {
    const locPath = getLocalizedPath(currentPath, lang.code);
    return {
      lang: lang.code,
      href: `${siteUrl}${locPath}`,
    };
  });
}
