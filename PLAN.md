# Plan — App web d'apprentissage LOG320 (Structures de données et algorithmes)

Application web personnelle pour suivre le cours **LOG320 (ÉTS)**, basée sur le livre
*Data Structures and Algorithms Made Easy in Java* (Narasimha Karumanchi).

## Objectif

Un compagnon de cours : leçons en **français** (terminologie du cours), organisées selon
les notions de LOG320, avec des **visualisations interactives** pour chaque structure de
données et algorithme clé. Progression sauvegardée localement (localStorage).

## Pile technologique

- **React 18 + Vite + TypeScript** — SPA sans backend
- **Tailwind CSS** — styles
- Contenu des leçons en **MDX/Markdown** structuré, chargé statiquement
- Visualisations : composants React + SVG maison (pas de lib externe lourde)
- Déploiement : GitHub Pages ou Vercel (statique)

## Modules (notions LOG320 → chapitres du livre)

| # | Module | Chapitres du livre | Visualisations prévues |
|---|--------|--------------------|------------------------|
| 1 | Analyse asymptotique (O, Ω, Θ, récurrences, théorème maître) | 1 | Courbes de croissance comparées ; compteur d'opérations |
| 2 | Récursivité et retour arrière (backtracking) | 2 | Pile d'appels animée ; arbre de récursion ; N-reines pas à pas |
| 3 | Structures de base : tableaux, listes chaînées, piles, files | 3–5 | Insertion/suppression animées ; pile & file en action |
| 4 | Arbres (binaires, BST, AVL) | 6 | Insertion/recherche/suppression BST ; rotations AVL ; parcours |
| 5 | Files de priorité et monceaux (heaps) | 7 | Heapify, insertion, extraction du min/max |
| 6 | Tables de hachage | 13–14 | Fonction de hachage, collisions (chaînage / adressage ouvert) |
| 7 | Tri et recherche | 10–11 | Tri à bulles, insertion, fusion, rapide, tas — animés et comparés |
| 8 | Graphes : représentations, BFS/DFS, plus courts chemins, ACM | 8–9 | BFS/DFS pas à pas ; Dijkstra ; Kruskal/Prim (avec ensembles disjoints) |
| 9 | Diviser pour régner | 16, 18 | Découpage récursif visualisé (tri fusion, recherche binaire) |
| 10 | Algorithmes gloutons | 17 | Sélection d'activités ; codage de Huffman |
| 11 | Programmation dynamique | 19 | Table DP remplie pas à pas (Fibonacci, sac à dos, LCS) |
| 12 | Séparation et évaluation (branch and bound) | 16 + complément | Arbre d'exploration avec élagage |
| 13 | Algorithmes sur les chaînes | 15 | Recherche naïve vs KMP/Boyer-Moore animées |
| 14 | Classes de complexité et programmation linéaire (intro) | 20 + complément | Diagramme P/NP ; région réalisable 2D |

> ⚠️ Liste à valider : l'utilisateur doit confirmer/ajuster selon le plan de cours officiel.

## Fonctionnalités

1. **Lecteur de leçons** — barre latérale (modules → sections), typographie soignée,
   blocs de code Java avec coloration syntaxique, notes de complexité mises en évidence.
2. **Visualisations interactives** — contrôles lecture/pause/pas-à-pas, vitesse réglable,
   données d'entrée modifiables.
3. **Suivi de progression léger** — case « section lue » ; écran d'accueil « reprendre où
   j'en étais » ; pourcentage par module. Stocké dans localStorage.
4. **Recherche** — recherche plein texte simple dans les titres de sections.

## Contenu

- Leçons **rédigées en français** (originales, suivant la structure du livre — pas de
  reproduction verbatim du texte sous droit d'auteur), termes techniques usuels conservés.
- Exemples de code en **Java** (langage du livre et des travaux pratiques du cours).
- Chaque section : intuition → fonctionnement → code → complexité → pièges d'examen.

## Étapes de réalisation

1. **Scaffold** : Vite + React + TS + Tailwind, routing, layout (sidebar + lecteur).
2. **Moteur de contenu** : schéma des modules/sections, rendu markdown, progression localStorage.
3. **Modules 1–3** (analyse, récursivité, structures de base) + premières visualisations.
4. **Modules 4–8** (arbres, heaps, hachage, tri, graphes) — le cœur visuel de l'app.
5. **Modules 9–14** (techniques de conception, chaînes, complexité).
6. **Polissage** : recherche, responsive, mode sombre, déploiement.
