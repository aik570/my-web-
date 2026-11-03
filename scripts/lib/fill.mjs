// Placeholders in owner-editable texts, resolved at build time from src/_data/site.json (CMS).
import fs from 'node:fs';

export function fillValues() {
  const site = JSON.parse(fs.readFileSync(new URL('../../src/_data/site.json', import.meta.url), 'utf8'));
  const fee = Number(site.diagnosisFee?.amount);
  const w = site.warranty || {};
  return {
    befund: `${fee.toLocaleString('de-DE', { minimumFractionDigits: Number.isInteger(fee) ? 0 : 2, maximumFractionDigits: 2 })} €`,
    garantie: w.standard || '',
    garantieWasser: w.waterDamage || '',
    gewaehrleistung: w.legalNote || '',
  };
}

export function fillText(s = '', values = fillValues()) {
  return String(s ?? '').replace(/\{(befund|garantie|garantieWasser|gewaehrleistung)\}/g, (_, k) => values[k]);
}
