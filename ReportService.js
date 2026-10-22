
import fs from 'node:fs';
import { CsvFormatter } from './CsvFormatter.js';

export class ReportService {
  constructor({ csvFormatter = new CsvFormatter() } = {}) {
    this.csvFormatter = csvFormatter;
    this.dbFile = new URL('./orders.json', import.meta.url);
    this.smtp = {
      host: 'smtp.shoplite.fr',
      port: 587,
      user: 'reports',
      password: 'Sh0pL1te!',
    };
    this.outbox = [];
    this.history = [];
  }

  loadOrders() {
    const raw = fs.readFileSync(this.dbFile, 'utf8');
    return JSON.parse(raw);
  }

  generate(month, format, recipient) {
    const orders = this.loadOrders().filter(o => o.date.startsWith(month));

    let revenueHT = 0;
    let count = 0;
    const byCategory = {};

    for (const o of orders) {
      if (o.status === 'CANCELLED') continue;

      count++;

      for (const l of o.lines) {
        const amount = l.qty * l.unitPrice;
        revenueHT += amount;
        byCategory[l.category] = (byCategory[l.category] || 0) + amount;
      }
    }

    const vat = Math.round(revenueHT * 0.2 * 100) / 100;
    const revenueTTC = revenueHT + vat;
    const average = count === 0
      ? 0
      : Math.round((revenueHT / count) * 100) / 100;

    let output;

    if (format === 'csv') {
      output = this.csvFormatter.format({
        revenueHT,
        vat,
        revenueTTC,
        byCategory,
      });
    } else if (format === 'html') {
      output = `<h1>Ventes ${month}</h1><p>${count} commande(s), panier moyen ${average} €</p><ul>`;
      for (const c of Object.keys(byCategory).sort())
        output += `<li>${c} : ${byCategory[c]} €</li>`;
      output += `</ul><p><b>Total TTC : ${revenueTTC} €</b></p>`;
    } else if (format === 'json') {
      output = JSON.stringify({
        month,
        count,
        revenueHT,
        vat,
        revenueTTC,
        average,
        byCategory,
      });
    } else {
      throw new Error(`Format non supporté : ${format}`);
    }

    const line = `[${new Date().toISOString()}] rapport ${month} (${format}) : ${count} commande(s)`;
    console.log(line);
    this.history.push(line);

    if (recipient) {
      if (!recipient.includes('@')) {
        throw new Error(`Adresse invalide : ${recipient}`);
      }

      this.outbox.push({
        via: `${this.smtp.host}:${this.smtp.port}`,
        to: recipient,
        subject: `Rapport des ventes ${month}`,
        body: output,
      });
    }

    return output;
  }
}

export class FreeReportService extends ReportService {
  generate(month, format, recipient) {
    if (format !== 'csv') {
      throw new Error('Format réservé aux comptes Pro');
    }

    if (recipient) {
      throw new Error('Envoi par e-mail réservé aux comptes Pro');
    }

    return super.generate(month, format);
  }
}
