
export class CsvFormatter {
  format(stats) {
    let output = 'categorie;montant_ht\n';

    for (const category of Object.keys(stats.byCategory).sort()) {
      output += `${category};${stats.byCategory[category]}\n`;
    }

    output += `TOTAL HT;${stats.revenueHT}\n`;
    output += `TVA;${stats.vat}\n`;
    output += `TOTAL TTC;${stats.revenueTTC}\n`;

    return output;
  }
}
