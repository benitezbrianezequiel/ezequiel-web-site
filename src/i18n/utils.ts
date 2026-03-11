import type { Lang } from './translations';
import { translations } from './translations';

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en') return 'en';
  return 'es';
}

export function useTranslations(lang: Lang) {
  return function t(key: string): string {
    return translations[lang][key] ?? translations['es'][key] ?? key;
  };
}

export function getLocalizedPath(path: string, lang: Lang): string {
  // path should start with / and NOT include lang prefix
  return `/${lang}${path}`;
}

export function getAlternateLang(lang: Lang): Lang {
  return lang === 'es' ? 'en' : 'es';
}

export function getAlternatePath(pathname: string, currentLang: Lang): string {
  const alternateLang = getAlternateLang(currentLang);
  return pathname.replace(`/${currentLang}`, `/${alternateLang}`);
}
