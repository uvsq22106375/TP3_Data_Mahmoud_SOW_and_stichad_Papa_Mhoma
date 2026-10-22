# TP3 — Refactoring SOLID — Parcours Data

## Contenu du projet

- `Re`.`portService.js` : classe principale du service de génération de rapports.
- `CsvFormatter.js` : classe extraite pour gérer le formatage des rapports CSV.
- `orders.json` : jeu de données synthétique utilisé pour les tests et la démonstration.
- `VIOLATIONS.md` : analyse des violations des principes SOLID et réponses aux questions du parcours Data.
- `DIAGRAMMES.md` : diagrammes de classes avant le refactoring et architecture cible.
- `REVUE.md` : compte rendu de la revue croisée.
- `ReportService.caracterisation.test.js` : tests de caractérisation du comportement du service.
- `ReportService.injection.test.js` : test de l'injection du formateur CSV.
- `ReportService.behavior.test.js` : tests complémentaires du comportement.
- `demo.js` : script de démonstration.
- `package.json` : configuration du projet Node.js


## Objectif du TP

L'objectif est d'identifier les violations des principes SOLID dans `ReportService.js`, de proposer une architecture cible plus modulaire et de réaliser une extraction accompagnée de tests, tout en préservant le comportement attendu du service.
