---
title: "Chinese Postman Problem: How I Ran a 180 km Ultramarathon Through Every Street in My City"
date: 2026-05-31
cfId: 154192
cfUrl: "https://codeforces.com/blog/entry/154192"
tags:
summary: "Hello, Codeforces!"
---
Hello, Codeforces!

A couple of years ago, a friend of mine told me that two cyclists had passed through every single street in the center region of the city I live in (Belo Horizonte, southeastern Brazil), on the [third try](https://www.strava.com/activities/1030665876/overview).

First try

After ~160 km, they had not completed 1/3 of the goal. [Strava link](https://www.strava.com/activities/976021527).

<p class="figure"><img src="/writing/154192-1.png" alt="" /></p>


Second try

They were better prepared, but one of the guys was run over by a car (no big injuries). [Strava link](https://www.strava.com/activities/999450285).

<p class="figure"><img src="/writing/154192-2.png" alt="" /></p>


<p class="figure"><img src="/writing/154192-3.png" alt="" /></p>


More info

Blog (brazilian portuguese): <https://flaviocro.blogspot.com/2018/08/teia-da-cotorno.html>  
Research paper (brazilian portuguese): <https://www.academia.edu/144778481/Teia_da_Contorno_pedaladas_cartogr%C3%A1ficas>

As a good computer scientist, I wondered what the **minimum** route that passes through every street was...

This is exactly the Chinese Postman Problem. In this blog, I will tell the tale of how I was able to run every single street in the center region of my city. To get to that, we will define Chinese Postman Problem and discuss an exact solution: the Edmonds-Johnson algorithm.

# Step one: creating the graph

## Issue 1: what is a street?

It is not trivial to define what a street is. I ended up going off "vibes", and decided the following arbitrary rules.

1.  If cars pass through it, then it is a street (as long as it is not just a parking space);
2.  If it connects two intersections, then it is a street;
3.  If there are two parallel streets that are too close to each other (such as sidewalks on different sides of a large street), then they are the same street;
4.  Streets that "close" (its access is not always open for the public, for instance, inside parks) are not streets.

After discussing with friends, our first thought to create the graph was to download it from a [Python library](https://osmnx.readthedocs.io/en/stable/) that downloads the map from [OpenStreetMap](https://wiki.openstreetmap.org/), a free map database. However, there were issues.

## Issue 2: cars vs pedestrians

When you download the map, you can set it as "car mode" or "pedestrian mode". I first tried pedestrian mode, but it included way too many paths that are not streets, such as parking lots, parks, and two sides of sidewalks for larger streets.  
  

<p class="figure"><img src="/writing/154192-4.jpeg" alt="" /></p>


This would be very hard to clean up. The car graph had similar problems. When you arrive at an intersection with a car, you can not turn to every street that arrives at that intersection. To model this, the map has several nodes at the same intersection, with very complicated directed structures.  
  

<p class="figure"><img src="/writing/154192-5.jpeg" alt="" /></p>


After trying a few things, the solution that best worked was not pretty. Using a [website](https://www.keene.edu/campus/maps/tool/), I was able to click on the map and generate a polyline with the coordinates of the points. After that, using a simple Python script I could merge close points into one and consider adjacent points in the polyline as my graph edges.  
  

<p class="figure"><img src="/writing/154192-6.jpeg" alt="" /></p> <p class="figure"><img src="/writing/154192-7.png" alt="" /></p> <p class="figure"><img src="/writing/154192-8.jpeg" alt="" /></p>


Anyway, at the end of the day I finally had the graph to work on.

# Step two: computing the minimum route

This is the algorithmic part of this post. Let's state the problem formally.

Given a weighted undirected graph $G$ with weights $w : E(G) \rightarrow \mathbb{R}^+$, we want to compute a [closed walk](https://en.wikipedia.org/wiki/Path_(graph_theory)) $W = e_1, e_2, \dots, e_k$ that contains (passes through) every edge in $E$. A **closed** walk means that it starts and ends at the same vertex. The reason to have it as a closed walk is that the solution becomes bit more simple.

We define the **cost** $c$ of the closed walk as the sum of the weights of the edges in the walk.  
  

$$
c = \sum_{i=1}^{k} w(e_i).
$$

Out of all such walks, we want to find that of minimum cost.

The first observation is that a solution exists if, and only if, the graph is connected (assuming there are no isolated vertices). From now on, we assume the graph is connected.

Ideally, we wish to go through every edge once. Let's discuss when it is possible to do so. If it is, we know the solution is optimum, because the sum of the weights of the edges is a lower bound for the minimum cost.  
  

$$
c \geq \sum_{e \in E} w(e).
$$

## Eulerian circuits

We call a graph **eulerian** if there is a walk that starts and ends at the same vertex and visits every edge exactly once.

If we want to pass through every edge exactly once, every time the walk enters a vertex, it needs to exit it. Therefore, we can only do so when the degree of every vertex is even (this includes the starting vertex, since we need to end the walk there). It turns out that this condition is sufficient.

**Lemma 1**: a graph is eulerian if, and only if, it is connected and every vertex has even degree.

Proof

If the graph is eulerian, as discussed above, it must be connected and every vertex must have even degree.

Now, assume that the graph is connected and every vertex has even degree. Start a walk $C$ at an arbitrary start vertex $s$. Walk arbitrarily, without repeating an edge, until there is no unused edge to take.

Necessarily, $C$ ends at the starting vertex. This is because, since every degree is even, when we enter a vertex, there is some way to leave it (each time we enter a vertex, one incident edge is used to enter and another is available to leave), except for the starting vertex.

Now, if $C$ uses all edges in $E(G)$, we are done. Otherwise, there is some edge $e = \{u, v\}$ that is unused. Since the graph is connected, there is a path $P$ from $s$ to $u$. Let $x$ be the last vertex on $P$ that belongs to $C$. Now we can see that $x \in C$ is connected to an edge that is unused (either $e$, if $x = u$, or the next edge in the $P$ after vertex $x$). We can then start another walk $C'$ at $x$, and by the same argument it will end at $x$, and we can increase $C$ to include $C'$, inserting $C'$ in the corresponding position of vertex $x$ in $C$.

We can repeat this process until $C$ covers all edges of $E(G)$, constructing a closed walk that passes through all edges.

This constructive proof gives us a polynomial time algorithm to compute such walk. With this knowledge, if all vertices of $G$ have even degree, we can solve the problem. But what if that is not the case?

## Odd degree vertices

If there are vertices with odd degree, the graph is not eulerian and we must repeat edges in our walk.

**Lemma 2**: There is an even number of odd degree vertices

Proof

Assume we have $k$ odd degree vertices. Consider the sum of degrees  
  

$$
\sum_{v \in V(G)} d(v) \equiv \sum_{v \in V(G)} [d(v) \text{ is odd}] \equiv k \pmod 2
$$

But this sum counts each edge exactly twice, so it must be equal to $2|E(G)|$. Therefore, $k$ is even.

Let $W$ be an optimum walk. Consider the edges traversed by $W$ more than once. We will create a new multigraph, with every edge having multiplicity equal to the number of times it is used in $W$.

Let $r(e) \geq 1$ be the number of times edge $e \in E(G)$ is used in $W$. Define a multiset $F$:  
  

$$
F = \{ e \in E(G), \text{ with multiplicity equal to  $r(e) - 1$ } \},
$$

that is, the repeated edges we used in $W$. Now, define the multigraph $H = (V(G), E(G) \cup F)$. From construction, we have that $H$ is an eulerian multigraph (the definition is analogous for that of a simple graph).

We will then optimize over $F$ to find the optimum walk. The goal is to find such a multiset of minimum cost that will make $H$ eulerian (that is, it will fix the parity of the degrees properly). Since $H$ is eulerian, all degrees are even, so the vertices with odd degrees in $F$ are exactly those in $G$.

**Lemma 3**: Any multigraph with $2t$ odd degree vertices can be decomposed into $t$ paths and some number of cycles, such that the endpoints of the paths are precisely the odd degree vertices.

Proof

Let the odd degree vertices be $v_1, v_2, \dots, v_{2t}$. Consider adding extra edges $(v_1, v_2), (v_3, v_4), \dots, (v_{2t-1}, v_{2t})$ into the multigraph. This makes the graph eulerian, so its edges can be decomposed into cycles (as we have seen in the proof of Lemma 1). Now we remove the extra edges from the created cycles. Every time we do so, a cycle opens up into a path that has endpoints in the odd degree vertices. Notice that there can be more than one extra edge in the same cycle, but this is fine.

As an example, in the following graph (over the black edges), there are initially two odd degree vertices, $1$ and $2$.  
  

<p class="figure"><img src="/writing/154192-9.png" alt="" /></p>


After adding the edge $(1, 2)$ (red), the graph becomes eulerian, therefore its edges can be decomposed into the cycles $C_1 = (1, 3, 4, 2)$, $C_2 = (3, 5, 6)$, and $C_3 = (4, 7, 8)$. After removing the edge $(1, 2)$, the graph is decomposed into the path $(1, 3, 4, 2)$ and cycles $C_2$ and $C_3$.

We then apply this lemma for $F$. But note that cycles do not affect the parity of the degrees, so they can be deleted without changing whether $H$ is eulerian. We are then left with paths between the odd degree vertices. To minimize the cost, we must choose shortest paths. All of this leads us to the following.

**Theorem 1**: the optimum $F$ is precisely the optimum way to pair the odd degree vertices in $G$ with shortest paths.

## Final algorithm

The algorithm (described first by Edmonds and Johnson \[1\]) is described by the steps below.

1.  Find the set of odd degree vertices $O$ in the graph $G$;
2.  Compute the pairwise shortest paths $d(i, j)$ between vertices of $O$;
3.  Compute the minimum cost perfect matching between vertices in $O$ using cost $d$;
4.  Recover the minimum paths associated with the perfect matching and add the edges back into the graph, creating a multigraph $H$;
5.  Compute an eulerian circuit/walk in $H$.

All steps can be done in polynomial-time, but step (3) is the most complicated by far. It requires a weighted variant of an already complicated algorithm (Weighted Blossom), but there are implementations out there in around $\mathcal{O}(n^2 m)$ time, and this will be the bottleneck of the whole procedure.

# Step three: improving the route

Ok, after stealing some code for the Weighted Blossom from the internet \[2\], I implemented the algorithm and got an optimum route out of it. And...

```cpp
n: 591
m: 1128
sum of edges: 132,608
final ans: 145,063
```

<p class="figure"><img src="/writing/154192-10.gif" alt="" /></p>


145 km! This is far less than the 216 km the cyclists took to do it (although these values are not really comparable; one is a theoretical distance measured on a map, and another is GPS distance over many hours, subject to errors and such), and it only has a ~13 km repeated edge cost (around 10%)!

However... notice that this route is kind of trash. It would be extremely hard to follow this with a map on hand, mainly because of how many turns it takes. It would be much better if the route had fewer turns.

It turns out that there are **many** optimum routes. After adding the shortest path edges back, there are a lot of eulerian circuits we could choose from. Therefore, we can apply some greedy strategy to try to get a better route.

What I did was: we will construct an eulerian circuit iteratively. When we are at some vertex, sort the outgoing edges by the angle it makes with the edge we took to get to this vertex (we want to go straight, with the smallest angle change possible). Then, greedily choose the edge that yields the smallest angle change, as long as the remaining graph remains eulerian (this can be checked by looking at the degrees).

Applying this trick, I was able to compute a much more manageable route, and even one that ends with a lap around the region, because why not?

<p class="figure"><img src="/writing/154192-11.gif" alt="" /></p>


# Step four: running!

Now, we are left with the easiest part, running an ultramarathon of around 100 miles following the optimum route I calculated (lol).

I put the route into another software, and expected the actual distance to be around 160 km, still a major improvement from the "yolo" 216 km the cyclists used. I was able to convert the route into a gpx file and plug it into my watch, so it would be relatively easy to follow.  
  

<p class="figure"><img src="/writing/154192-12.jpeg" alt="" /></p>


And then I was off! After 34 hours, it was done.  
  

<p class="figure"><img src="/writing/154192-13.jpg" alt="" /></p> <p class="figure"><img src="/writing/154192-14.jpg" alt="" /></p> <p class="figure"><img src="/writing/154192-15.jpg" alt="" /></p> <p class="figure"><img src="/writing/154192-16.jpg" alt="" /></p> <p class="figure"><img src="/writing/154192-17.jpg" alt="" /></p> ![](https://codeforces.com/predownloaded/c0/a4/c0a44ca49a2b7e6388a8a67dcd62cc7571817e87.jpg) <p class="figure"><img src="/writing/154192-19.jpg" alt="" /></p>


And here is my [final art](https://www.strava.com/activities/13074215849/overview), my *magnum opus*:  
  

<p class="figure"><img src="/writing/154192-20.jpg" alt="" /></p>


# Final thoughts

In the end, the GPS tracking gave a resulting 178 km. The fact that this is was so much higher than the expected 160 km can be explained by GPS errors and by the fact that I made some mistakes on the run, and had to trace back.

Anyways, this was very, very fun. I want to thank all my friends that participated in this adventure in various ways: Bruno <a href="https://codeforces.com/profile/brunodemattos" class="rated-user user-blue" title="Expert brunodemattos">brunodemattos</a> Nogueira, Alan Prado, Bernardo <a href="https://codeforces.com/profile/bernardo_amorim" class="rated-user user-orange" title="Master bernardo_amorim">bernardo_amorim</a> Amorim, Marcelo Chaves, Marina Marques, Larissa Firace, Emerson Francisco, Flávio Abras, Davi Netto, Naldinho, Álvaro.

All of the code I used is in a very messy repo \[3\], if you want to check it out. Also, I made a [website](https://brunomaletta.github.io/contorno/) to visualize the final route, as well as the minimum shortest-path matching.

# References

\[1\] Edmonds, Jack, and Ellis L. Johnson. "Matching, Euler tours and the Chinese postman." Mathematical programming 5.1 (1973): 88-124.  
\[2\] <https://judge.yosupo.jp/submission/231089>  
\[3\] <https://github.com/brunomaletta/contorno>
