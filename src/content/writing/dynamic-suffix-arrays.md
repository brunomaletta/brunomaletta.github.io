---
title: "[Tutorial] Dynamic Suffix Arrays"
date: 2021-07-20
cfId: 93042
cfUrl: "https://codeforces.com/blog/entry/93042"
tags:
summary: "Hello, Codeforces!"
---
Hello, Codeforces!

In this blog I will describe yet another ~~useless~~ unconventional data structure. This time, I will show how to maintain an extended suffix array (suffix array, inverse of suffix array, and $lcp$ array) while being able to add or remove some character at the **beginning** of the string in $\mathcal{O}(\log n)$ amortized time.

It can be used to ~~overkill~~ solve problem M from [2020-2021 ACM-ICPC Latin American Regionals](https://codeforces.com/gym/103185), which my team couldn't solve during the contest. I learned it from [here](https://oi-wiki.org/string/suffix-bst/) (Chinese), but it is not shown how to maintain the $lcp$ array.

Here is the whole code of the data structure. To read this blog, I recommend you ignore this code for now, but use it if you have questions about helper functions, constructors, etc, since I will pass over some implementation details in the explanations.

Full code

```cpp
struct dyn_sa {
	struct node {
		int sa, lcp;
		node *l, *r, *p;
		int sz, mi;
		node(int sa_, int lcp_, node* p_) : sa(sa_), lcp(lcp_),
			l(NULL), r(NULL), p(p_), sz(1), mi(lcp) {}
		void update() {
			sz = 1, mi = lcp;
			if (l) sz += l->sz, mi = min(mi, l->mi);
			if (r) sz += r->sz, mi = min(mi, r->mi);
		}
	};

	node* root;
	vector<ll> tag; // tag of a suffix (reversed id)
	string s; // reversed

	dyn_sa() : root(NULL) {}
	dyn_sa(string s_) : dyn_sa() {
		reverse(s_.begin(), s_.end());
		for (char c : s_) push_front(c);
	}
	~dyn_sa() {
		vector<node*> q = {root};
		while (q.size()) {
			node* x = q.back(); q.pop_back();
			if (!x) continue;
			q.push_back(x->l), q.push_back(x->r);
			delete x;
		}
	}

	int size(node* x) { return x ? x->sz : 0; }
	int mirror(int i) { return s.size()-1 - i; }
	bool cmp(int i, int j) {
		if (s[i] != s[j]) return s[i] < s[j];
		if (i == 0 or j == 0) return i < j;
		return tag[i-1] < tag[j-1];
	}
	void fix_path(node* x) { while (x) x->update(), x = x->p; }
	void flatten(vector<node*>& v, node* x) {
		if (!x) return;
		flatten(v, x->l);
		v.push_back(x);
		flatten(v, x->r);
	}
	void build(vector<node*>& v, node*& x, node* p, int L, int R, ll l, ll r) {
		if (L > R) return void(x = NULL);
		int M = (L+R)/2;
		ll m = (l+r)/2;
		x = v[M];
		x->p = p;
		tag[x->sa] = m;
		build(v, x->l, x, L, M-1, l, m-1), build(v, x->r, x, M+1, R, m+1, r);
		x->update();
	}
	void fix(node*& x, node* p, ll l, ll r) {
		if (3*max(size(x->l), size(x->r)) <= 2*size(x)) return x->update();
		vector<node*> v;
		flatten(v, x);
		build(v, x, p, 0, v.size()-1, l, r);
	}
	node* next(node* x) {
		if (x->r) {
			x = x->r;
			while (x->l) x = x->l;
			return x;
		}
		while (x->p and x->p->r == x) x = x->p;
		return x->p;
	}
	node* prev(node* x) {
		if (x->l) {
			x = x->l;
			while (x->r) x = x->r;
			return x;
		}
		while (x->p and x->p->l == x) x = x->p;
		return x->p;
	}

	int get_lcp(node* x, node* y) {
		if (!x or !y) return 0; // change defaut value here
		if (s[x->sa] != s[y->sa]) return 0;
		if (x->sa == 0 or y->sa == 0) return 1;
		return 1 + query(mirror(x->sa-1), mirror(y->sa-1));
	}
	void add_suf(node*& x, node* p, int id, ll l, ll r) {
		if (!x) {
			x = new node(id, 0, p);
			node *prv = prev(x), *nxt = next(x);
			int lcp_cur = get_lcp(prv, x), lcp_nxt = get_lcp(x, nxt);
			if (nxt) nxt->lcp = lcp_nxt, fix_path(nxt);
			x->lcp = lcp_cur;
			tag[id] = (l+r)/2;
			x->update();
			return;
		}
		if (cmp(id, x->sa)) add_suf(x->l, x, id, l, tag[x->sa]-1);
		else add_suf(x->r, x, id, tag[x->sa]+1, r);
		fix(x, p, l, r);
	}
	void push_front(char c) {
		s += c;
		tag.push_back(-1);
		add_suf(root, NULL, s.size() - 1, 0, 1e18);
	}

	void rem_suf(node*& x, int id) {
		if (x->sa != id) {
			if (tag[id] < tag[x->sa]) return rem_suf(x->l, id);
			return rem_suf(x->r, id);
		}
		node* nxt = next(x);
		if (nxt) nxt->lcp = min(nxt->lcp, x->lcp), fix_path(nxt);

		node *p = x->p, *tmp = x;
		if (!x->l or !x->r) {
			x = x->l ? x->l : x->r;
			if (x) x->p = p;
		} else {
			for (tmp = x->l, p = x; tmp->r; tmp = tmp->r) p = tmp;
			x->sa = tmp->sa, x->lcp = tmp->lcp;
			if (tmp->l) tmp->l->p = p;
			if (p->l == tmp) p->l = tmp->l;
			else p->r = tmp->l;
		}
		fix_path(p);
		delete tmp;
	}
	void pop_front() {
		if (!s.size()) return;
		s.pop_back();
		rem_suf(root, s.size());
		tag.pop_back();
	}
	
	int query(node* x, ll l, ll r, ll a, ll b) {
		if (!x or tag[x->sa] == -1 or r < a or b < l) return s.size();
		if (a <= l and r <= b) return x->mi;
		int ans = s.size();
		if (a <= tag[x->sa] and tag[x->sa] <= b) ans = min(ans, x->lcp);
		ans = min(ans, query(x->l, l, tag[x->sa]-1, a, b));
		ans = min(ans, query(x->r, tag[x->sa]+1, r, a, b));
		return ans;
	}
	int query(int i, int j) { // lcp(s[i..], s[j..])
		if (i == j) return s.size() - i;
		ll a = tag[mirror(i)], b = tag[mirror(j)];
		int ret = query(root, 0, 1e18, min(a, b)+1, max(a, b));
		return ret;
	}
	// optional: get isa[i], sa[i] and lcp[i] (standard index representation)
	int isa(int i) {
		i = mirror(i);
		node* x = root;
		int ret = 0;
		while (x) {
			if (tag[x->sa] < tag[i]) {
				ret += size(x->l)+1;
				x = x->r;
			} else x = x->l;
		}
		return ret;
	}
	// returns a pair with SA[i] and lcp[i]
	pair<int, int> operator[](int i) {
		node* x = root;
		while (1) {
			if (i < size(x->l)) x = x->l;
			else {
				i -= size(x->l);
				if (!i) return {mirror(x->sa), x->lcp};
				i--, x = x->r;
			}
		}
	}
};
```

## 1. Definitions

I will assume the reader is familiar with the definition of suffix array ($SA$) and $lcp$ array. If that is not the case, I recommend learning it from [Codeforces EDU](https://codeforces.com/edu/course/2/lesson/2).

Here, the $i$-th position of the $lcp$ array will denote the longest common prefix between $SA[i]$ and $SA[i-1]$. Also, $lcp[0] = 0$. The inverse suffix array ($ISA$), or **rank** of a suffix says what position that suffix is at in the $SA$. That is, $ISA[SA[i]] = i$.

In the data structure, since we add characters at the front of the string, we will use a reversed index representation of each suffix. For example, the suffix of index 2 of $baabac$ is $bac$. We will use a function $\texttt{mirror}$ to go from the standard index representation to the reversed one, and vice versa.

Mirror function

```cpp
int mirror(int i) {
	return s.size()-1 - i;
}
```

## 2. Binary search tree

Let's represent the $SA$ using a binary search tree, such that the in-order traversal of the tree gives the $SA$. For example, take the $SA$ of $baabac$ below. For each suffix, its (reversed) index and $lcp$ are represented.

<p class="figure"><img src="/writing/93042-1.png" alt="" /></p>


We could represent this using the following binary search tree.

<p class="figure"><img src="/writing/93042-2.png" alt="" /></p>


Additionally, we will store an array $tag$, such that $tag[i] \lt tag[j]$ if, and only if, suffix $i$ comes before suffix $j$ in the $SA$ (equivalently, in the binary search tree). Using this, we can compare two suffixes lexicographically in constant time. This is pivotal to make the complexity of the operations $\mathcal{O}(\log n)$ amortized.

Because we want to maintain the $tag$ array, we will not use a binary search tree that does rotations, since it not trivial how to update the $tag$ values during the rebalancing. Instead, we will use a binary search tree called **Amortized weight-balanced trees** (see below for references). The idea of these trees is that, at any point, every subtree will be $\alpha$-balanced for some $0.5 \lt \alpha \lt 1$, which means that for every subtree rooted at node $x$, $\max(\text{size}(x.left), \text{size}(x.right)) \leq \alpha \cdot \text{size}(x)$. It turns out that if we insert and delete using trivial binary search tree algorithms and, after every change, for every node that is not $\alpha$-balanced we simply rebuild the entire subtree rooted at that node so that it becomes as balanced as possible, the height of the tree and the amortized cost of inserting and deleting is $\mathcal{O}(\log_{\frac{1}{\alpha}} n)$. Proving this is beyond the scope of this blog. In the code, I use $\alpha = 2/3$.

This rebuilding scheme makes it easy to maintain the $tag$ values by having a large enough interval of possible values (I use $[0, 10^{18}]$) and recursively dividing it in half (refer to the code for more details).

Given that we have a binary search tree representing the $SA$ and $lcp$ array with logarithmic height, how do we query for $SA$, $lcp$ and $ISA$? If we maintain the subtree sizes of the tree, we simply go down the tree to get the $i$-th smallest node and so we get $SA[i]$ and $lcp[i]$ in $\mathcal{O}(\log n)$, if $n$ is the size of the string. To get $ISA[i]$, we go down the tree, counting how many nodes in the tree have $tag$ value smaller than $tag[i]$.

Code for ISA, SA and lcp

```cpp
// functions to be called with standard index representation
int isa(int i) {
	i = mirror(i);
	node* x = root;
	int ret = 0;
	while (x) {
		if (tag[x->sa] < tag[i]) {
			ret += size(x->l)+1;
			x = x->r;
		} else x = x->l;
	}
	return ret;
}
// returns a pair with SA[i] and lcp[i]
pair<int, int> operator[](int i) {
	node* x = root;
	while (1) {
		if (i < size(x->l)) x = x->l;
		else {
			i -= size(x->l);
			if (!i) return {mirror(x->sa), x->lcp};
			i--, x = x->r;
		}
	}
}
```

Finally, we can also use the tree to query for the $lcp$ between two arbitrary suffixes $i$ and $j$ (not necessarily consecutive in the $SA$). We know that this is equal to the minimum between the $lcp$ values in the range defined by the two suffixes. So we just need to store the minimum over all $lcp$ values on every subtree, and query for the minimum over all nodes that have $tag$ value in the range $(tag[i], tag[j]]$, assuming $tag[i] \lt tag[j]$. This can be done by going down the tree similar to a segment tree, in $\mathcal{O}(\log n)$ time.

Code for arbitrary suffix lcp query

```cpp
int query(node* x, ll l, ll r, ll a, ll b) {
	// current subtree can have tag values in the range [l, r]
	if (!x or tag[x->sa] == -1 or r < a or b < l) return s.size();
	if (a <= l and r <= b) return x->mi;
	int ans = s.size();
	if (a <= tag[x->sa] and tag[x->sa] <= b) ans = min(ans, x->lcp);
	ans = min(ans, query(x->l, l, tag[x->sa]-1, a, b));
	ans = min(ans, query(x->r, tag[x->sa]+1, r, a, b));
	return ans;
}
int query(int i, int j) { // lcp(s[i..], s[j..]) in standard index representation
	if (i == j) return s.size() - i;
	ll a = tag[mirror(i)], b = tag[mirror(j)];
	int ret = query(root, 0, 1e18, min(a, b)+1, max(a, b));
	return ret;
}
```

## 3. Adding a character

Since we add or remove characters at the front of the string, we only add or remove a single suffix of the string (and, equivalently, a single node in the binary search tree), and the previous suffixes remain unchanged and maintain their relative order. Below we see represented in red what changes in the $SA$ and $lcp$ after adding $b$ to $aabac$.

<p class="figure"><img src="/writing/93042-3.png" alt="" /></p> $\hspace{30pt}$ <p class="figure"><img src="/writing/93042-4.png" alt="" /></p>


So, to update the structure with the new suffix, we just need to find the position where the new suffix will end up at, its $lcp$ value and we might need to update the $lcp$ value of the suffix that comes just after the added suffix.

### 3.1. Comparing the new suffix with another suffix

If we can compare the new suffix with any other suffix, we can use this to go down the tree and figure out the position we need to insert the new suffix. To make this comparison, we use the following trick: we compare the first character of the suffixes. If they are different, we know which one is smaller lexicographically. If they are the same, then we end up with a comparison between two suffixes that are already in the tree, and we know how to compare them! Just use their $tag$ value.

Code for comparing the new suffix with some other suffix in the tree

```cpp
bool cmp(int i, int j) {
	if (s[i] != s[j]) return s[i] < s[j];
	if (i == 0 or j == 0) return i < j;
	return tag[i-1] < tag[j-1];
}
```

### 3.2. Getting the $lcp$ values

To get the $lcp$ value for the new suffix and for the node the goes after the new suffix (since its $lcp$ value might change), we will use the same trick: if the first characters of the suffixes are different, then their $lcp$ is zero. Otherwise, we are left with an $lcp$ query between two suffixes that are already in the quill, which we already know how to answer, just call the $\texttt{query}$ function.

Code for getting the lcp between the new suffix and some other suffix

```cpp
int get_lcp(node* x, node* y) { // node x comes before node y in the tree
	if (!x or !y) return 0; // 0 by default
	if (s[x->sa] != s[y->sa]) return 0;
	if (x->sa == 0 or y->sa == 0) return 1;
	return 1 + query(mirror(x->sa-1), mirror(y->sa-1));
}
```

Since now we know how to compare the new suffix with any other suffix in the tree, and how to get the $lcp$ between the new suffix and any other suffix in the tree, we are ready to insert a new suffix: just go down the tree to the correct position, insert the new suffix, compute its $lcp$ and recompute the $lcp$ of the next node in the tree.

Code for inserting a new suffix

```cpp
// [l, r] is the tag range of the current subtree
void add_suf(node*& x, node* p, int id, ll l, ll r) {
	if (!x) {
		x = new node(id, 0, p);
		// previous node and next node in the tree
		node *prv = prev(x), *nxt = next(x); 
		int lcp_cur = get_lcp(prv, x), lcp_nxt = get_lcp(x, nxt);
		// fix_path goes up to the rood calling update on the nodes
		if (nxt) nxt->lcp = lcp_nxt, fix_path(nxt);
		x->lcp = lcp_cur;
		tag[id] = (l+r)/2;
		x->update();
		return;
	}
	if (cmp(id, x->sa)) add_suf(x->l, x, id, l, tag[x->sa]-1);
	else add_suf(x->r, x, id, tag[x->sa]+1, r);
	fix(x, p, l, r); // update and rebuild subtree if unbalanced
}
void push_front(char c) {
	s += c;
	tag.push_back(-1);
	add_suf(root, NULL, s.size() - 1, 0, 1e18);
}
```

## 4. Removing a character

Removing a suffix is relatively straightforward: go down the tree, using the $tag$ array, to find where the suffix we want to remove is. When found, just remove it using standard binary search tree algorithm.

Now note that the $lcp$ value of the node that comes after the removed node might be incorrect. Luckily, it is easy to get its correct value: it is the minimum between the current value and the $lcp$ value of the suffix we are removing. This follows from the fact that the $lcp$ between two suffixes is the minimum over the $lcp$ values of the range defined by them in the $SA$.

Code for removing a suffix

```cpp
void rem_suf(node*& x, int id) {
	if (x->sa != id) {
		if (tag[id] < tag[x->sa]) return rem_suf(x->l, id);
		return rem_suf(x->r, id);
	}
	node* nxt = next(x);
	// update the lcp value for the next node
	if (nxt) nxt->lcp = min(nxt->lcp, x->lcp), fix_path(nxt);
	node *p = x->p, *tmp = x;
	if (!x->l or !x->r) { // remove x directly
		x = x->l ? x->l : x->r;
		if (x) x->p = p;
	} else { // replace x by the node that comes before it
		for (tmp = x->l, p = x; tmp->r; tmp = tmp->r) p = tmp;
		x->sa = tmp->sa, x->lcp = tmp->lcp;
		if (tmp->l) tmp->l->p = p;
		if (p->l == tmp) p->l = tmp->l;
		else p->r = tmp->l;
	}
	fix_path(p);
	delete tmp;
}
void pop_front() {
	if (!s.size()) return;
	s.pop_back();
	rem_suf(root, s.size());
	tag.pop_back();
}
```

Note that I don't do the rebalancing/rebuilding stuff on the node deletion. This makes so the height of the tree won't always be logarithmic on the current size of the string, however it will still be logarithmic on the maximum size of the string so far, so this is not a problem.

## 5. Problem~~s~~

I only know of one problem that makes sense using this data structure to solve it.

- [103185M - May I Add a Letter?](/gym/103185/problem/M "2020-2021 ACM-ICPC Latin American Regional Programming Contest")

Solution

Note that the answer is $\sum_{i=1}^{n-1} \max(0, lcp[i] - lcp[i-1])$. Also note that this value is the same for the reversed string, so we can do the updates in the beginning of the string, instead of doing them in the end. Now we simply maintain this sum, and for every added character we push the new value in a stack. It is easy to update the sum for adding a character, and for removing a character we just pop from the sack.

[Code](https://pastebin.com/3SHz0M29)

Complexity: $\mathcal{O}((n+q) \log (n+q))$

## 6. Final remarks

This data structure is relatively simple, and yet very powerful. Not even suffix trees and suffix automaton, that can update their structure with character additions, are capable of rollbacks without breaking their complexity. So this scores yet another point for suffix arrays being the best suffix structure.

This data structure is not too fast, but it is not super slow either. It runs in about 3 times the time of my static $\mathcal{O}(n \log n)$ suffix array implementation.

I would like to thank <a href="https://codeforces.com/profile/arthur.nascimento" class="rated-user user-red" title="Grandmaster arthur.nascimento">arthur.nascimento</a> for creating the problem [103185M - May I Add a Letter?](/gym/103185/problem/M "2020-2021 ACM-ICPC Latin American Regional Programming Contest"), which made me look into this data structure. Also <a href="https://codeforces.com/profile/tdas" class="rated-user user-orange" title="Master tdas">tdas</a> for showing me the existence of it.

## References

Explanation of the data structure (without maintaining the $lcp$ array) (Chinese): [Link](https://oi-wiki.org/string/suffix-bst/)

On the binary search tree used: [Link1](https://www.lcg.ufrj.br/python/ADs/AD1_2019-2.EN.pdf) [Link2](https://walkccc.me/CLRS/Chap17/Problems/17-3/)
