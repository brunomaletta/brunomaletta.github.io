---
title: "Introducing tgen: a testcase generation library"
date: 2026-06-12
cfId: 154468
cfUrl: "https://codeforces.com/blog/entry/154468"
tags:
summary: "Testcase generation for random inputs."
---
<p class="figure"><img class="tgen-logo" src="/writing/tgen-logo-white.svg" alt="tgen" /></p>

*Testcase generation for random inputs.*

Hello, Codeforces!

Here I introduce **tgen**, a single-header C++ library (similar to [jngen](https://codeforces.com/blog/entry/53081)) for generating random and adversarial testcases for competitive programming problems.

<a href="https://github.com/brunomaletta/tgen" class="tgen-cta">Open tgen on GitHub</a>  
  
<p class="tgen-links"><a href="https://github.com/brunomaletta/tgen/blob/main/single_include/tgen.h"><em>Header link</em></a> <strong>·</strong> <a href="https://brunomaletta.github.io/tgen/"><em>Documentation</em></a></p>

Tgen supports lists, permutations, graphs, trees, strings, math, geometry, and more. Here are some examples:

Examples

```cpp
// Generates 20 uniformly random distinct values from 1 to 100.
std::cout << tgen::list<int>(20, 1, 100).all_different().gen() << std::endl;

// Generates all palindromic DNA sequences of length 3.
std::cout << tgen::str(3, {'A', 'C', 'G', 'T'}).palindrome().gen_all() << std::endl;

// Generates a uniformly random permutation with a single cycle.
std::cout << tgen::permutation(5).cycles({5}).gen().add_1() << std::endl;

// Generates q distinct uniformly random range queries.
std::cout << tgen::pair(1, n).leq().distinct().gen_list(q) << std::endl;

// Random skewed tree on 10 vertices (elongation 3; large diameter).
std::cout << tgen::tree::gen_skewed(10, 3) << std::endl;

// Uniformly random connected simple graph on 8 vertices and 10 edges, including (0,1).
std::cout << tgen::graph(8, 10).add_edge(0, 1).get_connected() << std::endl;

// Generates a uniformly random valid parenthesis sequence of size 10.
std::cout << tgen::misc::gen_parenthesis(10) << std::endl;

// Generates a random simple polygon with 200 vertices in [0, 2000] x [0, 2000].
std::cout << tgen::print(tgen::geometry::random_simple_polygon(200, 0, 2000), '\n') << std::endl;
```

There is a robust framework for **distinct** generation:

Distinct examples

```cpp
// Generates all primes in [1, 10] in order.
std::cout << tgen::distinct(tgen::math::gen_prime, 1, 10).gen_all().sort() << std::endl;

// Generates 10 uniformly random distinct strings.
std::cout << tgen::str("[a-z]{5}").distinct().gen_list(10) << std::endl;

// Generates 5 uniformly random distinct square numbers in [1, 1e4].
std::cout << tgen::distinct(
    [&]() {
        int x = tgen::next(1, 100);
        return x * x;
    }).gen_list(5) << std::endl;
```

Another important feature is **adversarial generation**, that is, worst-case generation (a.k.a. hacks).

Hack examples

```cpp
// Worst case for Edmonds-Karp and Dinitz.
std::cout << tgen::hack::dinitz_worst_case(100, 100).print_nm();

// Generates array that forces collision on std::unordered_set.
std::cout << tgen::print(tgen::hack::std_unordered(1e6)) << std::endl;

// Two binary strings with the same polynomial hash (base 31, mod 1e9+7).
std::cout << tgen::print(tgen::hack::polynomial_hash(2, 31, 1e9+7), '\n') << std::endl;

// Creates queries that force worst-case for Mo's algorithm.
std::vector<std::pair<int, int>> mo_hack = tgen::hack::mo_worst_case(1e6, 1e6);

// Hack for segment tree beats: initial array and update list.
auto [arr, updates] = tgen::hack::segment_tree_beats_worst_case(3, 146);
```

Most of which inspired by Codeforces blogs. There is a feature/time comparison against jngen [here](https://brunomaletta.github.io/tgen_vs_jngen/).

Give it a try next time you are prepairing a problem! If there are any issues or feature requests, please open an issue on GitHub, and I will sort it out as soon as I can.

### Extra: tgen miniblogs

Over the next few weeks, I will post a series of miniblogs discussing interesting mathematical and algorithmic problems that came up during the development of tgen. Stay tuned!

### Acknowledgments

I would like to thank <a href="https://codeforces.com/profile/Roberio" class="rated-user user-orange" title="Master Roberio">Roberio</a> for encouraging me to work on this project, and some friends for the help in discussions: <a href="https://codeforces.com/profile/emaneru" class="rated-user user-orange" title="International Master emaneru">emaneru</a>, <a href="https://codeforces.com/profile/bernardo_amorim" class="rated-user user-orange" title="Master bernardo_amorim">bernardo_amorim</a>, <a href="https://codeforces.com/profile/rafaelgo" class="rated-user user-violet" title="Candidate Master rafaelgo">rafaelgo</a>, <a href="https://codeforces.com/profile/kobus" class="rated-user user-orange" title="Master kobus">kobus</a>, <a href="https://codeforces.com/profile/VinnySJ" class="rated-user user-violet" title="Candidate Master VinnySJ">VinnySJ</a>. Finally, I want to thank <a href="https://codeforces.com/profile/ifsmirnov" class="rated-user user-orange" title="Master ifsmirnov">ifsmirnov</a> for the inspiring jngen project.
