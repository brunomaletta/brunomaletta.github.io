---
title: "Contorno Avenue"
contest: "Maratona Mineira"
year: 2023
letter: "B"
authors: ["Bruno Monteiro"]
timeLimit: "1 second"
memoryLimit: "1024 MB"
summary: "Draw all same-type connections on either side of a circular avenue without crossings."
---
## Statement

Avenida do Contorno is a circular avenue in Belo Horizonte. During its construction, several establishments were installed along it, such as several drugstores (Araújo), several pastry shops (Rei do Pastel), etc. For logistical reasons, every pair of establishments of the same type must be directly connected by a street (which can pass inside or outside Contorno).

However, for Contorno to remain the main avenue, there cannot be corners elsewhere in the city (street crossings). In addition, there will be no tunnels or overpasses in the city.

Given the types of establishments that exist in order along the Contorno, your task is to determine if it is possible to build the streets connecting every pair of establishments of the same type, without creating extra corners (street crossings).

![Possible configuration for the first example.](/problems/mineira-2023/contorno-avenue.png)

*Possible configuration for the first example.*

### Input

The first line contains an integer $1 \le N \le 10^3$. The second line contains $N$ integers $1 \le c_i \le N$, where $c_i$ represents the type of the $i$-th establishment in order in Contorno.

### Output

Print `S` if it is possible to build the roads, and `N` otherwise.

### Examples

```text
Input
5
1 2 1 2 1

Output
S
```

```text
Input
9
1 4 1 1 4 1 4 4 3

Output
N
```

## Tutorial

Represent every required street by a chord joining its two endpoints. Two chords whose endpoints alternate around the circle must lie on opposite sides of the avenue; every other pair imposes no constraint. Build a *crossing graph*: one vertex per required street and one edge per alternating pair. Choosing inside or outside is exactly a 2-coloring of this graph, so the answer is `S` if and only if it is bipartite.

A type appearing at least five times requires a drawing of $K_5$, which is impossible. After rejecting those cases, every type contributes at most $\binom 4 2=6$ streets, so there are only $O(N)$ chord vertices. Test all chord pairs in $O(N^2)$ and run DFS or BFS bipartite coloring in the same bound.
