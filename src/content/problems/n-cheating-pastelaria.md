---
title: "Cheating in the Pastelaria"
contest: "Maratona Mineira"
year: 2023
letter: "N"
authors: ["Bernardo Amorim", "Bruno Monteiro"]
timeLimit: "1.5 seconds"
memoryLimit: "1024 MB"
summary: "Count opening moves on three obstacle boards that leave a losing impartial game."
---
## Statement

The Game has 3 rectangular boards, regularly divided into square positions. On each board there is a piece and obstacles. The piece is initially in the top left position. In one move, a player chooses one of the 3 boards and moves the piece a non-zero amount of spaces down or to the right such that it does not cross or stop on an obstacle. Two players play alternately and, on a player's turn, if there is no valid move to be made, that player loses.

You are going to play The Game against your friend. He's going to start, but right before that he's going to go to a Pastelaria to eat a pastel. You're obviously going to cheat (not that you're dishonest, you just enjoy giving your friend challenging matches). You will make up to one move on each board before he comes back (your friend is smart; if you make more than one move on a board he will notice).

![Pastel](/problems/mineira-2023/pastel.jpg)

In how many ways can you make up to one move on each board, such that when your friend comes back, he starts playing The Game, and if you both play optimally, you will win?

### Input

The input consists of the description of the three boards. Each board is represented by a line with dimensions $N$ and $M$ of the board ($1 \le N\times M \le 10^5$). Then there are $N$ lines, each with $M$ characters: the character `.` represents an empty position and `x` an obstacle. It is guaranteed that there will never be an obstacle in the top left position of a board.

### Output

A single integer: the number of ways to make up to one move on each of the three boards so that you win The Game.

### Examples

```text
Input
2 2
..
..
2 2
..
.x
2 2
.x
xx

Output
4
```

```text
Input
3 4
....
.x..
....
4 2
..
.x
..
x.
2 2
..
..

Output
18
```

### Note

In the first example, we can make one of two possible moves on the second board; that way, only the first board has possible moves, and we can see that the first player wins. Another possibility is to make one of the two moves on the first board. It can be proved that in the initial arrangement the second player wins.

## Tutorial

This is a disjoint sum of impartial games. Compute the Sprague–Grundy number of every reachable cell: it is the mex of the values visible to the right and below until an obstacle. Maintain those sets while scanning from bottom-right; transposing the board when useful gives linearithmic time in the board area.

For each board, count how many allowed preliminary choices lead to every Grundy value. The friend loses exactly when the xor of the three resulting values is zero. Therefore the answer is the xor convolution of the three frequency arrays evaluated at zero. Compute the two convolutions with the Walsh–Hadamard transform.

The Grundy values are bounded by $N+M$. With balanced ordered sets, preprocessing costs $O(A\log A)$ for total board area $A$, and the transforms cost $O(K\log K)$ for the next power of two $K$ above the value range.
