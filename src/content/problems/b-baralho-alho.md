---
title: "Baralho Alho"
contest: "Maratona SBC — Subregional"
year: 2025
letter: "B"
sourceUrl: "https://maratona.sbc.org.br/hist/2025/subbr-2025/maratona_en.pdf"
summary: "Solve simultaneous rotation constraints induced by repeated permutation shuffles."
---
## Statement

Researcher Isadora loves playing cards with her friends. More specifically, she plays a version called Baralho Alho, in which there are $N$ cards (duplicates are allowed). Initially, the $N$ cards are in a specific order: the $i$-th card has value $A_i$. Two cards are considered equal if they have the same value.

Before the game starts, Isadora declares: “I always shuffle Baralho Alho.” Naively, her friends agree and let her command the shuffling. Little do they know that Researcher Isadora loves to cheat. Her goal is to shuffle in such a way that, at the end, the $i$-th card has value $B_i$.

However, she knows only one kind of shuffle: it maps the card originally at position $i$ to position $P_i$. For example, if $P=[3,2,4,1]$, the first card goes to the third position, the second remains in place, the third goes to the fourth, and the fourth goes to the first. Thus, if the initial deck is $[4,2,6,1]$, applying the shuffle produces $[1,2,4,6]$.

![Example of the shuffle.](/problems/sbc-2025/baralho-alho-shuffle.svg)

Even with this limitation, Isadora is quite intelligent and plans to repeat the shuffle several times to reach new deck configurations.

Given $A_i$, $B_i$, and $P_i$, determine the minimum number of times Isadora must apply the shuffle so that the deck reaches the desired order. If this is impossible, print `IMPOSSIVEL`. If the minimum number of shuffles is greater than $10^9$, print `DEMAIS`.

### Input

The first line contains $N$ ($1\le N\le10^6$). The second line contains $A_1,\ldots,A_N$ ($1\le A_i\le10^9$), the initial deck. The third contains $B_1,\ldots,B_N$ ($1\le B_i\le10^9$), the target deck. The fourth contains $N$ distinct integers $P_i$ ($1\le P_i\le N$), indicating that the card at position $i$ moves to position $P_i$.

### Output

Print the minimum number $k$ of shuffles needed. If it is impossible, print `IMPOSSIVEL`. If the minimum $k$ is greater than $10^9$, print `DEMAIS`.

### Examples

```text
Input
6
8 6 5 5 1 3
5 1 8 5 3 6
2 3 6 5 1 4

Output
2
```

The configurations are:

- $k=0$: `8 6 5 5 1 3`;
- $k=1$: `1 8 6 3 5 5`;
- $k=2$: `5 1 8 5 3 6`.

```text
Input
2
3 3
3 3
1 2

Output
0
```

The deck is already in the desired configuration.

```text
Input
5
6 3 8 4 2
3 6 4 2 8
2 1 4 5 3

Output
5
```

```text
Input
4
1 2 1 2
1 2 2 1
2 1 4 3

Output
IMPOSSIVEL
```

```text
Input
3
1 2 3
2 1 4
1 2 3

Output
IMPOSSIVEL
```

## Tutorial

**Required topics:** permutations, string matching, and the Chinese remainder theorem.

### Turning cycles into congruences

Decompose the permutation into cycles and handle each cycle independently. Applying the shuffle once rotates the values along every cycle by one position. Therefore, for each cycle, we need to find which rotations of its initial value sequence equal its target sequence.

Duplicate the initial sequence and search for the target sequence inside it with KMP, the Z-function, or another linear string-matching algorithm. If no rotation matches for any cycle, the answer is `IMPOSSIVEL`.

If a cycle admits shift $a_i$ and its value sequence has minimal period $m_i$, all its valid shifts are exactly

$$k\equiv a_i\pmod{m_i}.$$

We now have a system of congruences, one from each cycle, and need to combine them using the generalized Chinese remainder theorem. The complication is that their least common multiple can become enormous and overflow ordinary integer types. We should first decide whether the complete system is consistent, and only then merge congruences until the modulus becomes large enough.

### Checking whether a solution exists

There are two useful approaches.

#### Approach 1: pairwise compatibility

After merging congruences with the same modulus, there are only $O(\sqrt N)$ distinct moduli. This follows because the moduli do not exceed their corresponding cycle lengths, and the sum of all distinct cycle lengths is at most $N$.

Two congruences

$$k\equiv a_i\pmod{m_i},\qquad k\equiv a_j\pmod{m_j}$$

are compatible if and only if

$$a_i\equiv a_j\pmod{\gcd(m_i,m_j)}.$$

A system of congruences is solvable if and only if every pair is compatible. Thus, after deduplication, checking every pair takes $O(N)$ time in total. See the [pairwise solvability criterion](https://math.stackexchange.com/questions/1180796/crt-solvablity-criterion-congruence-system-solvable-iff-pairwise-solvable) for a proof.

#### Approach 2: split into prime powers

Factor each modulus into distinct prime-power factors:

$$m_i=p_{i,1}^{e_{i,1}}p_{i,2}^{e_{i,2}}\cdots p_{i,x_i}^{e_{i,x_i}}.$$

Because these factors are pairwise coprime, the congruence

$$k\equiv a_i\pmod{m_i}$$

is equivalent to the system

$$
k\equiv a_i\pmod{p_{i,1}^{e_{i,1}}},\quad\ldots,\quad
k\equiv a_i\pmod{p_{i,x_i}^{e_{i,x_i}}}.
$$

Do this for every original congruence, then group the resulting conditions by prime. For one fixed prime $p$, we obtain conditions of the form

$$
k\equiv b_0\pmod{p^{e_0}},\quad
k\equiv b_1\pmod{p^{e_1}},\quad\ldots
$$

First, equal powers must have equal residues. Conditions at different powers must also agree after reduction to the smaller power: for example, $k\equiv7\pmod{25}$ implies $k\equiv2\pmod5$, so it is incompatible with $k\equiv1\pmod5$.

If every prime group is internally consistent, keep only its condition with the largest exponent. The remaining moduli are pairwise coprime, so the Chinese remainder theorem guarantees that the complete system has a solution.

### Avoiding overflow and deciding `DEMAIS`

Once consistency is known, merge congruences one at a time with generalized CRT. Maintain the smallest nonnegative solution $x$ and the combined modulus $L$. All solutions processed so far are

$$x, x+L, x+2L,\ldots$$

Stop as soon as $L>10^9$. Test $x$ against **all** original congruences:

- if it satisfies all of them and $x\le10^9$, print $x$;
- otherwise, every other solution is at least $x+L>10^9$, so print `DEMAIS`.

The earlier consistency check is essential: without it, stopping early could incorrectly print `DEMAIS` for a system that is actually impossible.

Cycle decomposition and string matching take $O(N)$. With the pairwise compatibility approach, feasibility also takes $O(N)$ after deduplication; factoring for the prime-power approach can likewise be supported by a smallest-prime-factor sieve. The final capped CRT merge is linear in the number of distinct congruences.
