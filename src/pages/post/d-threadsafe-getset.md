---
title: Thread-safe getters/setters for Global State in D
date: 2019-10-26
layout: ../../layouts/Post.astro
tags: programming, dlang
---

First, note that to make an object globally shared across threads in D we use the `__gshared` attribute. Caveat: using this is basically cowboy mode since `__gshared` provides no safety checks or guarantees, so really it should be limited in scope and for plumbing code generally speaking, but this is more of a proof of concept. Plus - as of writing - the safe(r) `shared` attribute still needs some work according to Walter/Andrei/Atila.

Nonetheless! We create a state struct anyway.

```d
struct State
{
    string serverName;
    string accessToken;
    // ...
}

__gshared static State STATE;
```

Now across any threads, we can access our state. But we might get race conditions so the lazy way is to use `@property` methods and put everything in synchronized blocks. Luckily D can help us live up to our true lazy potential with template mixins. These will just let us drop the body of the mixin template into our struct. Combine that with the `mixin` function which will parse a string at compile time and output code and we get the full power of stringly typed programming.

```d
mixin template StateProperty(T, string Name)
{
    mixin(`private ` ~ T.stringof ~ ` _` ~ Name ~ `;
        @property ` ~ T.stringof ~ ` ` ~ Name ~ `() nothrow
        {
            synchronized
            {
                return _` ~ Name ~ `;
            }
        }

        @property void ` ~ Name ~ `(` ~ T.stringof ~ ` prop) nothrow
        {
            synchronized
            {
                _` ~ Name ~ ` = prop;
            }
        }`
    );
}
```

When expanded, this will create a private member variable (an opaque type means we can't access members here in a thread-unsafe manner) with a given type T and a given name prefixed with an "\_". Then create getter and setter property methods which retrieve or update the value of the variable within a mutex.

So from our state example above, the serverName variable would expand to the following when using `StateProperty`:

```d
private string _serverName;

@property string serverName() nothrow
{
    synchronized
    {
        return _serverName;
    }
}

@property void serverName(string prop) nothrow
{
    synchronized
    {
        _serverName = prop;
    }
}
```

But all it takes is one line of code, making this metaprogramming technique rather cost efficient and scalable. And of course we pay nothing for this at runtime when compared to hand writing all those awful getters and setters.

Note that we do pollute the namespace of the struct with the additional variables prefixed with underscores. Personally I find this an acceptable trade off.

So our updated struct code looks like the following:

```d
struct State
{
    mixin StateProperty!(string, "serverName");
    mixin StateProperty!(string, "accessToken");
    // ...
}
```

Finally, you could also alias the `StateProperty` within the struct body for shorter mixin template instantiations:

```d
struct State
{
    alias _ = StateProperty;
    mixin _!(/* ... */);
    // etc
}
```
