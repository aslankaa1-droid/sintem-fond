const NBSP = ' ';

export type LocalizedString = string | { ru: string; en?: string; fr?: string; ar?: string };

export const localize = (value: LocalizedString | undefined, lang: string): string => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  const k = (lang || 'ru').slice(0, 2);
  if (k === 'en' && value.en) return value.en;
  if (k === 'fr' && value.fr) return value.fr;
  if (k === 'ar' && value.ar) return value.ar;
  return value.ru;
};

export interface NamedPatient {
  patientName: string;
  patientNameByLang?: { en?: string; fr?: string; ar?: string };
  patientNameDative?: string;
  patientNameGenitive?: string;
}

export const patientNameFor = (p: NamedPatient, lang: string, form: 'nom' | 'dat' | 'gen' = 'nom'): string => {
  const k = (lang || 'ru').slice(0, 2);
  if (k === 'ru') {
    if (form === 'dat' && p.patientNameDative) return p.patientNameDative;
    if (form === 'gen' && p.patientNameGenitive) return p.patientNameGenitive;
    return p.patientName;
  }
  const tr = p.patientNameByLang;
  if (k === 'en' && tr?.en) return tr.en;
  if (k === 'fr' && tr?.fr) return tr.fr;
  if (k === 'ar' && tr?.ar) return tr.ar;
  return p.patientName;
};

const millionAbbr: Record<string, string> = {
  'ru-RU': 'млн',
  'en-US': 'M',
  'fr-FR': 'M',
  'ar-EG': 'م',
};

export const formatRub = (value: number, locale = 'ru-RU'): string => {
  if (value >= 1_000_000) {
    const fraction = (value / 1_000_000).toFixed(1);
    const m = locale === 'ru-RU' || locale === 'fr-FR' ? fraction.replace('.', ',') : fraction;
    const abbr = millionAbbr[locale] || 'M';
    return `${m}${NBSP}${abbr}${NBSP}₽`;
  }
  return `${value.toLocaleString(locale).replace(/\s/g, NBSP)}${NBSP}₽`;
};

export const formatNumber = (value: number, locale = 'ru-RU'): string =>
  value.toLocaleString(locale).replace(/\s/g, NBSP);

export const percent = (collected: number, target: number): number => {
  if (target <= 0) return 0;
  return Math.min(100, (collected / target) * 100);
};

export const declension = (
  n: number,
  forms: [string, string, string],
): string => {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return forms[0];
  if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return forms[1];
  return forms[2];
};

export type PluralForm = 'one' | 'few' | 'many';

const ruPluralForm = (n: number): PluralForm => {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return 'one';
  if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return 'few';
  return 'many';
};

const enPluralForm = (n: number): PluralForm => (n === 1 ? 'one' : 'many');
const frPluralForm = (n: number): PluralForm => (n <= 1 ? 'one' : 'many');

const arPluralForm = (n: number): PluralForm => {
  const n100 = n % 100;
  if (n === 0 || n === 1) return 'one';
  if (n >= 3 && n <= 10) return 'few';
  if (n100 >= 11 && n100 <= 99) return 'many';
  return 'many';
};

export const pluralForm = (lang: string, n: number): PluralForm => {
  switch (lang.slice(0, 2)) {
    case 'ru':
      return ruPluralForm(n);
    case 'fr':
      return frPluralForm(n);
    case 'ar':
      return arPluralForm(n);
    default:
      return enPluralForm(n);
  }
};
