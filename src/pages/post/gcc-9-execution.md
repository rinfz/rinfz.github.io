---
title: GCC 9.1 Execution Policies
date: 2019-06-24
layout: ../../layouts/Post.astro
tags: programming, c++
---

After reading about [\<algorithm\>](https://en.cppreference.com/w/cpp/algorithm) I decided to do some proof of concept benchmarks with the [new execution policies in GCC 9.1](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2016/p0024r2.html) as I am writing some high performance C++ at work and it'd be good to know these things.

Given a very naive benchmark - generating random integers - we can see whether or not there will be any performance enhancements. The benefit to using algorithm is updating to parallel code is simply adding an argument to the function call which represents the execution policy you want to use. That means even if parallel execution isn't going to be a net win, you haven't lost much in the process.

First step is to get gcc 9.1. This is available as a prebuilt package on ubuntu.

```
sudo apt install g++-9 lib64stdc++-9-dev libtbb-dev
```

The `libtbb` libraries were already installed for me so I just had to get the headers / development files.

Then a simple script. We tell it to generate 500 million ints so there will be a noticeable difference in timings.

```cpp
#include <algorithm>
#include <chrono>
#include <execution>
#include <iostream>
#include <random>
#include <vector>

namespace t = std::chrono;

int main() {
  int N = 500'000'000;
  std::random_device rng;
  std::mt19937 engine{rng()};
  std::uniform_int_distribution<int> dist{1, 1'000'000};

  auto gen = [&] { return dist(engine); };

  std::vector<int> v(N);

  auto start = t::high_resolution_clock::now();
  std::generate(std::execution::seq, v.begin(), v.end(), gen);
  std::cout << "Seq: " << t::duration<double>(
    t::high_resolution_clock::now() - start).count() << "s\n";

  start = t::high_resolution_clock::now();
  std::generate(std::execution::par, v.begin(), v.end(), gen);
  std::cout << "Par: " << t::duration<double>(
    t::high_resolution_clock::now() - start).count() << "s\n";

  start = t::high_resolution_clock::now();
  std::generate(std::execution::par_unseq, v.begin(), v.end(), gen);
  std::cout << "Par unseq: " << t::duration<double>(
    t::high_resolution_clock::now() - start).count() << "s\n";

  return 0;
}
```

This feature is [c++17 only](https://gcc.gnu.org/onlinedocs/libstdc++/manual/status.html#status.iso.2017) (see "The Parallelism TS Should be Standardized"), and currently requires linking Intel's libtbb. Compile it like so:

```
g++-9 -std=c++17 test.cpp -ltbb -O3
```

And after running it we get the following timings:

```
Seq: 10.205s
Par: 7.57447s
Par unseq: 8.83137s
```

Where the first part is the execution policy used and the second part is the total time to generate the integers in seconds.

It's clear to see that par wins this comfortably. Nice to know we can basically get a free win with this feature. I haven't yet understood why par_unseq is so much slower than normal par though.
