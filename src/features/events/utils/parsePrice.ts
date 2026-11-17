const DIACRITICS_REGEX = /[\u0300-\u036f]/g;

export function stripAccents(text: string): string {
  return text.normalize('NFD').replace(DIACRITICS_REGEX, '');
}

export function parsePrice(rawValue: string): number | null {
  const trimmed = rawValue.trim();

  if (trimmed === '') return null;
  if (stripAccents(trimmed.toLowerCase()) === 'gratis') return 0;

  const numeric = Number(trimmed.replace(/[$,\s]/g, ''));

  return Number.isFinite(numeric) ? numeric : null;
}
