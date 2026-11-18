// Shared helpers for the ticket-site import scripts. Kept dependency-free
// (no date-fns/Zod imports) so these scripts stay usable on their own.

const DIACRITICS_REGEX = /[̀-ͯ]/g;

export function stripAccents(text) {
  return text.normalize('NFD').replace(DIACRITICS_REGEX, '');
}

// Mirrors the id format documented in CLAUDE.md for the Sheet's Apps Script:
// slug (max 40 chars, no accents) + "-" + a random 4-char suffix.
export function makeId(name) {
  const slug = stripAccents(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${slug}-${suffix}`;
}

const CATEGORY_KEYWORDS = [
  [
    'musica',
    ['concierto', 'musical', 'música', 'banda', 'dj ', 'sinfónico', 'sinfonico', 'rock', 'pop '],
  ],
  [
    'cultura',
    ['teatro', 'obra de', 'ballet', 'danza', 'exposición', 'exposicion', 'museo', 'arte'],
  ],
  [
    'deportes',
    ['futbol', 'fútbol', 'béisbol', 'beisbol', 'maratón', 'maraton', 'carrera', 'torneo', 'lucha'],
  ],
  ['gastronomia', ['feria', 'gastronóm', 'gastronom', 'cena', 'festival de vino', 'cerveza']],
  ['familiar', ['infantil', 'niños', 'ninos', 'familiar', 'navideñ', 'navidad']],
];

// Best-effort guess from the event name/description — always review this
// column by hand, these sites don't expose a category we can trust directly.
export function guessCategory(text) {
  const normalized = stripAccents(text.toLowerCase());
  for (const [category, keywords] of CATEGORY_KEYWORDS) {
    if (keywords.some((keyword) => normalized.includes(stripAccents(keyword)))) {
      return category;
    }
  }
  return 'otro';
}

export function formatPriceNote(tiers) {
  if (tiers.length <= 1) return '';
  return tiers.map((t) => `${t.nombre} $${t.precio}`).join(', ');
}

export const SHEET_COLUMNS = [
  'id',
  'name',
  'startDate',
  'endDate',
  'venueName',
  'mapsUrl',
  'price',
  'priceNote',
  'description',
  'imageUrl',
  'officialUrl',
  'authorName',
  'authorUrl',
  'category',
  'status',
];
