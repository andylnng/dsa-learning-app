# Tri par sélection

## Intuition

À chaque tour, on **sélectionne le plus petit élément** de la partie non triée et on le
place à sa position définitive, au début. Après le tour `i`, les `i + 1` premiers
éléments sont triés et ne bougeront plus jamais.

> Image mentale : tu tries une main de cartes en cherchant à chaque fois la plus petite
> carte restante et en la posant à gauche.

## Fonctionnement

1. Chercher le minimum de `a[0..n-1]`, l'échanger avec `a[0]`.
2. Chercher le minimum de `a[1..n-1]`, l'échanger avec `a[1]`.
3. Répéter jusqu'à `a[n-2]`.

## Code Java

```java
public static void triSelection(int[] a) {
    int n = a.length;
    for (int i = 0; i < n - 1; i++) {
        int min = i;
        for (int j = i + 1; j < n; j++) {
            if (a[j] < a[min]) {
                min = j;
            }
        }
        if (min != i) {
            int tmp = a[i];
            a[i] = a[min];
            a[min] = tmp;
        }
    }
}
```

## Complexité

| Cas | Comparaisons | Échanges | Temps |
|-----|--------------|----------|-------|
| Pire cas | n(n−1)/2 | n − 1 | Θ(n²) |
| Meilleur cas | n(n−1)/2 | 0 | Θ(n²) |
| Cas moyen | n(n−1)/2 | ≈ n | Θ(n²) |

Le nombre de comparaisons est **toujours** n(n−1)/2, que le tableau soit déjà trié ou
non : le tri par sélection est Θ(n²) dans *tous* les cas.

- **Espace** : O(1) — tri en place.
- **Stabilité** : non stable (l'échange peut faire sauter un élément par-dessus ses égaux).
- **Point fort** : nombre minimal d'échanges (au plus n − 1) — utile si l'écriture coûte cher.

## Pièges d'examen

- « Le tri par sélection est plus rapide sur un tableau déjà trié » — **faux** : il fait
  exactement le même nombre de comparaisons.
- Ne confonds pas avec le tri par insertion : sélection cherche *l'élément* pour une
  *position fixe* ; insertion cherche *la position* pour un *élément fixe*.
- Sache justifier le n(n−1)/2 : c'est la somme (n−1) + (n−2) + … + 1.
