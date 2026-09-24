---
title: "Genes"
contest: "ICPC Latin America Subregionals"
year: 2026
letter: "G"
summary: "Find the highest-priority dictionary pattern contained in each queried text interval."
---
## Statement

A DNA sequence is represented by a string $T$. Several genes are also known, represented by strings and ordered from most relevant to least relevant. The genes are numbered sequentially, starting from 1.

$Q$ queries are made. Each delimits a segment of $T$ between indices $L_i$ and $R_i$, inclusive. For each query, determine the index of the most relevant gene that occurs entirely as a substring of that segment.

### Input

The first line contains $T$ ($1\le|T|\le10^5$). The second line contains the number $G$ of genes ($1\le G\le5\cdot10^5$). Each of the following $G$ lines contains one gene, from most to least relevant. Every gene is nonempty. The genes are distinct, and the sum $S$ of their lengths is at most $5\cdot10^5$.

The next line contains $Q$ ($1\le Q\le10^5$). Each of the following $Q$ lines contains $L_i,R_i$ ($1\le L_i\le R_i\le|T|$), the inclusive query bounds.

All strings contain only the letters `A`, `C`, `G`, and `T`.

### Output

For each query, print the index of the most relevant gene that occurs entirely within the corresponding segment. If none occurs, print $-1$.

### Examples

```text
Input
ACAGACA
3
ACA
G
CA
3
1 7
2 6
1 2

Output
1
2
-1
```

In the first query, the segment is the entire sequence `ACAGACA`; its most relevant gene is `ACA` (index 1). In the second, the segment is `CAGAC`; its most relevant gene is `G` (index 2). In the third, the segment is `AC`, which contains no gene.

```text
Input
ACGT
2
ACGT
GT
2
1 3
2 4

Output
-1
2
```

## Tutorial

We use Aho–Corasick to enumerate every occurrence of every gene in $T$.

### Bounding the number of matches

**Lemma.** The total number of gene occurrences in $T$ is $O(|T|\sqrt S)$, where $S$ is the sum of the gene lengths.

Consider all genes whose occurrences end at one fixed position of $T$. Since the genes are distinct, two of them cannot have the same length: the substring with a given length and ending position is unique. If there are $k$ such genes, their lengths are at least $1,2,\ldots,k$. Therefore

$$1+2+\cdots+k \le S.$$

Since this sum is $\Theta(k^2)$, we have $k=O(\sqrt S)$. Applying this bound at every text position proves the lemma.

### Processing queries offline

Group each query $[l,r]$ by its right endpoint $r$, then scan $T$ from left to right with the Aho–Corasick automaton.

Suppose position $r$ has just been processed. For every gene occurrence ending there, let $p$ be its starting position and $g$ its gene index. At position $p$, store the minimum index of any occurrence seen so far that starts there.

All stored occurrences already end at or before $r$. Consequently, the answer to query $[l,r]$ is simply the minimum stored gene index over starting positions $p\ge l$. This condition guarantees that the entire occurrence is inside the query interval.

We need a data structure supporting:

1. `update(p, g)`: replace the value at position $p$ with its minimum with $g$;
2. `suffix_min(l)`: find the minimum value at positions $l,l+1,\ldots,|T|$.

### Square-root decomposition

Split the starting positions into blocks of size $B\approx\sqrt{|T|}$. Store both the individual value at every position and the minimum value of each block.

An update only decreases one individual value and its block minimum, so it takes $O(1)$. For a suffix query, inspect individual positions until reaching a block boundary, use the precomputed minimum for every complete block, and inspect the final partial block. This takes

$$O\left(\sqrt{|T|}+\frac{|T|}{\sqrt{|T|}}\right)=O(\sqrt{|T|}).$$

Aho–Corasick construction costs $O(S)$. Match enumeration performs $O(|T|\sqrt S)$ constant-time updates, and the $Q$ queries cost $O(Q\sqrt{|T|})$. The final complexity is

$$O\left(S+|T|\sqrt S+Q\sqrt{|T|}\right)$$

time and $O(S+|T|+Q)$ memory.

[Reference implementation](https://gist.github.com/brunomaletta/159dda5c4e517c97da8d5cf28e673dad)
