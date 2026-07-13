# Table de hachage

## Intuition

Objectif : `inserer`, `chercher`, `supprimer` en **O(1) en moyenne**. L'idée : une
**fonction de hachage** `h` transforme la clé en un indice de tableau :
`h : clé → {0, …, m−1}`. On range la clé dans la case `h(clé)`.

Le problème inévitable : deux clés peuvent tomber dans la même case — une
**collision**. (Avec plus de clés que de cases, c'est certain — principe des tiroirs ;
et même bien avant : paradoxe des anniversaires.) Toute la conception d'une table de
hachage est une stratégie de gestion des collisions.

## La fonction de hachage

Une bonne fonction répartit les clés **uniformément** et se calcule en O(1).

- **Méthode par division** : `h(k) = k mod m`. Choisir `m` premier, loin d'une
  puissance de 2, pour éviter que des motifs dans les clés créent des paquets.
- En Java : `hashCode()` fournit un entier ; la table fait ensuite
  `indice = hash & (m − 1)` (HashMap utilise m = puissance de 2, avec un brassage
  des bits en amont).

**Contrat Java fondamental** : `a.equals(b)` ⇒ `a.hashCode() == b.hashCode()`.
Violer ce contrat rend les clés introuvables dans un `HashMap`.

## Résolution des collisions 1 : le chaînage

Chaque case contient une **liste** des éléments qui y tombent.

```java
// insertion : O(1) — on ajoute en tête de la liste de la case
// recherche : O(1 + α) en moyenne, où α = n / m (facteur de charge)
```

- Le **facteur de charge** `α = n/m` est le nombre moyen d'éléments par case.
- Recherche moyenne : **Θ(1 + α)** ; si on maintient `α = O(1)` (en redimensionnant),
  toutes les opérations sont O(1) en moyenne.
- Pire cas : toutes les clés dans la même case → **O(n)** (mauvaise fonction de
  hachage ou adversaire).

## Résolution des collisions 2 : l'adressage ouvert

Tout est stocké **dans le tableau lui-même**. En cas de collision, on **sonde** les
cases suivantes selon une séquence jusqu'à trouver une case libre :

- **Sondage linéaire** : `h(k), h(k)+1, h(k)+2, …` (mod m). Simple et bon pour le
  cache, mais souffre du **regroupement primaire** (*primary clustering*) : les
  paquets de cases occupées grossissent et s'agglutinent.
- **Sondage quadratique** : `h(k), h(k)+1, h(k)+4, h(k)+9, …` — atténue le
  regroupement primaire.
- **Double hachage** : `h₁(k) + i·h₂(k)` — la meilleure dispersion.

Contraintes propres à l'adressage ouvert :

- `α < 1` obligatoirement (le tableau ne peut pas déborder) ; en pratique on
  redimensionne dès `α > 0,5–0,75`.
- La **suppression** ne peut pas simplement vider la case : elle briserait les
  séquences de sondage. On pose une **pierre tombale** (marqueur « supprimé »)
  que la recherche traverse mais que l'insertion peut réutiliser.

## Chaînage ou adressage ouvert ?

| | Chaînage | Adressage ouvert |
|---|---|---|
| α > 1 possible | oui | non |
| suppression | facile | pierres tombales |
| mémoire | pointeurs de listes | tableau seul (cache-friendly) |
| dégradation quand α monte | douce | brutale près de α = 1 |
| exemple | `HashMap` de Java | `IdentityHashMap`, tables de langages dynamiques |

Compare les deux stratégies dans la visualisation ci-dessous.

## Pièges d'examen

- O(1) est une moyenne **sous hypothèse de hachage uniforme** — le pire cas reste
  O(n). Ne réponds jamais « O(1) garanti ».
- Le facteur de charge α = n/m : `n` éléments, `m` cases — pas l'inverse.
- Adressage ouvert : oublier les pierres tombales à la suppression est LE piège —
  une recherche qui s'arrête sur une case vidée conclut à tort que la clé est absente.
- Une table de hachage ne maintient **aucun ordre** : pour un parcours trié ou des
  requêtes d'intervalle, il faut un ABR équilibré (rouge-noir) — comparaison
  classique d'examen.
- Depuis Java 8, `HashMap` transforme une chaîne trop longue (≥ 8) en **arbre
  rouge-noir** : pire cas O(log n) au lieu de O(n) — joli lien entre les deux
  sections de la semaine !
