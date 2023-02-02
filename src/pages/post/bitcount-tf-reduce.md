---
title: Count set bits in a vector with transform_reduce
date: 2019-10-23
layout: ../../layouts/Post.astro
tags: programming, c++
---

```cpp
#include <cstdio>
#include <vector>
#include <random>
#include <bitset>
#include <numeric>
#include <functional>
#include <execution>
#include <chrono>

int main() {
    int N = 5'000'000;
    std::random_device rng;
    std::mt19937 engine{rng()};
    std::uniform_int_distribution<uint8_t> dist{0, 1};
    auto gen = [&] { return dist(engine); };

    std::vector<uint8_t> data(N);
    std::generate(data.begin(), data.end(), gen);

    auto t1 = std::chrono::high_resolution_clock::now();
    uint64_t result = std::transform_reduce(
        std::execution::par_unseq,
        data.cbegin(), data.cend(),
        0,
        std::plus<>{},
        [] (const auto& n) { return std::bitset<8>(n).count(); }
    );
    auto t2 = std::chrono::high_resolution_clock::now();
    std::chrono::duration<double, std::milli> ms = t2 - t1;

    printf("%ld in %f ms\n", result, ms.count());
}
```

Compile with: `g++-9 -std=c++17 a.cpp -ltbb`
