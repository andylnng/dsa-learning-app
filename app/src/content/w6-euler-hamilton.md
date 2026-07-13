# Chemin d'Euler et chemin hamiltonien

## Deux questions qui se ressemblent… et un abîme entre elles

- **Chemin d'Euler** : passer par **chaque arête exactement une fois**.
- **Chemin hamiltonien** : passer par **chaque sommet exactement une fois**.

Symétriques en apparence — mais l'une se décide en temps linéaire, l'autre est
NP-complète. C'est l'exemple favori du cours pour introduire l'optimisation
combinatoire (semaine 8).

## Le chemin d'Euler (les ponts de Königsberg)

**Théorème d'Euler** (graphe connexe, non orienté) :

| Sommets de degré impair | Conclusion |
|---|---|
| 0 | **circuit** d'Euler (cycle qui revient au départ) |
| 2 | **chemin** d'Euler (part d'un impair, finit à l'autre) |
| 4, 6, … | ni chemin ni circuit |

(Le nombre de sommets impairs est toujours pair — lemme des poignées de main.)

L'intuition : chaque passage par un sommet intermédiaire consomme deux arêtes
(une pour entrer, une pour sortir). Un degré impair ne peut être qu'un départ ou
une arrivée.

### Construire le chemin : l'algorithme de Hierholzer — O(m)

1. Partir d'un sommet (impair s'il y en a) et avancer en **effaçant** chaque arête
   utilisée, jusqu'à se bloquer (on se bloque forcément au point d'arrivée).
2. S'il reste des arêtes, prendre un sommet du chemin qui en a encore, en faire un
   **détour** (sous-circuit) et l'insérer dans le chemin.
3. Répéter jusqu'à épuisement des arêtes.

```java
// Hierholzer (esquisse) : pile de parcours + insertion des détours
Deque<Integer> pile = new ArrayDeque<>();
List<Integer> chemin = new ArrayList<>();
pile.push(depart);
while (!pile.isEmpty()) {
    int u = pile.peek();
    if (aEncoreDesAretes(u)) {
        int v = prendreEtEffacerUneArete(u);
        pile.push(v);              // on s'enfonce
    } else {
        chemin.add(pile.pop());    // bloqué : u rejoint le chemin final
    }
}
// « chemin » contient le parcours d'Euler (à l'envers)
```

Déroule la visualisation : les arêtes s'effacent une à une, les détours s'insèrent.

## Le chemin hamiltonien

Aucune condition simple n'existe : décider si un graphe possède un chemin (ou cycle)
hamiltonien est **NP-complet**. En pratique :

- **Backtracking** (semaine 2) : construire le chemin sommet par sommet, revenir en
  arrière à chaque impasse — exponentiel dans le pire cas.
- Il existe des conditions **suffisantes** (jamais nécessaires), p. ex. le théorème
  de Dirac : si chaque sommet a un degré ≥ n/2 (n ≥ 3), le graphe a un cycle
  hamiltonien.
- Le **problème du voyageur de commerce** (TSP) en est la version pondérée :
  le cycle hamiltonien de coût minimal.

## Euler vs Hamilton : le tableau à retenir

| | Euler | Hamilton |
|---|---|---|
| objet parcouru | **arêtes** (toutes, une fois) | **sommets** (tous, une fois) |
| test d'existence | degrés pairs + connexité, **O(n + m)** | **NP-complet** |
| construction | Hierholzer, **O(m)** | backtracking, exponentiel |

## Pièges d'examen

- Ne mélange pas : Euler = arêtes, Hamilton = sommets. Un graphe peut avoir l'un sans
  l'autre, les deux, ou aucun.
- Le théorème d'Euler exige la **connexité** (des sommets de degré > 0) — quatre
  degrés pairs dans un graphe en deux morceaux ne donnent rien.
- « 2 sommets impairs » : le chemin **doit** partir de l'un et finir à l'autre —
  pas le choix du départ.
- Vérifier qu'un chemin donné est hamiltonien est facile (polynomial) ; c'est en
  **trouver** un qui est dur — la distinction même qui définira NP (semaine 8).
