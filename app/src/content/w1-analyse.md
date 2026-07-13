# Analyse asymptotique : O, Ω et Θ

## Intuition

Deux algorithmes peuvent résoudre le même problème, mais l'un peut devenir inutilisable
quand les données grossissent. L'analyse asymptotique répond à la question : **comment le
temps d'exécution grandit-il quand la taille de l'entrée `n` grandit ?** On ignore les
constantes et les détails de la machine pour ne garder que le *taux de croissance*.

> L'idée clé : on ne mesure pas des secondes, on compte des **opérations élémentaires**
> en fonction de `n`, et on regarde ce qui domine quand `n` devient grand.

## Les trois notations

### Grand O — borne supérieure

`f(n) = O(g(n))` signifie qu'à partir d'un certain `n₀`, `f(n) ≤ c·g(n)` pour une
constante `c > 0`. Autrement dit : **`f` ne croît pas plus vite que `g`**.

C'est la notation la plus utilisée : elle garantit le pire cas.

### Grand Ω (oméga) — borne inférieure

`f(n) = Ω(g(n))` signifie qu'à partir d'un certain `n₀`, `f(n) ≥ c·g(n)`.
Autrement dit : **`f` croît au moins aussi vite que `g`**. On l'utilise pour dire
« on ne peut pas faire mieux que ça ».

### Grand Θ (thêta) — borne exacte

`f(n) = Θ(g(n))` signifie que `f` est à la fois `O(g(n))` et `Ω(g(n))` :
`c₁·g(n) ≤ f(n) ≤ c₂·g(n)`. C'est **l'ordre de croissance exact**.

## Taux de croissance courants

| Notation | Nom | Exemple typique |
|----------|-----|-----------------|
| O(1) | constant | accès à un tableau `a[i]` |
| O(log n) | logarithmique | recherche binaire |
| O(n) | linéaire | parcours d'un tableau |
| O(n log n) | quasi linéaire | tri fusion, tri rapide (moyen) |
| O(n²) | quadratique | tris de base (sélection, insertion, bulles) |
| O(2ⁿ) | exponentiel | énumération de tous les sous-ensembles |

Utilise la visualisation ci-dessous pour *voir* pourquoi un algorithme en `O(n²)` ou
`O(2ⁿ)` devient vite impraticable.

## Règles pratiques

1. **On laisse tomber les constantes** : `3n² + 10n + 5 = Θ(n²)`.
2. **Seul le terme dominant compte** : `n² + n log n + n = Θ(n²)`.
3. **Boucles imbriquées** : on multiplie. Deux boucles de `n` itérations → `O(n²)`.
4. **Boucles successives** : on additionne, puis on garde le dominant.
5. **Diviser la taille par 2 à chaque itération** → `O(log n)`.

```java
// O(n) : une seule boucle
int somme = 0;
for (int i = 0; i < n; i++) {
    somme += a[i];
}

// O(n²) : deux boucles imbriquées
int paires = 0;
for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
        paires++;
    }
}

// O(log n) : la taille du problème est divisée par 2 à chaque tour
int i = n;
while (i > 1) {
    i = i / 2;
}
```

## Types d'analyse

- **Pire cas** (le plus courant) : garantie maximale, notée avec O.
- **Meilleur cas** : rarement utile seul, noté avec Ω.
- **Cas moyen** : espérance sur les entrées possibles — souvent plus difficile à établir.

## Pièges d'examen

- **O n'est pas le pire cas par définition** : O décrit une *borne*, pas un scénario.
  On peut dire « le meilleur cas du tri par insertion est O(n) ».
- `f(n) = O(g(n))` **n'implique pas** `g(n) = O(f(n))`.
- Une affirmation comme « cet algorithme est O(n³) » peut être vraie même s'il est
  aussi O(n²) — O est une borne supérieure, pas nécessairement serrée. Θ, lui, est serré.
- Attention à la base des logarithmes : `log₂ n = Θ(log₁₀ n)` — la base ne change
  que la constante, donc on écrit simplement `log n`.
