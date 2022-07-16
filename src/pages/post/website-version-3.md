---
title: b5 version 3 (in nim)
date: 2021-01-14
layout: ../../layouts/Post.astro
tags: programming, nim
---

Another installment in the long line of barely laughing websites has arrived - version three! This one
is build with a brand spanking (170 ish line) static site generator written in my chosen lang du jour: [nim](https://nim-lang.org/).
I'm looking to get as much experience with nim as possible since I'm planning on undertaking a larger
project using it shortly in the future.

Along with chat bots (the kind that run on chat protocols and in chatrooms for amusement purposes), static
site generators are one of my favourite projects to go to when checking out a new language. You have a
very clear goal to achieve and one which can be completed in a short amount of time because the bare minimum
scope of a static website is essentially just writing text to files. It's one of those projects that has
a nice and visual outcome and you get a good kick out of having a website like this to boot.

Nim comes with a batteries included stdlib akin to python (though in my opinion - better). This contrast
is a welcome one coming from D (which version 2 of this website was written in). Basically it made getting
up and running a breeze without having to look to far for 3rd party libraries (even though that's also
easy with nim). The stdlib is well documented as you would expect for a language of this size, but it is
still welcome either way.

I decided to use a mild alteration to markdown for post files by adding tags marked with an `@` symbol.
These are both used for including metadata in posts such as the title and date which they were written,
and also for including code snippets. Even though it's simple, I still found the code for preprocessing
the posts to be quite succinct. It runs a scan over every line in the md post files looking for these tags
and either extracts the data or in the case of snippets, finds the relevant file and inserts it. This
gives the benefit of having snippets being implemented as proper source files and having them be runnable
as standalone files/scripts/apps etc. as well as keeping the code nicely decoupled from the articles themselves.

Here is the snippet for preprocessing the files:

```nim
proc parseSnippet = discard  # omitted for the purposes of the post

proc processPost(path: string): Post =
  # posts have their own dir and the text for each is always in post.md
  for line in lines(joinPath(path, "post.md")):
    var tag, tagBody: string
    if line.scanf("@$w $*", tag, tagBody):  # scan each line in the post looking for @<tag>
      case tag:
        of "title": # matches @title
          result.header.title = tagBody
        of "date": # similar
          result.header.date = tagBody
        of "snippet": # similar
          result.body &= parseSnippet(path, tagBody)
        else:
          doAssert(false, "unknown tag: " & tag)
    else:
      result.body &= line & '\n'
```

I feel that the case statement for each type of tag skips a lot of the line noise you tend to get with
either `switch` statements (`break`) or the monolith of `if`/`else` statements you get in python.

`result` is implicitly created in procs which have a return type. This allows you to skip the "boilerplate"
of initialising a result variable in every function - it's not much but I quite like it. You can overwrite
the result variable by introducing it as a `let` or `var` binding though, if you desire.

Anyway, that's enough rambling but basically, nim is pretty nice and a bit of fresh air compared to D (which
I've been writing on and off for about 6 years now). I've got what seems to have the potential to be
a nice setup with nim in another project that I'll talk about some other time, but I'm feeling hopeful. And
it was cool to get all of this done in an evening too!
