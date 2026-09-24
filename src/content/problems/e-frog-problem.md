---
title: "Frog Problem"
contest: "Maratona Mineira"
year: 2023
letter: "E"
authors: ["Bruno Monteiro"]
timeLimit: "1 second"
memoryLimit: "1024 MB"
summary: "Construct a minimum-energy order for sinking a line of lily pads."
---
## Statement

A frog is in the swamp, in front of a river. On the river there are $N$ lily pads, arranged in a sequence, from left to right. The frog knows that when he jumps from lily pad $A$ to lily pad $B$, $A$ sinks forever in the river. In addition, from the $i$-th lily pad, the frog spends $x_i$ energy to jump to the left (regardless of the size of the jump), or $y_i$ to the right.

The frog will then, for fun, choose one of the lily pads, jump on it, and then jump to all the others before exiting the river, deciding each time to jump left or right. As he is afraid of falling into the river, with each jump he always jumps to the **nearest lily pad in the chosen direction that hasn't sunk yet**. The frog wants to sink all the lily pads this way, and then jump out of the river. If the frog's path ends at position $i$, the cost of jumping that last lily pad out of the river is the minimum between $x_i$ and $y_i$.

![Example representation.](/problems/mineira-2023/frog-example.png)

*Example representation. The energy spent is $2+3+5+3+1=14$.*

Help the frog figure out some lily pad sequence that minimizes the total energy expended.

### Input

The first line of the input contains an integer $1 \le N \le 10^5$, the number of lily pads in the lake. The next $N$ lines have two integers $1 \le x_i,y_i \le 10^9$, how much energy the frog spends to jump from the $i$-th lily pad to the left or right, respectively.

### Output

Print a sequence of indices that describes a sequence of hops that minimizes the total energy expended by the frog. If there are multiple solutions, print any one of them.

### Example

```text
Input
5
3 5
2 2
3 4
3 3
4 1

Output
2 3 1 4 5
```

## Tutorial

At every moment, the sunk pads form one interval: after starting at $s$, the only possible new pads are the neighbors immediately outside the visited interval. Thus an order is determined by repeatedly taking the left or right endpoint.

For any fixed start, it is optimal to leave the current pad toward the cheaper available side; if one side is exhausted, the other is forced. Let $L$ be the number of indices with $x_i<y_i$. An exchange argument shows that an optimal starting position is either $L$ or $L+1$ (after converting to 1-based indexing): moving the start past one pad changes precisely which preference must eventually be violated. Simulate both candidates, always choosing the cheaper available direction, include $\min(x_i,y_i)$ for the last exit, and output the cheaper order.

Each simulation is linear, so the total complexity is $O(N)$ time and $O(N)$ memory.
