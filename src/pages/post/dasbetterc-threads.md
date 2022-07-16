---
title: DasBetterC and pthread
date: 2019-10-23
layout: ../../layouts/Post.astro
tags: programming, dlang
---

Recently I was poking around writing some plain C code but stopped pretty soon as I realised my options for writing a generic std::vector style container were pretty limited to copy and paste or rely on `void*` (not a C person so there are probably more options).

That's when I remembered about D's [betterC mode](https://dlang.org/spec/betterc.html). The long and short of it is D without a runtime so missing out on some nice things like [classes](https://dlang.org/phobos/object.html) and the introspection that comes with that, amongst some other things.

On the other hand you essentially get 90% of D and all the good modern features that come with it, like unit tests, modules, templates and metaprogramming, RAII, slices, array bounds checks, destructors etc etc. In this respect it is more of a C++-lite than D is usually. But compact binaries and no GC are sometimes an appealing prospect.

Anyway... I have a project in D which is heavy on the threading side of things and the documentation for betterC states `core.thread` is not available. So I went looking for examples of `<pthread.h>` and came across: [pthreads in C - a minimal working example](http://timmurphy.org/2010/05/04/pthreads-in-c-a-minimal-working-example/). From there it was trivial to get an MVP in D (I doubt I will take this train of thought too far as I dread the idea of making it cross compatible).

Start with some declarations from `<pthread.h>` and `<pthreadtypes.h>`:

```d
// D provides printf, import here for use later
// (and note that we can't use writeln like we normally would in D)
import core.stdc.stdio : printf;

extern(C) {
    alias pthread_t = ulong;
    // Laziness as it's actually a union but we don't care here.
    alias pthread_attr_t = void;

    int pthread_create(pthread_t *newthread,
                       const pthread_attr_t* attr,
                       void* function(void*) start_routine,
                       void* arg);

    int pthread_join(pthread_t t, void** t_return);
}
```

Note that we use D's syntax for declaring a function pointer `T function(U) name` rather than C's style.

Then create a function which we will call from the thread:

```d
extern(C) void* inc_x(void* data) {
    int* x_ptr = cast(int*) data;
    while (++(*x_ptr) < 100) {}
    printf("Done on thread\n");
    return null;
}
```

Nothing special here really. Then finally create the main function:

```d
extern (C) void main() {
    int x = 0, y = 0;

    pthread_t inc_x_thread;

    if (pthread_create(&inc_x_thread, null, &inc_x, &x)) {
        printf("Error creating thread\n");
        return;
    }

    while (++y < 100) {}

    if (pthread_join(inc_x_thread, null)) {
        printf("Error joining thread\n");
        return;
    }

    printf("x=%d, y=%d\n", x, y);
}
```

- We have to say our main is `extern(C)` for DasBetterC mode.
- pthread functions are called as usual.
- This is almost identical to the C version - nice.

Compile it with the following command:

`dmd -betterC -L=-lpthread example.d`

Running should print the following:

```
Done on thread
x=100, y=100
```
