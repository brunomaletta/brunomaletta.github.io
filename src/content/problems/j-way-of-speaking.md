---
title: "Way of Speaking"
contest: "Maratona Mineira"
year: 2025
letter: "J"
authors: ["Kaio Vieira", "Bruno Monteiro", "Gabriel Ubiratan"]
summary: "Count parses of a run-length-like spoken number with a prescribed decoded length."
---
## Statement

> I feel your fury in your words, but I do not understand anything you say. — William Shakespeare

Bira traveled to the countryside of Minas Gerais and now needs to catch a train. When he arrives at the station, he asks an employee for the station number, to check whether he is at the right station.

However, the locals have a different custom: they say numbers in an encoded way! For example, to say the number `2020`, they could say `220` (two copies of the number `20`), and the number `205555` could be encoded as `12045` (one copy of the number `20`, followed by four copies of the number `5`).

Formally, a valid encoding of a number $X$ consists of a number $N$ whose digits can be partitioned into $2k$ parts ($k\ge1$), $P_1V_1P_2V_2\ldots P_kV_k$, such that $X$ is the concatenation of $P_1$ copies of $V_1$, followed by $P_2$ copies of $V_2$, and so on. In other words, some parts of the spoken number are periods (numbers of repetitions) and repeat the digits that follow them. A period $P_i$ may never begin with the digit `0`.

When Bira asked for the station number, the employee said the encoded number $N$. There may be many ways to decode it. The number `321`, for example, can be decoded as `212121` or as `11111111111111111111111111111111`. Bira does not remember his station's exact number, but he remembers that it had $M$ digits.

Given the number $N$ spoken by the employee, compute how many ways it can be decoded into a number with $M$ digits. Two ways are different if they have different numbers of parts or if any part differs.

### Input

The first line contains the number $N$ ($2\le|N|\le2000$), where $|N|$ is its number of digits. The first digit of $N$ is not `0`.

The second line contains $M$ ($1\le M\le2000$).

### Output

Print the number of ways to decode $N$ into $M$ digits, modulo $998244353$.

### Examples

```text
Input
23225
6

Output
2
```

There are two ways to decode `23225` into 6 digits: `323255` and `332525`.

```text
Input
321
3

Output
0
```

```text
Input
10
1

Output
1
```

```text
Input
2001
6

Output
1
```

The only decoding of `2001` is `001001`. Notice that the decoded number may contain leading zeros.

```text
Input
111111
4

Output
3
```

There are three ways, all producing `1111`: `[1](1)[1](111)`, `[1](11)[1](11)`, and `[1](111)[1](1)`, where brackets delimit periods and parentheses delimit repeated parts.

```text
Input
16956758163750637
114

Output
41
```

## Tutorial

A valid encoding has a local substructure: after choosing $P_1,V_1$ whose decoding contributes $M'$ digits, the remaining suffix must decode to $M-M'$ digits. Use DP states `(position in N, remaining decoded length)`.

Trying every split naively costs $O(|N|^2M)$. For a tested period value $X$, the relevant transitions number $O(M/X)$. Split at $B=\lceil\sqrt M\rceil$: process $X>B$ directly, while accumulating all transitions for $X\le B$ in auxiliary tables indexed by the short period and target length. Prefix sums make each table update constant time.

This is the translated official approach. Its complexity is $O(|N|M\sqrt M)$.
