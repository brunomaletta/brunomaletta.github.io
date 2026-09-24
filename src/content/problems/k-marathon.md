---
title: "Marathon"
contest: "Maratona Mineira"
year: 2024
letter: "K"
authors: ["Bruno Monteiro"]
summary: "Cut a huge piecewise-valued route into disjoint races for maximum Kudos."
---
## Statement

According to a new study, about 8 out of every 10 runners are clinically deficient in Kudos—and, worse, most of them do not even know it.

![Common race distances.](/problems/mineira-2024/marathon-distances.jpeg)

Bruno is a runner who loves posting his activities on the social network Sbava, mainly to earn likes from his friends on the app, called Kudos. However, his recent activities have earned few Kudos, so he came up with a solution.

He recorded a car activity and will use it to post several runs, thereby earning Kudos. He will cut his activity into disjoint segments of 5 km, 10 km, 21 km, or 42 km, using only integer kilometer positions (he will not cut out a 5 km run that took place from kilometer 1.5 to 6.5 of the car activity, for example).

The car activity consists of $N$ segments, the $i$-th of which is $d_i$ kilometers long. Because each race distance has very different requirements and circumstances, each segment gives Bruno different benefits. These benefits are measured in Kudos per kilometer, and every race distance has its own rate in every segment. That is, in segment $i$, the integers $K_{5i}$, $K_{10i}$, $K_{21i}$, and $K_{42i}$ represent how many Kudos Bruno receives for each kilometer covered as part of a 5, 10, 21, or 42 km run, respectively.

Suppose, for example, that the car activity consists of two 50 km segments. In the first segment, each kilometer gives Bruno 1 Kudo if it is part of a 5, 10, or 21 km run, but 10 Kudos if it is part of a 42 km run. In the second segment, each kilometer gives 1 Kudo if it is part of a 5, 21, or 42 km run, and 2 Kudos if it is part of a 10 km run. Bruno would split the route into two 42 km runs followed by one 10 km run and one 5 km run, in that order, as illustrated below. The final kilometer of the car activity is unused and earns 0 Kudos.

![Representation of Sample 1.](/problems/mineira-2024/marathon-example.png)

*Representation of Sample 1. Bruno receives $42\cdot10+(8\cdot10+34\cdot1)+10\cdot2+5\cdot1=559$ Kudos.*

Help Bruno determine the maximum number of Kudos he can earn by cutting the car activity into runs optimally.

### Input

The first line contains an integer $N$ ($1\le N\le1000$), the number of segments in the car activity. The next $N$ lines describe the segments. The $i$-th line contains five integers $d_i,K_{5i},K_{10i},K_{21i},K_{42i}$ ($50\le d_i\le10^9$, $1\le K_{5i},K_{10i},K_{21i},K_{42i}\le10^6$): the segment length and the number of Kudos each kilometer in that segment gives when included in a 5, 10, 21, or 42 km activity, respectively.

### Output

Print one integer: the maximum number of Kudos Bruno can earn.

### Examples

```text
Input
2
50 1 1 1 10
50 1 2 1 1

Output
559
```

```text
Input
3
85 1 1 1 100
471 1 100 100 1
85 1 1 1 100

Output
63902
```

## Tutorial

A direct position DP is correct but the route may have length $10^{12}$. Inside one constant-rate segment, let $L$ be the race length with maximum rate. Far enough from both segment boundaries, replacing any block of $\operatorname{lcm}(5,10,21,42)=210$ km by copies of this best race cannot hurt.

Consequently only a bounded boundary zone matters. Keep $4\cdot210+2(42-1)=922$ kilometers of each segment; greedily fill the removed middle with the locally best race. Run the ordinary weighted interval DP on the shortened route, allowing a chosen race to cross into the next segment and summing the appropriate per-kilometer rates on both sides.

There are $O(922N)$ states and four transitions per state, hence $O(N)$ time with this constant and $O(N)$ memory.
