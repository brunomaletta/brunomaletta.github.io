---
title: "Couple of BipBop"
contest: "Maratona SBC — First Phase"
year: 2024
letter: "C"
sourceUrl: "https://maratona.sbc.org.br/hist/2024/primfase24/contest-pf2024/maratona_en.pdf"
summary: "Compute the expected common-prefix length of two random choreography suffixes."
---
## Statement

It's time for Bob and Charlie to go on a new couple-hyperfocus: BipBop trends. This social network specialized in short videos is going viral more than ever before. As a consequence, couples now measure how much they love each other in terms of how well they can dance together. In theory, the BipBop dancing style is simple and can be used to perform pretty much every song existent. Usually, it consists in a sequence of moves, one for each verse, represented by an integer number, as the moves are kinda generic, really.

Always late, the couple just got to a party. The song is already playing, but they still want to impress and show that they can dance BipBop even without knowing what verse the song is currently at. Each of them starts dancing at a random verse and keeps following the choreography until one reaches the end of the song or their moves do not match (they execute different moves).

There is no popular song that Bob and Charlie do not know how to dance. Given a song represented as a sequence of movements, one for each verse, calculate the expected number of verses they will dance in sync if each initially thinks the song is playing at a uniformly random verse.

### Input

The first line contains an integer $N$ ($1\le N\le10^5$), the number of verses in the song. The second line contains $N$ integers $V_1,V_2,\ldots,V_N$ ($1\le V_i\le N$), the movement associated with each verse.

### Output

Output the expected number of verses the couple will dance in sync if each chooses a starting verse uniformly at random. Output the answer as an irreducible fraction $P/Q$, such that $\gcd(P,Q)=1$.

### Examples

```text
Input
2
1 1

Output
5/4
```

There are four equally likely choices. If both start at the first verse, they dance 2 verses in sync. In the other three cases they dance only one, so the expectation is $2/4+1/4+1/4+1/4=5/4$.

```text
Input
4
1 1 1 1

Output
15/8
```

```text
Input
7
1 2 1 3 1 2 1

Output
48/49
```

## Tutorial

For starting positions $i$ and $j$, the number of synchronized moves is exactly the longest common prefix of the suffixes $V[i..N]$ and $V[j..N]$. Hence the numerator of the expectation is

$$\sum_{i=1}^{N}\sum_{j=1}^{N}\operatorname{LCP}(i,j),$$

and the denominator is $N^2$.

### Suffix array and adjacent LCPs

Build the suffix array `sa` of the movement sequence and its adjacent LCP array, where

$$\text{lcp}[k]=\operatorname{LCP}(V[\text{sa}[k]..],V[\text{sa}[k+1]..]).$$

For suffix-array positions $l<r$,

$$
\operatorname{LCP}(\text{sa}[l],\text{sa}[r])=
\min_{l\le k<r}\text{lcp}[k].
$$

The equal-position pairs are immediate: suffix $i$ has length $N-i+1$, so the diagonal contribution is

$$1+2+\cdots+N=\frac{N(N+1)}2.$$

It remains to sum range minima over every pair of distinct suffix-array positions.

### Summing every pair

Build an RMQ structure over `lcp`. Consider an interval of suffix-array positions $[l,r]$, and let $m$ be the position of the minimum value in `lcp[l..r-1]`.

Every pair with one suffix in $[l,m]$ and the other in $[m+1,r]$ has LCP exactly `lcp[m]`. There are

$$(m-l+1)(r-m)$$

such unordered pairs. Their ordered-pair contribution is therefore

$$2(m-l+1)(r-m)\cdot\text{lcp}[m].$$

Then recurse on $[l,m]$ and $[m+1,r]$. Every unordered pair is counted at the unique split separating its endpoints. This recursion is equivalent to building the Cartesian tree of the LCP array; a monotonic-stack sum of subarray minima gives the same result.

Add the diagonal contribution, divide by $N^2$, and reduce the fraction by the gcd.

A doubling suffix array gives $O(N\log N)$ time. Kasai's algorithm, RMQ construction, and the divide-and-conquer sum are $O(N)$. Linear-time suffix-array implementations make the entire solution $O(N)$. Memory usage is $O(N)$.
