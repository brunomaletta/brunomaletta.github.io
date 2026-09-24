---
title: "Sea of Hills"
contest: "Maratona Mineira"
year: 2025
letter: "M"
authors: ["Bruno Monteiro", "Roberto Sales", "Bernardo Amorim"]
summary: "Find the minimum travel days under a moving altitude window."
---
## Statement

> I'm feeling sick, I'm feeling sick!

Minas Gerais is a state with many hills (or, as many people say, a *sea of hills*). Fernanda wants to travel through Minas Gerais, but she always has problems with altitude and may feel sick from the lack of oxygen. The state can be described by $N$ cities connected by $M$ roads that can be traveled in both directions. City $i$ has altitude $h_i$ meters. Fernanda starts in city 1 and wants to reach city $N$.

Acclimatization works as follows: the body adapts to an altitude after sleeping in a city. More specifically, after sleeping in city $i$, whose altitude is $h_i$, on the following day Fernanda may visit only cities whose altitudes lie in $[h_i,h_i+H]$, where $H$ is fixed. She may visit several cities on the same day.

Under this restriction, find the minimum number of days Fernanda needs to reach city $N$, or print $-1$ if it is impossible.

### Input

The first line contains three integers $N,M,H$ ($2\le N\le10^5$, $1\le M\le10^5$, $1\le H\le10^9$). The second line contains $N$ integers; the $i$-th is $h_i$ ($1\le h_i\le10^9$). The next $M$ lines describe the roads. The $i$-th contains $a_i,b_i$ ($1\le a_i,b_i\le N$, $a_i\ne b_i$), representing a road between those cities.

No pair of cities is connected more than once, and there are no self-loops.

### Output

Print the minimum number of days required to leave city 1 and reach city $N$, or $-1$ if it is impossible.

### Examples

```text
Input
8 10 4
1 6 6 7 3 3 5 8
1 4
1 6
2 5
6 4
4 2
4 5
7 5
1 8
5 8
7 8

Output
3
```

Fernanda can make the following moves on each day:

1. $1\to6$;
2. $6\to4\to5\to7$;
3. $7\to8$.

```text
Input
2 1 1
1 1
1 2

Output
1
```

Here Fernanda can go directly on the first day.

```text
Input
3 2 3
1 2 8
1 2
2 3

Output
-1
```

## Tutorial

Let $dp[v]$ be the minimum number of days needed to reach $N$ when waking in $v$, with $dp[N]=0$. To compute it, activate exactly the vertices whose altitudes lie in $[h_v,h_v+H]$; the next sleeping city may be anywhere in $v$'s active connected component, so $dp[v]=1+\min_{u\in C(v)}dp[u]$.

Process vertices in decreasing altitude. The active window changes by two pointers, producing only linearly many edge insertions and deletions. Generate these operations offline and answer component-minimum queries with a rollback DSU over a segment tree of time.

When $dp[v]$ becomes known, attach a fresh auxiliary vertex carrying that value to $v$; this turns a value update into an insertion and preserves component minima. Complexity is $O((N+M)\log^2N)$. A more involved solution achieves $O((N+M)\log N)$.
