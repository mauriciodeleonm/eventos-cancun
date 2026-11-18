// TusBoletos has no public API, but its pages are server-rendered with real
// text content (no login needed). robots.txt only disallows /Error.php, and
// nothing in /terminos-de-uso mentions scraping. It's a multi-city site —
// Cancún events are identified by their URL slug ending in "-cancun".
import * as cheerio from 'cheerio';
import { makeId, guessCategory, formatPriceNote } from './shared.mjs';

const BASE = 'https://www.tusboletos.mx';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) eventos-cancun-import/1.0';

const MONTHS = {
  enero: '01',
  febrero: '02',
  marzo: '03',
  abril: '04',
  mayo: '05',
  junio: '06',
  julio: '07',
  agosto: '08',
  septiembre: '09',
  octubre: '10',
  noviembre: '11',
  diciembre: '12',
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanText(text) {
  return text.replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
}

async function getHtml(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.text();
}

function parseFecha(text) {
  // "Viernes 18 de Diciembre del 2026" -> { day: "18", month: "12", year: "2026" }
  const match = cleanText(text).match(/(\d{1,2})\s+de\s+([a-záéíóúñ]+)\s+del?\s+(\d{4})/i);
  if (!match) return null;
  const month = MONTHS[match[2].toLowerCase()];
  if (!month) return null;
  return { day: match[1].padStart(2, '0'), month, year: match[3] };
}

function parseHora(text) {
  // "9:00 P.M." -> "21:00"; "11:00 A.M." -> "11:00"
  const match = cleanText(text).match(/(\d{1,2}):(\d{2})\s*([ap])\.?\s*m\.?/i);
  if (!match) return '00:00';
  let hours = Number(match[1]) % 12;
  if (match[3].toLowerCase() === 'p') hours += 12;
  return `${String(hours).padStart(2, '0')}:${match[2]}`;
}

async function fetchEventLinks() {
  const html = await getHtml(`${BASE}/eventos`);
  const $ = cheerio.load(html);
  const links = new Set();

  $('a[href^="/evento/"]').each((_, el) => {
    const href = $(el).attr('href');
    if (/-cancun(-|$)/i.test(href)) links.add(`${BASE}${href}`);
  });

  return [...links];
}

async function fetchEventDetail(url) {
  const html = await getHtml(url);
  const $ = cheerio.load(html);

  // The h1 is "<name> - Cancún[ - <date>]" — drop just the "Cancún" segment,
  // keep any trailing date segment (several showtimes share the same name).
  const name = cleanText($('h1').first().text())
    .split(' - ')
    .filter((part) => !/^canc[uú]n$/i.test(part.trim()))
    .join(' - ');

  const tiers = [];
  $('.price table tbody tr').each((_, row) => {
    const tds = $(row).find('td');
    const nombre = cleanText($(tds[0]).text());
    const precio = Number(cleanText($(tds[1]).text()).replace(/[^0-9.]/g, ''));
    if (nombre && Number.isFinite(precio)) tiers.push({ nombre, precio });
  });
  const price = tiers.length > 0 ? Math.min(...tiers.map((t) => t.precio)) : '';

  const infoParagraphs = $('.info-event p');
  const fechaText = cleanText($(infoParagraphs[0]).text());
  const horaText = cleanText($(infoParagraphs[1]).text());
  const venueName = cleanText($('.info-event p.description.textpad').first().text());

  const fecha = parseFecha(fechaText);
  const startDate = fecha ? `${fecha.year}-${fecha.month}-${fecha.day}T${parseHora(horaText)}` : '';

  const aboutHeading = $('h3')
    .filter((_, el) => $(el).text().includes('Sobre el evento'))
    .first();
  const description =
    aboutHeading
      .nextAll('p')
      .map((_, p) => cleanText($(p).text()))
      .get()
      .filter(Boolean)
      .join('\n\n') || cleanText($('meta[property="og:description"]').attr('content') ?? '');

  const text = `${name} ${description}`;

  return {
    id: makeId(name),
    name,
    startDate,
    endDate: '',
    // Raw text includes the city/state ("... Cancún, Quintana Roo.") — worth
    // trimming by hand when you paste this into the Sheet.
    venueName,
    mapsUrl: '',
    price,
    priceNote: formatPriceNote(tiers),
    description: description || '(completa la descripción)',
    imageUrl: $('meta[property="og:image"]').attr('content') ?? '',
    officialUrl: $('meta[property="og:url"]').attr('content') ?? url,
    authorName: 'TusBoletos',
    authorUrl: 'https://www.tusboletos.mx/',
    category: guessCategory(text),
    status: '',
  };
}

export async function fetchTusBoletosEvents() {
  const links = await fetchEventLinks();
  const rows = [];

  for (const url of links) {
    rows.push(await fetchEventDetail(url));
    await sleep(250); // be polite, this is someone else's server
  }

  return rows;
}
