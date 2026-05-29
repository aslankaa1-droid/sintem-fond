const NBSP = ' ';

export const formatRub = (value: number): string => {
  if (value >= 1_000_000) {
    const m = (value / 1_000_000).toFixed(1).replace('.', ',');
    return `${m}${NBSP}млн${NBSP}₽`;
  }
  return `${value.toLocaleString('ru-RU').replace(/\s/g, NBSP)}${NBSP}₽`;
};

export const formatNumber = (value: number): string =>
  value.toLocaleString('ru-RU').replace(/\s/g, NBSP);

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
