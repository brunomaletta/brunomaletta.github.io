---
title: "tgen::miniblog(3): Alias Method"
date: 2026-08-19
cfId: 156111
cfUrl: "https://codeforces.com/blog/entry/156111"
tags:
summary: "This is a blog 3 of a series of blogs about algorithmic challenges I came across when creating tgen."
---
<p class="figure"><img class="tgen-logo" src="/writing/tgen-logo-white.svg" alt="tgen" /></p>


*This is a blog 3 of a series of blogs about algorithmic challenges I came across when creating [tgen](https://codeforces.com/blog/entry/154468).*

In this blog we will tackle:

1.  Create a data structure with $\mathcal O(n)$ time construction that can return $i \in [0, n)$ with probability proportional to $w[i] \geq 0$ in $\mathcal O(1)$ time.

It is trivial to create such a data structure with $\Theta(\log n)$ query time: with a prefix sum array $p$ with values in $[0, S]$, where $S = \sum_i w[i]$, just pick a uniformly random value $x \in [0, S)$, and then do a binary search to find and return the first index $i$ such that $p[i] \gt x$.

Turns out that we can improve the query to $\mathcal O(1)$ time, with linear construction. This is the **alias method**.

If all weights were the same, $S / n$, then it would be trivial: just return `next(0, n-1)`. If not, some indices are *small* ($w[i] \lt S / n$), and some are *big* ($w[i] \geq S / n$). The idea is to "transfer" the exceeding probability of the small indices to the big ones.

To do that, after we choose a random index `i = next(0, n-1)`, we will either return `i` with probability `mass[i] / S`, or return `alias[i]`. Note that there is no chaining, that is, we don't follow many `alias` pointers; we either return `i` or `alias[i]`. Now we are left to show that it is always possible to choose an assignment for `alias[i]` and `mass[i]` in such a way that the probabilities are maintained.

To start, we scale every weight by $n$ to make everything an integer, so outcome $i$ has mass $n \cdot w[i]$. The average scaled mass is exactly $S$. Maintain two queues: $\mathrm{small}$ for indices with current mass $\lt S$, and $\mathrm{big}$ for indices with current mass $\geq S$. While both are nonempty, pop $s$ from $\mathrm{small}$ and $b$ from $\mathrm{big}$. Index $s$ is finalized: we keep $\mathrm{mass}[s]$ as the threshold for returning $s$, and set $\mathrm{alias}[s] = b$, so the leftover $S - \mathrm{mass}[s]$ of the pick is given to $b$. This leftover is at most $S$ (since $\mathrm{mass}[s] \geq 0$), and $\mathrm{mass}[b] \geq S$, so we never subtract more from $b$ than it has. After subtracting that leftover from $\mathrm{mass}[b]$, we put $b$ back into the appropriate queue (depending on whether its remaining mass is small or big). Each step permanently finalizes one index.

At the end, all indices remaining in $\mathrm{big}$ must have mass exactly $S$ (because the existence of an index with mass $\gt S$ implies another with mass $\lt S$), so those indices are finalized as a single outcome (they are their own alias).

```cpp
struct alias_method {
	int n;
	long long S;
	std::vector<long long> mass;
	std::vector<int> alias;

	alias_method(const std::vector<int>& w) : n(w.size()), alias(n) {
		S = 0;
		for (auto x : w) S += x;

		std::queue<int> small, big;
		for (int i = 0; i < n; i++) {
			mass.push_back(n * w[i]);
			if (mass[i] < S) small.push(i);
			else big.push(i);
		}

		while (!small.empty() and !big.empty()) {
			int s = small.front(); small.pop();
			int b = big.front(); big.pop();

			alias[s] = b;
			mass[b] -= S - mass[s];

			if (mass[b] < S) small.push(b);
			else big.push(b);
		}

		while (!big.empty()) {
			int b = big.front(); big.pop();
			alias[b] = b;
			mass[b] = S;
		}
	}
};
```

> Algorithm 1: alias method construction.

To sample, pick a uniform index and compare a uniform sample in $[0, S)$ against the threshold stored in that index:

```cpp
int next(const alias_method& a) {
	int i = next(0, a.n - 1);
	long long x = next(0, a.S - 1);
	return x < a.mass[i] ? i : a.alias[i];
}
```

> Algorithm 2: alias method query.

**Theorem 1:** Algorithm 2 returns index $i$ with probability $w[i] / S$.

**Proof:** Algorithm 2 picks an index $j$ uniformly at random, then returns $j$ if $x \lt \mathrm{mass}[j]$ and $\mathrm{alias}[j]$ otherwise, with $x$ uniform in $[0, S)$. So, conditioned on picking $j$, we return $j$ with probability $\mathrm{mass}[j]/S$ and $\mathrm{alias}[j]$ with probability $1 - \mathrm{mass}[j]/S$.

Initially $\mathrm{mass}[i] = n \cdot w[i]$. Each pairing of a small index $s$ with a big index $b$ keeps $\mathrm{mass}[s]$ units with $s$ and moves $S - \mathrm{mass}[s]$ units from $b$ to the alias of $s$.

The probability of returning $i$ is therefore

$$
\frac{1}{n} \cdot \frac{\mathrm{mass}[i]}{S} + \sum_{\mathrm{alias}[j] = i} \frac{1}{n} \cdot \frac{S - \mathrm{mass}[j]}{S} = \frac{A_i}{nS},
$$

where $A_i = \mathrm{mass}[i] + \sum_{\mathrm{alias}[j] = i} (S - \mathrm{mass}[j])$. The first term is the case where we pick $i$ and keep it; each term in the sum is the case where we pick some $j$ and take the alias $i$.

Initially $A_i = n \cdot w[i]$, since there are no aliases yet. A pairing does not change $A_s$ or $A_b$. We do not change $\mathrm{mass}[s]$, so $A_s$ stays the same. For $A_b$, we subtract $S - \mathrm{mass}[s]$ from $\mathrm{mass}[b]$, but we also set $\mathrm{alias}[s] = b$, which adds the same $S - \mathrm{mass}[s]$ to the sum in $A_b$. Thus $A_i = n \cdot w[i]$ at the end, so we get the final probability of returning $i$:  
  

$$
\frac{A_i}{nS} = \frac{n \cdot w[i]}{nS} = \frac{w[i]}{S}.
$$

$$
\square
$$

### References

Alias method (Wikipedia): <https://en.wikipedia.org/wiki/Alias_method>

Keith Schwarz's exposition: <https://www.keithschwarz.com/darts-dice-coins/>
