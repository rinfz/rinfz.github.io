---
title: Convert binary string representation to integer
date: 2019-07-15
layout: ../../layouts/Post.astro
tags: programming, dlang
---

```d
void main() {
  import std;
  write("enter binary number: ");
  readln
    .strip
    .compose!(retro,s=>s.all!"a=='0'||a=='1'"?s:"")
    .enumerate
    .map!"a[1]&'1'-48?2^^a[0]:0"
    .sum
    .writeln;
}
```

Example output:

```
enter binary number: 111
7
```

Where 111 is user input.
