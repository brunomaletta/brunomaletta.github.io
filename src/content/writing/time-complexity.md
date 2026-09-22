---
title: "Can you find the time complexity?"
date: 2023-01-15
cfId: 111450
cfUrl: "https://codeforces.com/blog/entry/111450"
tags:
summary: "Hello, Codeforces!"
---
Hello, Codeforces!

I want to share with you 2 problems that I was not able to find a tight time complexity / bound for. After trying for a while, I decided to ask here, maybe someone can help me.

## Problem 1

We want to maintain a collection of arrays of integers in $[0, U)$ represented with binary search trees, such as Treaps. We will have $q$ updates, which can be one of the following:

1.  Split an array by position;
2.  Concatenate two arrays;
3.  Reverse an array;
4.  **Split an array by value**.

Of course, it is well known how to support operations (1), (2) and (3) each in $\mathcal O(\log n)$, if $n$ is the total size of the collection.

What is interesting here is operation (4). Going into more detail about what it means, given an array and some value $x$, we want to split this array into two: one containing values that are smaller than $x$ in the same order as they were, and the other containing values that are at least $x$, also in the same order as they originally were. This is equivalent to running

```cpp
std::stable_partition(v.begin(), v.end(), [&](int k) { return k < x; });
```

My proposed solution to implement this is to repeatedly split the array at the first position that has value smaller than $x$, then split at the first position that has value at least $x$, and repeat. It would look like this

```cpp
void treap::partition(int x) {
	treap small, big;
	while (size()) {
		treap tmp;
		split(first_not_smaller(x), tmp);
		small.concat(tmp);
		split(first_smaller(x), tmp);
		big.concat(tmp);
	}
	// Now the elements are split into small and big,
	// and this treap is empty
}
```

The number of splits this algorithms does is the number of positions such that a "small" element and a "big" element are adjacent in the array.

Example

If a=we have an array $a = [2, 3, 5, 7, 8, 1, 3, 6, 4]$, after applying operation (4) with $x = 4$, we would split the array like the following

$$
[2, 3 | 5, 7, 8 | 1, 3 | 6, 4]
$$

So we did 3 splits. We would then concatenate these pieces to get the small array $[2, 3, 1, 3]$ and the big array $[5, 7, 8, 6, 4]$.

Of course, this can be linear in the worst case, but can you find an instance such that this algorithm does $\Theta(q * n)$ splits? My guess is that this algoriths does at most $\mathcal O(\log U)$ splits, amortized. But I was not able to prove this.

I have tried a few potential functions, such as the sum of logs of gaps between adjacent values in the arrays, but they did not work.

Full code: [link](https://github.com/brunomaletta/DynamicArray).

## Problem 2

It turns out that a bound for this problem implies a bound for the previous problem, if we implement it in a specific way.

Imagine that there are $n$ coins, arranged in some piles in an arbitrary way. We will do $n$ operations. In each operation, we choose some number $k \gt 0$, and choose $k$ non-empty piles. For each of these piles, we choose a non-zero number of coins to take from it. All of the coins we took are arranged in a new pile.

The **cost** of the operation is $k$ (note that it is not the total number of coins, but the number of piles).

If we have the freedom to choose our operations in any way we like (and also the starting configuration), what is the maximum cost we can achieve? I could not find an instance that took $\Theta(n^2)$. However it is easy to create an instance that takes $\Theta(n * \sqrt n)$.

Sqrt instance

Assume $n$ is a triangular number, that is, $n = 1 + 2 + \dots + x$. Now we will have piles with 1, 2, 3, ..., $x$ coins. In each operation we take one coin from each pile. We can see that after the operation the configuration is the same, so we can keep repeating this operation of cost $x \in \Theta(\sqrt n)$.

Fun observation

I noticed that, if $n$ is a triangular number, any initial configuration applied repeatedly with the operation of taking one coin from each pile eventually falls in the instance above, that is, sizes of piles eventually become 1, 2, 3, ..., $x$. I could not prove that this always happens.

We think the maximum cost is $\mathcal O(n * \sqrt n)$, but we could not prove it. We managed, however, to prove this bound if we restrict the operation a bit: if we only allow to take at most one coin per pile.

Proof

Let us define a grah $G$, such that each vertex represents a coin, and there is an edge between two vertices if they are in the same pile. So the graph is disjoint union of cliques. Now let's count how many edges are created and deleted after each operation.

We can see that we remove at most $n-1$ edges, since, for each clique (pile) we select, we remove its size minus 1, and we add $\binom k 2$ edges, if we seleced $k_i$ piles at operation $i$. At the end we have at most $\binom n 2$ edges, so

$$
\sum_{i=1}^n\left( \binom{k_i}{2} - n \right) \leq \binom n 2
$$

$$
\sum_{i=1}^n \binom{k_i}{2} \leq \frac{n^2 - n}{2} + n^2 = \frac{3n^2 - n}{2}
$$

Since we are only interested in the asymptotic behavior, for some constant $c$,

$$
\sum_{i=1}^nk_i^2 \leq c n^2,
$$

but

$$
\frac 1 n \left( \sum_{i=1}^n k_i \right) ^2 \leq \sum_{i=1}^n k_i^2,
$$

This comes from [Chebyshev's sum inequality](https://en.wikipedia.org/wiki/Chebyshev%27s_sum_inequality). So

$$
\frac 1 n \left( \sum_{i=1}^n k_i \right) ^2 \leq \sum_{i=1}^n k_i^2 \leq c n^2
$$

$$
\left( \sum_{i=1}^n k_i \right) ^2 \leq c n^3
$$

$$
\sum_{i=1}^n k_i \leq \sqrt c \cdot n^{\frac 3 2},
$$

as we wanted.

## Challenge

Can you prove any of the above unproven bounds? Can you find a counter-example? Please let me know, I will be happy to discuss this in the comments!
