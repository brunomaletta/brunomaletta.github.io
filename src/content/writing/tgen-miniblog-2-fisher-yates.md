---
title: "tgen::miniblog(2): Fisher-Yates' algorithm"
date: 2026-06-21
cfId: 154657
cfUrl: "https://codeforces.com/blog/entry/154657"
tags:
summary: "This is a blog 2 of a series of blogs about algorithmic challenges I came across when creating tgen."
---
<p class="figure"><img class="tgen-logo" src="/writing/tgen-logo-white.svg" alt="tgen" /></p>


*This is a blog 2 of a series of blogs about algorithmic challenges I came across when creating [tgen](https://codeforces.com/blog/entry/154468).*

In this blog we will tackle:

1.  Generate a uniformly random permutation of length $n$;
2.  Generate $k$ uniformly random distinct integers in the range $[0, n)$ in $\mathcal O(k \log k)$ time.

In my previous blog [tgen::miniblog(1)](https://codeforces.com/blog/entry/154593) we saw a way to solve (2) in $\mathcal O(k \log^2 k)$ time, so we will improve this bound.

The Fisher-Yates' algorithm is very simple. We start with the identity permutation $p = [0, 1, \dots, n-1]$ and at the end we will have a permutation of $p$ uniformly at random, that is, each permutation will be generated with probability $\frac{1}{n!}$. We will do the following.

```cpp
std::vector<int> p(n);
for (int i = 0; i < n; i++) p[i] = i;
for (int i = 0; i < n; i++) {
    std::swap(p[i], p[next(i, n-1)]);
}
return p;
```

> **Algorithm 1: Fisher-Yates' algorithm.**

Here, `next(left, right)` is a function that returns a uniformly random integer in the range $[\text{left}, \text{right}]$. Let's prove that the resulting permutation is uniform.

**Theorem 1**: Algorithm 1 creates a uniformly random permutation of length $n$.

**Proof**: Fix an arbitrary permutation $\pi$ of ${0, 1, \dots, n-1}$. We will compute the probability that Algorithm 1 outputs exactly $\pi$.

Observe that after iteration $i$, the value stored at position $i$ will never move again, since all future swaps only involve positions greater than or equal to $i+1$.

Therefore, for the final permutation to be equal to $\pi$ at iteration $i$, the algorithm must place $\pi_i$ at position $i$.

Suppose that iterations $0, 1, \dots, i-1$ have already placed the correct values. At the beginning of iteration $i$, the positions $i, i+1, \dots, n-1$ contain exactly the values $\pi_i, \pi_{i+1}, \dots, \pi_{n-1}$ in some order. Hence, among the indices $i, i+1, \dots, n-1$, there is exactly one index whose value is $\pi_i$.

The algorithm chooses an index $j$ uniformly at random from the range $[i, n-1]$. Since there are $n-i$ possible choices for $j$, exactly one of which places $\pi_i$ at position $i$, conditioned on all previous iterations placing the correct values, the probability that iteration $i$ places the correct value is $\frac{1}{n-i}$.

Therefore, by multiplying these conditional probabilities, the probability that every iteration places the correct value is

$$
\prod\limits_{i=0}^{n-1} \frac{1}{n-i} = \frac{1}{n!}.
$$

Thus, the probability that Algorithm 1 outputs the permutation $\pi$ is $\frac{1}{n!}$. Since this holds for every permutation $\pi$, the output distribution is uniform.

$$
\square
$$

Note that this can shuffle any list, not just the identity permutation.

To solve problem (2) using this idea, we would like to create an identity array of length $n$, shuffle it uniformly at random and then return the first $k$ elements of that permutation. Since after shuffling every permutation is equally likely, then every distinct prefix of length $k$ is also equally likely, with probability $(n-k)! \cdot \frac{1}{n!} = \frac{(n-k)!}{n!}$.

We can also check that each **set** of $k$ numbers is represented exactly $k!$ times, so each subset of size $k$ of $[0, n)$ is chosen with probability

$$
k! \cdot \frac{(n-k)!}{n!} = \frac{1}{\binom{n}{k}},
$$

so we can just sort the chosen list to get a uniformly random **subset** of $k$ numbers in $[0, n)$.

However, the problem is that $n$ might be large, so we cannot explicitly create the permutation. But we only need to run the algorithm for $k$ iterations, since other iterations won't affect the first $k$ elements of the shuffled permutation. So we can just run $k$ iterations and use a map as the permutation (and if some element is not present, we initialize it with $p[i] = i$; some sort of lazy initialization).

```cpp
std::map<int, int> p;
std::vector<int> ret(k);
for (int i = 0; i < k; i++) {
    int j = next(i, n-1);
    int p_i = p.count(i) ? p[i] : i;
    int p_j = p.count(j) ? p[j] : j;
    p[i] = p_j;
    p[j] = p_i;

    ret[i] = p[i];
}
return ret;
```

> **Algorithm 2: random $k$ values in $[0, n)$ by Fisher-Yates.**

Algorithm 2 clearly runs in $\mathcal O(k \log k)$ time, and its output is uniformly random.
