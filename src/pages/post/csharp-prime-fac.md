---
title: C# Prime Factorisation
date: 2022-12-12
layout: ../../layouts/Post.astro
tags: programming, til
---

Based on an answer on stack overflow, I wrote a prime factorisation function in C#. Then I converted the code to use the generic math functionality which was just added in .Net 7. After benchmarking the two versions, there was no difference in runtime (1.447us mean percall) which is always nice to see.

Here is the snippet:

```csharp
public IEnumerable<T> PrimeFactors<T>(T n)
    where T : INumber<T>
{
    var div = T.CreateChecked(2);
    while (div * div <= n)
    {
        if (n % div != T.Zero)
        {
            div++;
        }
        else
        {
            n /= div;
            yield return div;
        }
    }
    if (n > T.One) yield return n;
}
```
