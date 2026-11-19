#!/usr/bin/env node
// Pulls candidate events from MisTickets and TusBoletos (Cancún only) and
// writes a draft CSV with the Sheet's exact columns. Review every row before
// pasting it into the real Google Sheet — category is a best-effort guess,
// descriptions and venue names may need manual cleanup, and this does not
// check for events you already added.
import { writeFileSync } from 'node:fs';
import Papa from 'papaparse';
import { fetchMisTicketsEvents } from './lib/mistickets.mjs';
import { fetchTusBoletosEvents } from './lib/tusboletos.mjs';
import { SHEET_COLUMNS } from './lib/shared.mjs';

const OUTPUT_FILE = 'borrador-eventos.csv';

async function run() {
  const rows = [];

  console.log('Consultando MisTickets...');
  try {
    const misticketsRows = await fetchMisTicketsEvents();
    console.log(`  ${misticketsRows.length} eventos en Cancún.`);
    rows.push(...misticketsRows);
  } catch (error) {
    console.error('  Falló MisTickets:', error.message);
  }

  console.log('Consultando TusBoletos...');
  try {
    const tusboletosRows = await fetchTusBoletosEvents();
    console.log(`  ${tusboletosRows.length} eventos en Cancún.`);
    rows.push(...tusboletosRows);
  } catch (error) {
    console.error('  Falló TusBoletos:', error.message);
  }

  if (rows.length === 0) {
    console.log('No se obtuvo ningún evento. No se escribió ningún archivo.');
    return;
  }

  const csv = Papa.unparse(rows, { columns: SHEET_COLUMNS });
  // BOM so Excel/Sheets detect UTF-8 instead of guessing Windows-1252 and
  // mangling accents/em dashes on open.
  writeFileSync(OUTPUT_FILE, `﻿${csv}`, 'utf8');
  console.log(
    `\n${rows.length} eventos escritos en ${OUTPUT_FILE}. Revísalos antes de pegarlos al Sheet.`,
  );
}

run();
