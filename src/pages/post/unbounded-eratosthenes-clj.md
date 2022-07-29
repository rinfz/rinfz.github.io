---
title: Unbounded sieve of Eratosthenes in Clojure
date: 2022-07-29
layout: ../../layouts/Post.astro
tags: programming, fp, clojure
---

Recently I have restarted doing some [project euler](https://projecteuler.net/about) problems. I have been implementing the solutions in Clojure because it's been a while since I've played around with the language, and I rather enjoy it. Plus it's a good excuse to learn how to think with a functional programming mindset.

Question 7 simply tells you to find the 10,001st prime number. Straight forward enough with a prime sieve. Because you need to find the nth prime, an unbounded prime sieve is required - usually you provide a limit and find all primes below that. We don't know the value of the 10,001st prime so naturally we can't provide a limit.

Since I'm doing this to learn Clojure, I'm not bothered about constructing an unbounded sieve from first principles. So I found the [following article](https://www.kylem.net/stuff/sieve_eratosthenes.html) with a straightforward implementation in Python. It's written in an imperative style so figuring out the details regarding tracking state, making it recursive etc provided a good learning experience.

First, I ported dict.setdefault (the version is hard-coded to resemble `defaultdict(list)`):

```clj
(defn setdefault [m k v]
  (if (contains? m k)
    (update-in m [k] conj v) ; k exists, append value to the vector at k
    (assoc m k [v])))        ; create a vector at k with v as the only elem
```

Next, I worked my way out from the inner loop. I recognised that the for loop is just a reduction of setdefault on counters:

```clj
(defn update-counters [counters p]
  (reduce #(setdefault % (+ p %2) %2) counters (get counters p)))
```

The harder part was getting the inner while loop working. It does, however, translate well into a recursive function. The bottom-out clause is the same the while loop (`p in counters` / `(contains? sieve p)`). Otherwise we calculate the state for the next call with `update-counters`, `dissoc` and `(inc n)`. Counters and p are placed in a vector ready to be handled by the next iteration.

```clj
(defn primes-impl [counters p]
  (loop [sieve counters n p]
    (if (not (contains? sieve n))
      [(assoc sieve n [n]) n] ; loop terminates, update state
      (recur (dissoc (update-counters sieve n) n) (inc n)))))
```

Since `primes-impl` returns the state which can be used for the next call, iterate is perfect for creating an infinite sequence of primes. `apply` is needed because `primes-impl` returns a vector but expects seperate args (I suppose primes-impl could also just take a vector to simplify the `iterate` call). Iterating `primes-impl` results in a sequence which includes all the state used for tracking, therefore `(map second ...)` is needed to just extract the primes.

```clj
(defn primes []
  (map second (iterate #(apply primes-impl %) [{} 2])))
```

As for the actual problem, we can just use the `nth` function to get whichever prime we need:

```
user=> (nth (primes) 10001)
104743
```

Some benchmarks (no idea if these are performant or not):

```
user=> (time (nth (primes) 1000))
"Elapsed time: 40.3351 msecs"
7919
user=> (time (nth (primes) 5000))
"Elapsed time: 183.4985 msecs"
48611
user=> (time (nth (primes) 10000))
"Elapsed time: 209.0829 msecs"
104729
user=> (time (nth (primes) 50000))
"Elapsed time: 1351.956 msecs"
611953
user=> (time (nth (primes) 100000))
"Elapsed time: 3054.6579 msecs"
1299709
user=> (time (nth (primes) 1000000))
"Elapsed time: 42555.3956 msecs"
15485863
```
