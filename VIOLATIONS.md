# Analyse des violations SOLID — Parcours Data

Les numéros de lignes indiqués ci-dessous correspondent au code initial fourni dans l'énoncé, avant le refactoring. Ils peuvent différer dans la version actuelle de `ReportService.js`.

## 1. Single Responsibility Principle (SRP) — Principe de responsabilité unique

**Lignes concernées :** 15–18, 22–39, 41–55 et 57–71 du code initial.

**Problème :** la classe `ReportService` cumule plusieurs responsabilités :
- Lecture des commandes depuis un fichier JSON ;
- Calcul des indicateurs métier ;
- Génération des rapports CSV, HTML et JSON ;
- Journalisation ;
- Préparation des e-mails.

**Conséquence concrète :** une modification du calcul du chiffre d'affaires ou du format de sortie peut nécessiter de modifier une classe qui gère également l'accès aux fichiers et la préparation des e-mails.

**Amélioration réalisée :** le formatage CSV a été extrait dans la classe `CsvFormatter`. Cette extraction sépare le formatage CSV du reste des responsabilités de `ReportService`.

## 2. Open/Closed Principle (OCP) — Ouvert à l'extension, fermé à la modification

**Lignes concernées :** 41–55 du code initial.

**Problème :** les formats de sortie sont sélectionnés par une succession de conditions `if / else if` dans la méthode `generate`.

**Conséquence concrète :** l'ajout d'un nouveau format, par exemple PDF, nécessite de modifier la méthode `generate` de `ReportService`.

**Amélioration possible :** utiliser des formateurs indépendants, sélectionnés selon le format demandé, afin de pouvoir ajouter de nouveaux formats en limitant les modifications de `ReportService`.

## 3. Liskov Substitution Principle (LSP) — Principe de substitution de Liskov

**Lignes concernées :** 77–82 du code initial.

**Problème :** la classe `FreeReportService` hérite de `ReportService`, mais refuse les formats HTML et JSON ainsi que l'envoi d'e-mails acceptés par le service parent.

**Conséquence concrète :** remplacer une instance de `ReportService` par une instance de `FreeReportService` peut provoquer une erreur pour un appel qui fonctionnait avec la classe parente.

**Amélioration possible :** revoir l'héritage ou séparer les capacités disponibles selon le type de service afin que les sous-classes respectent les usages attendus de la classe parente.

## 4. Dependency Inversion Principle (DIP) — Principe d'inversion des dépendances

**Lignes concernées :** ligne 4 et lignes 9–10 du code initial.

**Problème :** `ReportService` dépend directement du module concret `node:fs`, construit lui-même le chemin du fichier et contient une configuration SMTP concrète. Ces choix illustrent un couplage à des détails techniques.

**Conséquence concrète :** remplacer la source des commandes ou le mécanisme d'envoi des e-mails nécessite des modifications dans `ReportService`.

**Amélioration réalisée :** le formateur CSV est injecté dans le constructeur. Le service peut recevoir un faux formateur pendant les tests, ce qui facilite la vérification de son comportement.

**Limite actuelle :** le dépôt de données, la journalisation et l'envoi d'e-mails ne sont pas encore injectés derrière des interfaces. L'inversion des dépendances reste donc partielle.

## 5. Séparation insuffisante des calculs métier et de la génération du rapport

**Lignes concernées :** 22–39 du code initial.

**Problème :** le filtrage des commandes et le calcul des indicateurs sont réalisés dans la même méthode que la génération des rapports.

**Conséquence concrète :** réutiliser les indicateurs dans un tableau de bord est moins simple, car les calculs sont intégrés à une méthode qui gère également la génération du rapport et la journalisation.

**Amélioration possible :** extraire les calculs dans une fonction ou une classe métier indépendante qui retourne un objet contenant les indicateurs. Ceux-ci pourraient alors être réutilisés dans différents composants, notamment un tableau de bord ou un générateur de rapports.

## Réponses spécifiques au parcours Data

### 1. Où sont calculés les indicateurs ?

Les indicateurs sont calculés dans la méthode `generate`, aux lignes 25–39 du code initial :
- `revenueHT` : chiffre d'affaires hors taxes ;
- `vat` : montant de TVA ;
- `revenueTTC` : chiffre d'affaires toutes taxes comprises ;
- `average` : panier moyen, calculé à partir du chiffre d'affaires HT et du nombre de commandes ;
- `byCategory` : chiffre d'affaires HT réparti par catégorie.

### 2. Peut-on réutiliser ces indicateurs dans un tableau de bord sans fichier ni e-mail ?

Pas facilement dans la version initiale, car les calculs sont intégrés à la génération du rapport et le service lit les commandes depuis un fichier.

Il serait préférable d'extraire les calculs dans un composant indépendant qui retourne les indicateurs sous forme d'objet. Un tableau de bord pourrait alors utiliser ces indicateurs sans dépendre du format CSV, HTML ou JSON, ni de la préparation des e-mails.

### 3. Quelles règles de qualité des données sont appliquées ?

Le code initial applique les règles suivantes :
- Les commandes dont le statut est `CANCELLED` sont ignorées ;
- Si aucune commande n'est comptabilisée, le panier moyen vaut `0` ;
- La TVA et le panier moyen sont arrondis à deux décimales ;
- Les commandes sont filtrées selon le préfixe de date correspondant au mois demandé.

Ces règles correspondent aux traitements présents dans le code. Elles ne constituent pas une validation complète de la qualité des données.

### 4. Quelle règle de qualité des données manque selon nous ?

Le code ne valide pas explicitement plusieurs éléments :
- La validité du mois demandé et des dates ;
- La présence des champs obligatoires ;
- Les quantités ou les prix négatifs ;
- L'absence de catégorie ;
- Les commandes en doublon ;
- Les lignes de commande mal formées.

Il faudrait définir les règles métier attendues, puis ajouter les validations et les tests correspondants.

Ces contrôles constituent des améliorations proposées : ils ne sont pas implémentés dans la version actuelle du code. Leur pertinence doit être confirmée en fonction des règles métier attendues.