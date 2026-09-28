---
title: "tgen::miniblog(6): random non-collinear points"
date: 2026-09-28
cfId: 157202
cfUrl: "https://codeforces.com/blog/entry/157202"
tags:
summary: "This is a blog 6 of a series of blogs about algorithmic challenges I came across when creating tgen."
---
<p class="figure"><img class="tgen-logo" src="/writing/154468-1.png" alt="tgen" /></p>


*This is blog 6 of a series of blogs about algorithmic challenges I came across when creating [tgen](https://codeforces.com/blog/entry/154468).*

In this blog we will tackle:

1. Generate $n$ random distinct integer points in an $O(n) \times O(n)$ box, with no three collinear, in $\mathcal O(n)$ time.

We call such set of points (all distinct, with no three collinear) to be in **general position**. This is useful when testing geometry problems. Our construction has no uniformity guarantee: we do not sample uniformly from all general-position point sets in the box. Our goal is only for the points to *look* random, in the sense that they have no obvious geometric pattern. Picking random grid points and rejecting a point whenever it forms a line with two previous points is expensive: there are already $\Theta(k^2)$ forbidden lines after choosing $k$ points. We would rather have a construction where general position is guaranteed.

### The parabola almost works

Consider the construction

$$
P_x = (x, x^2), \qquad x = 0, 1, \ldots, n-1.
$$

**Lemma 1:** The points $P_0,P_1,\ldots,P_{n-1}$ are in general position.

**Proof:** A nonvertical line $y=ax+b$ intersects the parabola $y=x^2$ where

$$
x^2-ax-b=0.
$$

This is a quadratic equation, so it has at most two roots. A vertical line intersects the parabola at most once. Therefore no line contains three of the points.

$\square$

The problem is the coordinate range: the second coordinate grows to $\Theta(n^2)$. We want the same quadratic-root argument while keeping both coordinates in a range of size $\mathcal O(n)$.

### A hyperbola over a finite field

Let $p$ be a prime and work in the finite field $\mathbb F_p$. Consider

$$
H = \{(x, x^{-1}) : x \in \mathbb F_p \setminus \{0\}\}.
$$

There are $p-1$ points, and both coordinates are residues in $[0,p)$. More importantly, no line contains three of them.

**Lemma 2:** No three points of $H$ are collinear over $\mathbb F_p$.

**Proof:** Write a line as

$$
ax + by + c = 0,
$$

where $a,b,c$ are not all zero. At a point of $H$, $y=x^{-1}$ and $x \ne 0$. Multiplying the line equation by $x$ gives

$$
ax^2 + cx + b = 0.
$$

This is a nonzero polynomial of degree at most two, so it has at most two roots in a field. Hence the line meets $H$ in at most two points.

$\square$

We can now choose the first prime $p \ge 2n$, shuffle the residues $1,\ldots,p-1$, keep the first $n$ values $x_1,\ldots,x_n$, and take $(x_i,x_i^{-1})$. Only $p>n$ is required to have enough nonzero residues; starting from $2n$ gives us a larger pool to sample from while keeping $p=\mathcal O(n)$.

Using a prime modulus is important because $\mathbb F_p$ is a field: every nonzero $x$ has an inverse, and a nonzero polynomial of degree two has at most two roots. Both facts are used in Lemma 2 and might not hold modulo a composite number.

<p class="figure"><img class="diagram" src="/writing/157202-2.png" alt="The first 500 modular-hyperbola points before randomization" /></p>

*The first $500$ points $(x,x^{-1})$ modulo $1009$. The construction is correct, but the points only occupy the left half of the box and the algebraic pattern is visible.*

### Randomizing the shape

The raw construction visibly lies on the modular hyperbola, so we can randomize its appearance with invertible linear maps over $\mathbb F_p$. We compose a constant number of random shears of the two forms

$$
\begin{pmatrix}1&r\\0&1\end{pmatrix}
\qquad\text{and}\qquad
\begin{pmatrix}1&0\\r&1\end{pmatrix},
\qquad r \in \{-2,-1,1,2\}.
$$

Each shear is reversible: its inverse is the same shear with $r$ replaced by $-r$. Shears also map lines to lines. Therefore, if three transformed points were collinear, applying the inverse shears would show that the three original points were collinear as well. By Lemma 2 this is impossible, so any composition of these shears preserves general position.

All arithmetic here is modulo $p$; after each shear, we represent each coordinate by an integer in $[0,p)$.

**Theorem 1:** The construction returns $n$ distinct integer points in $[0,p)^2$, with no three collinear.

**Proof:** The base points are distinct because their first coordinates are distinct. By Lemma 2, every triple has nonzero orientation determinant over $\mathbb F_p$. Every shear is invertible, so the determinant of every triple remains nonzero modulo $p$; in particular, distinct points remain distinct.

$\square$

### Coordinate range and complexity

By Bertrand's postulate, the smallest prime $p \ge 2n$ satisfies $p < 4n$. Therefore the required side length $p-1$ is $\mathcal O(n)$.

There are $p-1=\mathcal O(n)$ candidate residues. Shuffling them, computing $n$ modular inverses, and applying a constant number of shears take $\mathcal O(n)$ time in total. The construction uses $\mathcal O(n)$ memory.

The result is not uniform among all general-position subsets of the box. The random subset and shears are there to provide varied test cases while retaining a deterministic correctness guarantee.

<p class="figure"><img class="diagram" src="/writing/157202-3.png" alt="The modular-hyperbola points after random invertible shears" /></p>

*The same $500$ points after eight random invertible shears. They now fill the box much more evenly, while the proof that no three are collinear is unchanged.*

> **Warning:** The shears hide the visual pattern, but not the algebraic one: modulo $p$, all output points still lie on a single conic (an affine image of $xy=1$). Combine this generator with other test families if that structure could make the tested problem easier.

### References

Bertrand's postulate: <https://en.wikipedia.org/wiki/Bertrand%27s_postulate>
