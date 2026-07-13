# Tri par insertion

## Intuition

On construit progressivement une partie triée à gauche du tableau. À chaque étape, on
prend le prochain élément et on **l'insère à sa place** dans la partie triée, en décalant
vers la droite tous les éléments plus grands que lui.

> Image mentale : c'est exactement comme trier des cartes qu'on ramasse une à une —
> chaque nouvelle carte est glissée à sa place dans la main déjà triée.

## Fonctionnement

1. La partie `a[0..0]` est triée (un seul élément).
2. Pour `i` de 1 à n−1 : mémoriser `cle = a[i]`, décaler vers la droite tous les
   éléments de la partie triée qui sont plus grands que `cle`, puis déposer `cle`
   dans le trou.

## Code Java

```java
public static void triInsertion(int[] a) {
    for (int i = 1; i < a.length; i++) {
        int cle = a[i];
        int j = i - 1;
        while (j >= 0 && a[j] > cle) {
            a[j + 1] = a[j];   // décalage vers la droite
            j--;
        }
        a[j + 1] = cle;        // insertion de la clé dans le trou
    }
}
```

## Complexité

| Cas | Condition | Temps |
|-----|-----------|-------|
| Meilleur cas | tableau déjà trié | Θ(n) |
| Pire cas | tableau trié à l'envers | Θ(n²) |
| Cas moyen | ordre aléatoire | Θ(n²) |

- **Espace** : O(1) — tri en place.
- **Stabilité** : stable (on ne décale que si `a[j] > cle`, strictement).
- **Point fort** : excellent sur les tableaux *presque triés* — le temps est
  O(n + d) où `d` est le nombre d'inversions. C'est pourquoi il sert de finition
  dans des tris hybrides comme Timsort.

## Pièges d'examen

- Le meilleur cas Θ(n) est la question classique : sur un tableau trié, la boucle
  `while` ne s'exécute jamais → une seule comparaison par élément.
- La condition `a[j] > cle` (et non `>=`) est ce qui rend le tri **stable** —
  sache l'expliquer.
- Insertion ≠ sélection : ici le nombre de comparaisons **dépend de l'entrée**,
  contrairement au tri par sélection.
- Le nombre de décalages total = nombre d'inversions du tableau. Un tableau trié à
  l'envers a n(n−1)/2 inversions, d'où le pire cas quadratique.
