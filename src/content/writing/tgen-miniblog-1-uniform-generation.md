---
title: "tgen::miniblog(1): uniform generation implies distinct generation"
date: 2026-06-18
cfId: 154593
cfUrl: "https://codeforces.com/blog/entry/154593"
tags:
summary: "This is a blog 1 of a series of blogs about algorithmic challenges I came across when creating tgen."
---
<p class="figure"><img class="tgen-logo" src="/writing/tgen-logo-white.svg" alt="tgen" /></p>


*This is a blog 1 of a series of blogs about algorithmic challenges I came across when creating [tgen](https://codeforces.com/blog/entry/154468).*

In this blog we will tackle:

1.  Generate $k$ uniformly random distinct integers in the range $[\text{left}, \text{right}]$;
2.  Generate $k$ uniformly random distinct strings with $n$ characters in $[\texttt{a}, \texttt{z}]$.

Let's assume we have a function `next(left, right)`, which I will call the *inner* generation, that returns a uniformly random integer in the range $[\text{left}, \text{right}]$. A trivial algorithm is:

```cpp
std::vector<int> seq;
std::set<int> s;
while (s.size() < k) {
    int x = next(left, right);
    if (s.insert(x).second)
        seq.push_back(x);
}
return seq;
```

> **Algorithm 1: distinct generation.**

Surprisingly, this simple algorithm is both **uniform** and **fast**.

It is easy to see that this algorithm returns a uniform sequence of $k$ distinct integers in the range, that is, every sequence of $k$ distinct integers in the list is equally likely to be generated (the proof is left as an exercise).

However, bounding the time complexity is a little more involved. If $k$ is relatively small compared to the total number of elements, we can expect this to be fast. But there is actually a worst-case expected bound we can prove without that assumption.

**Theorem 1**: Algorithm 1 runs in $\mathcal O(T \cdot k \log k + k \log^2 k)$ expected time, if the inner generation is uniform and takes $\mathcal O(T)$ time.

**Proof**: Let $N$ be the total number of elements that can be generated (in our example, $N = \text{right} - \text{left} + 1$). Let's try to bound the number of iterations $L_i$ required for the $\texttt{while}$ loop when the set has $i$ elements ($0 \leq i \lt k$). On that moment, the probability of generating a new element is  
  

$$
p_i = \frac{N - i}{N},
$$

assuming our generation is uniform (out of $N$ possible values, $N - i$ yields a new one). Since draws are independent, we can calculate the expected value $\mathbb E[L_i]$ in the following way. We either succeed in the first try (1 iteration), with probability $p_i$, or we fail and need to repeat (1 extra iteration), with probability $1 - p_i$. So the expected value must satisfy:  
  

$$
\mathbb E[L_i] = 1 \cdot p_i + (1 + \mathbb E[L_i]) \cdot (1 - p_i).
$$

Solving for $\mathbb E[L_i]$, we get  
  

$$
\mathbb E[L_i] = \frac{1}{p_i} = \frac{N}{N - i}.
$$

Adding the expected cost for every $0 \leq i \lt k$, we get  
  

$$
\sum\limits_{i=0}^{k-1} \mathbb E[L_i] = \sum\limits_{i=0}^{k-1} \frac{N}{N - i} \leq \sum\limits_{i=0}^{k-1} \frac{k}{k - i}.
$$

This last inequality is implied from $k \leq N$. Finally,  
  

$$
\sum\limits_{i=0}^{k-1} \mathbb E[L_i] \leq \sum\limits_{i=0}^{k-1} \frac{k}{k - i} = k \sum\limits_{i=1}^{k} \frac{1}{i} \in \mathcal O(k \log k).
$$

This last identity is well known from the harmonic series. To finish off, each iteration of the $\texttt{while}$ loop has cost $\mathcal O(T + \log k)$, from generating plus the binary search tree. Multiplying by that, we get the final time complexity.

$$
\square
$$

What this means for us is: if we have **any** universe set $U$, as long as we have an algorithm to generate a **uniform** element from $U$ in $\mathcal O(T)$ time, we can easily create an algorithm that generates **distinct** elements from $U$, and each generated element will have **amortized** expected cost $\mathcal O(T \cdot \log k + \log^2 k)$, if $k$ distinct elements will be generated in total.

In other words, uniform generation implies distinct generation, with only a logarithmic factor overhead. Pretty cool, right?

Finally, we address problem (2). We can use the same strategy, and the inner generation will just be a for loop that chooses each character from $[\texttt{a}, \texttt{z}]$ independently. The **amortized expected** time complexity for generating **each** string will then be $\mathcal O(n \log k + \log^2 k)$.

### References

Coupon collector's problem: <https://en.wikipedia.org/wiki/Coupon_collector%27s_problem>
