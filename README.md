# TP3 — Refactoring SOLID — Parcours Data

## Contenu
- `ReportService.js` : code de départ retranscrit depuis le PDF.
- `orders.json` : **jeu de données synthétique de travail**, pas le fichier original du professeur.
- `VIOLATIONS.md` : analyse des violations et réponses Data.
- `DIAGRAMMES.md` : diagrammes actuel et cible.
- `REVUE.md` : modèle à compléter après la revue croisée.
- `CsvFormatter.js` et les tests seront ajoutés pendant la suite du TP.

## Attention sur les fichiers originaux
Le ZIP reçu ne contenait pas les fichiers du TP3. Le PDF donne le code de `ReportService.js`, les noms de sept tests et la sortie attendue de la démo, mais pas le contenu complet des tests originaux ni celui du vrai `orders.json`. Le jeu de données présent ici est synthétique et ne doit pas être présenté comme le fichier fourni par l'enseignant.

## Exécuter le code de départ
Il faut Node.js installé. Dans le terminal, depuis ce dossier :

```powershell
node --version
node --input-type=module -e "import { ReportService } from './ReportService.js'; console.log(new ReportService().generate('2026-09', 'json'))"
```

Cette commande vérifie le chargement des données et le calcul JSON. Les tests de caractérisation originaux restent à récupérer ou à reconstruire séparément.
