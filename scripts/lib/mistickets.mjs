// MisTickets exposes the public JSON API its own React site calls (no login,
// no API key) — found by reading their webpack bundle. No documented terms
// against this, and robots.txt allows everything.
import { makeId, guessCategory, formatPriceNote } from './shared.mjs';

const API = 'https://v1.mistickets.com.mx/api/v2';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) eventos-cancun-import/1.0';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  const body = await res.json();
  return body.data;
}

function toStartDate(horario) {
  // "2027-02-12 20:00:00" -> "2027-02-12T20:00"
  return horario.replace(' ', 'T').slice(0, 16);
}

export async function fetchMisTicketsEvents() {
  const list = Object.values(await getJson(`${API}/eventos`));
  const rows = [];

  for (const summary of list) {
    const detail = await getJson(`${API}/eventos/${summary.id}`);
    await sleep(200); // be polite, this is someone else's server

    if (!detail.ciudad_estado?.toLowerCase().includes('canc')) continue; // not Cancún

    let tiers = [];
    try {
      tiers = await getJson(`${API}/localidades/${summary.id}`);
      await sleep(200);
    } catch {
      // some events have no public pricing yet — leave price unknown
    }

    const price = tiers.length > 0 ? Math.min(...tiers.map((t) => t.precio)) : null;
    const text = `${summary.nombre} ${summary.descripcion ?? ''}`;

    rows.push({
      id: makeId(summary.nombre),
      name: summary.nombre,
      startDate: toStartDate(summary.horario),
      endDate: '',
      venueName: summary.foro_nombre,
      mapsUrl: '',
      price: price ?? '',
      priceNote: formatPriceNote(tiers),
      description:
        summary.descripcion || '(completa la descripción — MisTickets no la trae en su API)',
      imageUrl: summary.website_imagen
        ? `https://mistickets.com.mx/assets/images_mt/eventos/home/${summary.website_imagen}`
        : '',
      officialUrl: `https://mistickets.com.mx/evento/${summary.id}/`,
      authorName: 'MisTickets',
      authorUrl: 'https://mistickets.com.mx/',
      category: guessCategory(text),
      status: '',
    });
  }

  return rows;
}
