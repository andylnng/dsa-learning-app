# Diviser pour régner

## Intuition

**Diviser pour régner** (*divide and conquer*) résout un problème en trois temps :

1. **Diviser** : couper le problème en sous-problèmes *indépendants*, généralement de
   taille `n/b`.
2. **Régner** : résoudre chaque sous-problème récursivement (le cas de base résout
   directement les tout petits).
3. **Combiner** : fusionner les solutions partielles en une solution globale.

La puissance vient de la division par un *facteur* (n/2, n/4…) plutôt que par
soustraction (n−1) : la profondeur devient logarithmique.

## Exemple 1 : la recherche binaire

Un seul sous-problème de taille n/2, combinaison triviale :

```java
public static int rechercheBinaire(int[] a, int cible) {
    int gauche = 0, droite = a.length - 1;
    while (gauche <= droite) {
        int milieu = gauche + (droite - gauche) / 2;
        if (a[milieu] == cible) return milieu;
        if (a[milieu] < cible)  gauche = milieu + 1;
        else                    droite = milieu - 1;
    }
    return -1;
}
```

Récurrence : `T(n) = T(n/2) + O(1)` → **Θ(log n)**.

## Exemple 2 : le tri fusion

Deux sous-problèmes de taille n/2, combinaison en O(n) (la fusion) :

```java
public static void triFusion(int[] a, int debut, int fin) {
    if (fin - debut <= 1) return;            // cas de base : 0 ou 1 élément
    int milieu = (debut + fin) / 2;
    triFusion(a, debut, milieu);             // régner à gauche
    triFusion(a, milieu, fin);               // régner à droite
    fusionner(a, debut, milieu, fin);        // combiner en O(n)
}

private static void fusionner(int[] a, int debut, int milieu, int fin) {
    int[] tmp = new int[fin - debut];
    int i = debut, j = milieu, k = 0;
    while (i < milieu && j < fin) {
        tmp[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];  // <= : tri stable
    }
    while (i < milieu) tmp[k++] = a[i++];
    while (j < fin)    tmp[k++] = a[j++];
    System.arraycopy(tmp, 0, a, debut, tmp.length);
}
```

Récurrence : `T(n) = 2T(n/2) + Θ(n)` → **Θ(n log n)**, dans *tous* les cas.
Espace : Θ(n) pour le tableau temporaire — le tri fusion n'est pas en place.

## Quand ça marche (et quand ça ne marche pas)

- ✔ Les sous-problèmes doivent être **indépendants**. S'ils se recouvrent (comme
  `fib(n)`), diviser pour régner explose — c'est le domaine de la programmation
  dynamique.
- ✔ La combinaison doit être moins coûteuse que la résolution brute.
- Exemples classiques : tri fusion, tri rapide, recherche binaire, exponentiation
  rapide (`xⁿ` en O(log n)), multiplication de Karatsuba, plus proche paire de points.

## Pièges d'examen

- Le tri **rapide** est aussi diviser pour régner, mais sa division (le pivot) peut
  être déséquilibrée → pire cas Θ(n²) ; le tri **fusion** garantit n/2 – n/2 → Θ(n log n) toujours.
- `int milieu = (gauche + droite) / 2` peut déborder en Java avec de très grands
  indices ; écris `gauche + (droite - gauche) / 2`.
- « Diviser » par soustraction (`T(n) = T(n−1) + …`) ne donne PAS du log : profondeur n.
