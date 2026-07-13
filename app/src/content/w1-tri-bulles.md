# Tri à bulles

## Intuition

On compare les **voisins deux à deux** et on les échange s'ils sont dans le mauvais
ordre. À chaque passe complète, le plus grand élément restant « remonte » comme une
bulle jusqu'à sa position définitive, à droite.

## Fonctionnement

1. Parcourir le tableau de gauche à droite en comparant `a[j]` et `a[j+1]` ;
   échanger si `a[j] > a[j+1]`.
2. À la fin de la passe `i`, l'élément en position `n−1−i` est définitif.
3. Répéter, en s'arrêtant une case plus tôt à chaque passe.
4. **Optimisation** : si une passe entière ne fait aucun échange, le tableau est trié —
   on peut s'arrêter.

## Code Java

```java
public static void triBulles(int[] a) {
    int n = a.length;
    for (int i = 0; i < n - 1; i++) {
        boolean echange = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (a[j] > a[j + 1]) {
                int tmp = a[j];
                a[j] = a[j + 1];
                a[j + 1] = tmp;
                echange = true;
            }
        }
        if (!echange) {
            break;  // aucune inversion restante : déjà trié
        }
    }
}
```

## Complexité

| Cas | Condition | Temps |
|-----|-----------|-------|
| Meilleur cas (avec l'optimisation) | tableau déjà trié | Θ(n) |
| Pire cas | tableau trié à l'envers | Θ(n²) |
| Cas moyen | ordre aléatoire | Θ(n²) |

- **Espace** : O(1) — tri en place.
- **Stabilité** : stable (on n'échange que si strictement supérieur).
- En pratique, le tri à bulles fait beaucoup plus d'échanges que les deux autres tris
  quadratiques : c'est surtout un outil pédagogique.

## Comparatif des trois tris de base

| | Sélection | Insertion | Bulles |
|---|---|---|---|
| Meilleur cas | Θ(n²) | **Θ(n)** | Θ(n) (optimisé) |
| Pire cas | Θ(n²) | Θ(n²) | Θ(n²) |
| Échanges (pire cas) | n − 1 | ≈ n²/2 (décalages) | ≈ n²/2 |
| Stable | non | oui | oui |
| Sensible à l'ordre initial | non | oui | oui (optimisé) |

## Pièges d'examen

- Sans le drapeau `echange`, le meilleur cas reste Θ(n²) — précise toujours si tu
  parles de la version optimisée.
- Après `k` passes, les `k` **plus grands** éléments sont à leur place définitive
  (à droite) — contrairement au tri par sélection où ce sont les plus petits (à gauche).
- La borne `n − 1 − i` de la boucle interne évite de re-comparer la zone déjà triée ;
  oublier le `− i` reste correct mais fait des comparaisons inutiles.
