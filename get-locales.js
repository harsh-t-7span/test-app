const locales = {
  en: () => import('./src/locales/en.json').then(r => r.default),
  ar: () => import('./src/locales/ar.json').then(r => r.default),
};

export const getLocales = lang => {
  return locales[lang]();
};
