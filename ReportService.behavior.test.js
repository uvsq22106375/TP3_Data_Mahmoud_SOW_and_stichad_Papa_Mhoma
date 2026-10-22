
import test from 'node:test';
import assert from 'node:assert/strict';
import { ReportService, FreeReportService } from './ReportService.js';

test('Le rapport JSON contient les bons indicateurs', () => {
  const service = new ReportService();
  const result = JSON.parse(service.generate('2026-09', 'json'));

  assert.equal(result.count, 3);
  assert.equal(result.revenueHT, 551);
  assert.equal(result.vat, 110.2);
  assert.equal(result.revenueTTC, 661.2);
  assert.equal(result.average, 183.67);
});

test('Les commandes annulées ne sont pas comptabilisées', () => {
  const service = new ReportService();
  const result = JSON.parse(service.generate('2026-09', 'json'));

  // La commande annulée de 999 € ne doit pas entrer dans le total.
  assert.equal(result.revenueHT, 551);
  assert.equal(result.count, 3);
});

test('Le rapport CSV contient les totaux attendus', () => {
  const service = new ReportService();
  const result = service.generate('2026-09', 'csv');

  assert.match(result, /informatique;416/);
  assert.match(result, /livres;135/);
  assert.match(result, /TOTAL HT;551/);
  assert.match(result, /TOTAL TTC;661\.2/);
});

test('Le rapport HTML affiche le panier moyen', () => {
  const service = new ReportService();
  const result = service.generate('2026-09', 'html');

  assert.match(result, /panier moyen 183\.67 €/);
  assert.match(result, /Total TTC : 661\.2 €/);
});

test('Un format non pris en charge déclenche une erreur', () => {
  const service = new ReportService();

  assert.throws(
    () => service.generate('2026-09', 'pdf'),
    /Format non supporté/
  );
});

test('Le service gratuit refuse le format HTML', () => {
  const service = new FreeReportService();

  assert.throws(
    () => service.generate('2026-09', 'html'),
    /Format réservé aux comptes Pro/
  );
});
