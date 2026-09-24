---
title: "Displaying Decimals"
contest: "ICPC Latin America Championship"
year: 2025
letter: "D"
authors: ["Bruno Monteiro"]
sourceUrl: "https://maratona.sbc.org.br/hist/2025/latam-2025/contest.pdf"
summary: "Average the exact finite/repeating decimal display length over all currency pairs."
---
## Statement

After the BRICS group introduced the International Common Payment Currency (ICPC), all currencies (like real, peso, dollar, etc.) are now defined by their values in ICPCs.

To help people navigate this new world order, you decided to create a website to compute conversion rates between currencies. The website handles $N$ currencies, numbered from 1 to $N$. Each currency $i$ has an associated integer value $A_i$, indicating that one unit of currency $i$ is worth $A_i$ ICPCs.

The user selects a source currency $i$ and then a target currency $j$ (possibly $j=i$), and the website displays the conversion rate between them: the exact decimal representation of $A_i/A_j$.

To deal with repeating decimals, you display only the first period, represented by a line above it when one exists. Thus $4/4=1$ requires 1 digit, $4/3=1.\overline3$ requires 2 digits, $41/4=10.25$ requires 4 digits, and $3/14=0.2\overline{142857}$ requires 8 digits.

Your website has been running successfully for quite some time. As part of your performance analytics, you want to compute the expected display size of conversion-rate pages.

Given $A_1,A_2,\ldots,A_N$, compute the expected number of digits needed to display $A_i/A_j$ when $i$ and $j$ are chosen independently and uniformly at random from $1$ through $N$.

### Input

The first line contains $N$ ($1\le N\le10^5$), the number of currencies. The second contains $A_1,A_2,\ldots,A_N$ ($1\le A_i\le10^5$), where $A_i$ is the value of one unit of currency $i$ in ICPCs.

### Output

The expected digit count can be expressed as an irreducible fraction $P/Q$, where $Q$ and $M=998244353$ are coprime. Let $Q^{-1}$ be the modular inverse of $Q$ modulo $M$. Output $P\cdot Q^{-1}\bmod M$.

### Example

```text
Input
3
15 36 14

Output
332748121
```

The digit counts for every row/column pair are:

| | 15 | 36 | 14 |
|---|---:|---:|---:|
| **15** | 1 | 4 | 8 |
| **36** | 2 | 1 | 7 |
| **14** | 3 | 3 | 1 |

Each has probability $1/9$. For example, $14/36=0.3\overline8$ requires 3 digits. The expectation is $30/9=10/3$. Since $3^{-1}=332748118$, the answer is $10\cdot332748118\bmod998244353=332748121$.

## Tutorial

For positive integers $X$ and $Y$, let $F(X,Y)$ be the number of digits used by the exact decimal representation of $X/Y$, counting only the first copy of a repeating period. We need

$$\frac{1}{N^2}\sum_{i=1}^{N}\sum_{j=1}^{N}F(A_i,A_j).$$

Split the digit count into

$$F(X,Y)=I(X,Y)+D(X,Y),$$

where $I$ is the number of digits before the decimal point and $D$ is the number after it.

### Computing the fractional length

First reduce the fraction. If $\gcd(X,Y)=1$, multiplication by the nonzero numerator only permutes the remainders in long division, so

$$D(X,Y)=D(1,Y).$$

Write

$$Y=2^a5^bq,\qquad \gcd(q,10)=1.$$

Only the factors 2 and 5 contribute to the non-repeating prefix. Its length is $\max(a,b)$. After removing those factors, the repeating part has length equal to the multiplicative order of 10 modulo $q$:

$$
D(1,Y)=\max(a,b)+
\begin{cases}
0,&q=1,\\
\operatorname{ord}_q(10),&q>1.
\end{cases}
$$

The order is the smallest positive $k$ such that

$$10^k\equiv1\pmod q.$$

It divides $\varphi(q)$. Precompute $\varphi$ for every number up to $M=\max A_i$ with a sieve. For each $q$ coprime to 10, begin with $k=\varphi(q)$, factor $\varphi(q)$, and repeatedly divide $k$ by a prime $p$ whenever

$$10^{k/p}\equiv1\pmod q.$$

This computes every value $D(1,Y)$ in $O(M\log^2M)$ time and $O(M)$ memory.

### Grouping pairs by their gcd

For a pair $(X,Y)$, let $G=\gcd(X,Y)$ and write $X=Gx$, $Y=Gy$. Then $\gcd(x,y)=1$ and

$$D(X,Y)=D(x,y)=D(1,y).$$

We can therefore enumerate the possible gcd $G$. For each input value $U$ and each divisor $G\mid U$, insert the normalized value $U/G$ into a list $L_G$. With frequencies, insert its multiplicity rather than making repeated copies.

For example, if the values are $[4,6,8,10]$, the nonempty lists begin as follows:

| $G$ | $L_G$ |
|---:|:---|
| 1 | 4, 6, 8, 10 |
| 2 | 2, 3, 4, 5 |
| 3 | 2 |
| 4 | 1, 2 |
| 5 | 2 |
| 6 | 1 |
| 8 | 1 |
| 10 | 1 |

Inside list $L_G$, a normalized numerator $x$ and denominator $y$ represent a pair whose gcd is **exactly** $G$ if and only if $\gcd(x,y)=1$.

To count values coprime to $y$, use Möbius inclusion–exclusion. Maintain a counter $c_d$ for every divisor $d$ of the currently active numerators. Then

$$\#\{x:\gcd(x,y)=1\}=\sum_{d\mid y}\mu(d)c_d.$$

Adding or removing a value $x$ means updating $c_d$ for every divisor $d\mid x$. Across all gcd lists, the divisor work is $O(M\log^2M)$.

### Adding the integer part

The integer part contains at most $\lfloor\log_{10}M\rfloor+1\le6$ digits. Handle each possible digit count $d$ separately.

For a fixed normalized denominator $y$, the numerator has $d\ge2$ integer digits precisely when

$$y\cdot10^{d-1}\le x<y\cdot10^d.$$

For $d=1$, also include $x<y$, because a proper fraction is displayed with the single integer digit `0`; equivalently, the range is $1\le x<10y$.

Within each sorted list $L_G$, these ranges move monotonically as $y$ increases. Use two pointers to add and remove normalized numerators from the Möbius counters. A query then gives the number of coprime numerators in the current range. Multiply that count, with the appropriate input frequencies, by

$$d+D(1,y),$$

and add it to the total.

There are only six passes over the lists, so this changes only the constant factor. The complete algorithm runs in

$$O(M\log^2M)$$

time and $O(M\log M)$ memory for the gcd lists. Finally, divide the accumulated ordered-pair sum by $N^2$ modulo $998244353$.

[Reference implementation](https://gist.github.com/brunomaletta/827aa1430e1ccd20272b11d60c2372b3)
