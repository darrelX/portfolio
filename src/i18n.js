// Minimal i18n helper loading JSON files
import frCommon from './i18n/fr/common.json';
import enCommon from './i18n/en/common.json';

const translations = {
  fr: frCommon,
  en: enCommon,
};

export function t(lang, path) {
  const parts = path.split('.');
  let node = (translations[lang] || translations.fr);
  for (const p of parts) {
    node = node?.[p];
    if (node == null) break;
  }
  return node ?? path;
}


