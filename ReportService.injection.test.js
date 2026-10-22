
import test from 'node:test';
import assert from 'node:assert/strict';
import { ReportService } from './ReportService.js';

test('ReportService utilise le formateur CSV injecté', () => {
  const fauxFormateur = {
    format(stats) {
      return `HT=${stats.revenueHT}`;
    }
  };

  const service = new ReportService({
    csvFormatter: fauxFormateur
  });

  const resultat = service.generate('2026-09', 'csv');

  assert.equal(resultat, 'HT=551');
});
