---
title: (TIL) AoC C# learnings
date: 2022-12-04
layout: ../../layouts/Post.astro
tags: short, csharp, til
---

Here are some things I've learnt about C# while doing Advent of Code.

1. `.Sum()` takes a function which is better than doing `.Select().Sum()`
2. `.Intersect()` doesn't require `HashSet`, it even works on strings.
3. C# supports more than simple indexing: `xs[^1]` (last elem), `xs[2..4]` (range)
4. Exceptions have methods for throwing in common situations related to their name, e.g. [ArgumentException.ThrowIfNullOrEmpty](https://learn.microsoft.com/en-us/dotnet/api/system.argumentexception.throwifnullorempty?view=net-7.0).
5. Use `Enumerable.Repeat(0, n).Select(_ => ...)` to initialise n lots of a similar object, like `List<char>` or something.
