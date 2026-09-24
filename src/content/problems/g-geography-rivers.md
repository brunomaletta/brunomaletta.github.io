---
title: "Geography of Rivers"
contest: "Maratona SBC — First Phase"
year: 2024
letter: "G"
sourceUrl: "https://maratona.sbc.org.br/hist/2024/primfase24/contest-pf2024/maratona_en.pdf"
summary: "Maintain the winning source name in a binary merge tree under rainfall updates."
---
## Statement

When studying the geography of the world's rivers, you may ask yourself: when two rivers join together, who chooses the name of the river that results from this junction? In fact, the answer is simple: when two rivers join, the name of the river that had the largest volume of water becomes the name. Given that all rivers eventually join together and flow into the sea, an interesting problem is to calculate, given the name of each source, the name of the final river that flows into the sea.

Formally, $N$ river sources are given. For each source, you have a quantity of liters of water $l_i$ that originates from it. Furthermore, pairs of rivers meet (like a binary tree) until they all join and flow into the sea. When two rivers meet, their quantities of water are added, and the name becomes the name of the river that had more water or, in case of a tie, the one with the lowest index. The initial name of each source is its index.

You want to know the name of the river that eventually flows into the sea. However, it is rainy season! You must process $Q$ operations. In each, rain causes $q_i$ additional liters of water to be produced at source $n_i$, and this change remains for future operations. After each operation, calculate the name of the river that flows into the sea.

### Input

The first line contains $N$ ($1\le N\le10^5$), the number of river sources.

The second line contains $N$ integers $l_i$ ($1\le l_i\le10^9$), the liters of water originating at source $i$.

The following $N-1$ lines describe how rivers join. In the $i$-th, two integers $a_i,b_i$ ($1\le a_i,b_i<N+i$) indicate that rivers $a_i$ and $b_i$ form river $N+i$. It is guaranteed that $a_i\ne b_i$ and neither river has been joined previously.

The next line contains $Q$ ($1\le Q\le10^5$). Each of the following $Q$ lines contains $n_i,q_i$ ($1\le n_i\le N$, $1\le q_i\le10^9$), meaning that source $n_i$ now produces $q_i$ additional liters.

### Output

Print, on the first line, the name of the river that initially flows into the sea. Then print $Q$ lines, one with the name after each operation.

### Example

```text
Input
3
1 4 4
1 2
4 3
2
3 2
1 2

Output
2
3
2
```

## Tutorial

The merge history is a rooted binary tree: the original sources are leaves, each junction is an internal node, and river $2N-1$ is the root. The water at a node is the sum of all leaf values in its subtree.

At every internal node, call the child selected by the naming rule its **preferred child**; the other edge is **light**. Starting at the root and repeatedly following preferred children ends at the source whose name reaches the sea.

A rain operation adds water to one leaf and therefore to every node on its root path. We must update the preferred edges affected by this change and recover the leaf reached from the root.

### Why preferred paths are short to traverse

Preferred edges form vertex-disjoint downward paths. Whenever a root-to-leaf route crosses a light edge, the chosen light child's water is at most half of its parent's total water, because its sibling was preferred. Thus a route crosses only logarithmically many light edges. We can process an update path one preferred-path segment at a time.

### Euler tour and subtree sums

Give every node entry and exit times in a DFS Euler tour. Place each source's water at its entry time. The water of node $v$ is then the range sum

$$W(v)=\sum_{t=\operatorname{tin}(v)}^{\operatorname{tout}(v)}\text{water}[t].$$

A sum segment tree supports both a rain update at one leaf and the comparison of the two children of any junction in $O(\log N)$.

### Finding the next light edge

For every light child $v$, store $\operatorname{tout}(v)$ at position $\operatorname{tin}(v)$; store zero for preferred children. A max segment tree over this array can find the rightmost marked interval that contains a given Euler position. This is exactly the nearest light-edge head above that vertex.

During an update at source $s$:

1. Add the new water at $\operatorname{tin}(s)$.
2. Find the head of the current preferred path containing $s$.
3. At the head's parent, compare the two child-subtree sums.
4. If the formerly light child has become preferred, swap which child is marked light and update the stored winning leaf for the affected preferred paths.
5. Jump to the next preferred-path head above the parent and repeat until reaching the root.

Ties use the problem's rule: choose the child river with the smaller index. The winning leaf stored for the preferred path containing the root is the name to print.

There are logarithmically many preferred-path segments per update, and every segment-tree operation costs $O(\log N)$. Thus preprocessing takes $O(N\log N)$ and each rainfall update takes $O(\log^2N)$ time, with $O(N)$ memory.
