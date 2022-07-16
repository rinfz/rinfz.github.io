---
title: Python Unbound Local Error
date: 2019-06-08
layout: ../../layouts/Post.astro
tags: programming, python
---

```
>>> import os
>>> def foo():
    os.environ['a'] = '1'
    import os
    return 1
>>> foo()
Traceback (most recent call last):
  File "", line 1, in
    foo()
  File "", line 2, in foo
    os.environ['a'] = '1'
UnboundLocalError: local variable 'os' referenced before assignment
```

Turns out if you import a module within the same function body as it's used, but import it after, some weird name resolution happens (I came accross this when debugging a for loop so it wasn't particularly intuitive).

To avoid it, either know what you're importing or have a global at the start of the function body, i.e.

```python
>>> def bar():
    global os
    os.environ['a'] = '1'
    import os
    return 1
>>> bar()
1
```
