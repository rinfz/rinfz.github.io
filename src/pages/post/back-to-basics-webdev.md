---
title: Back to Basics Webdev
date: 2023-02-24
layout: ../../layouts/Post.astro
tags: programming, webdev, php
---

For just under 2 years now, I have had this on and off project which is a speed reading website. I have probably written about it a little bit in the past. At this point, I have implemented it in probably too many different ways, including 3 deployed versions. The first commit of the first version dates back to July 2021. Here are the different technologies I have used to implement various versions.

- Svelte
- Svelteit x2 (one deployed)
- Nim (POC)
- Python, React (fastapi, deployed)
- Python (django)
- Remix
- Laravel (partial)
- Elixir (partial)
- Rails (partial)
- Crystal (POC)
- C# (Blazor)
- C# (MAUI)
- C# (Avalonia UI)
- Clojure (cljfx)
- PHP (current, deployed)

So it's probably not a surprise to hear that I was pretty burnt out with this project. One of my consistent complaints was that everything just felt too heavy. I kept getting bogged down in too much housekeeping. That's not to say that the frameworks are bad though. For the appropriate projects, a lot of the infrastructure does make sense (I am eyeing up a new project using Elixir as I write this). But for a speed reader, it doesn't need to get complex at all. I say that now, but it's probably due to the fact I've had so many iterations of this project that I can say it's not complex. The design of this application has certainly changed a lot now compared to when I started writing it.

So, on a whim I decided to hack something together in PHP. I thought back to when I was writing websites as a teenager. I wrote one website when I was 13 which is still running to this day. And it's only needed one code update between then and now (alright a few more probably would have been good - the update itself was upgrading from PHP 5.x to 8.1 because the hosting provider dropped PHP 5 support). Even then, the change only took a few hours (mostly me trying to remember how to write PHP since I hadn't written any in the intervening 13 or so years).

The precedent was pretty strong, and it wasn't going to be much of a time investment even if it went nowhere. I set about writing the 2 pages required for users to submit documents and text and then read it. Everything sort of flooded back to me. Working with plain html forms has been a breath of fresh air after working for 2 or so years on a React code base at work (side note: one of the aspects that attracted me to try Remix, even though that does use React itself, the forms are well integrated into the http model). We still haven't really figured out how to do the forms properly in React at work, either! There were a couple of considerations which I had learnt from experience that helped me speed up this step.

Firstly, no user account system. It's a lot of complexity, adds additional attack vectors to the site, marginal benefit (especially since I wanted the whole UX of this version to be very low overhead) and requires a database and some way to send emails which I didn't want to set up. The user system may come at a later date but it's really not needed for a website whose primary objective revolves more around one off use cases. There is another route too, [local first webdev](https://localfirstweb.dev/) which offline usage and data syncing between clients. I really like the "user owns their data" aspect of this too. I don't need or want my users data (has copyright perks too - probably).

Secondly, persist data on the server in plain text files, and for the user data, in their browser's local storage. I don't need to store any meta data, so why add the hassle? One of the previous deployed versions was storing gz compressed binary blobs WITHIN the database itself. Like... what is a filesystem even for?! I definitely learnt from that one.

These two decisions allowed me to not use a database at all. I know local storage is flimsy/unreliable but it ties in nicely with the low overhead ethos. At some point I am going to try and add a way to sync or at least download that data in case a user wants to back it up or sync with another device. I should add that all of my decisions have been taken based on what I want out of the website. And to put myself in someone elses shoes, why would I really want to sign up to a site like this (at least this iteration of it anyway hah).

With the server side handled, I started implementing the frontend speed reader functionality. This has basically been stolen directly from the Remix version I wrote. Implemented in typescript (although I'm thinking of changing this to Rescript for fun - also es modules might be a nice alternative to the current janky setup I am using with a single file). It didn't take very long because I had written the same thing over and over again. It's all written by hand in vanilla js. Something which seems to be coming back in vogue a little bit (unfortunately though, it seems to be mostly from the aspect of crotchety old devs who refuse to learn modern webdev rather than people who really care about performance). HTMX was the only alternative I considered but the 12k min.gz was too heavyweight for what I wanted. I think the code ended up around 2kb in total. There was a bit of fiddling for hooking things up to localstorage but that's about it. The only thing I will say is that using lots of getElementById doesn't feel particularly robust or scalable. The alternative is probably a custom state manager though, which I did actually mock up in about 10 lines of code.

Of course all of this was also accompanied by tailwindcss. Truly the relevation of the modern era in my opinion. Certainly holds up for projects at a very small scale with tiny output sizes - well worth the effort it saves compared to writing vanilla css (haven't used it collaboratively or on a larger project - and I will say I have my reservations about this (but the killer workaround may just be scoping)).

The whole thing has been refreshing. Modern vanilla JS has more than enough features to implement good dynamic functionality on web pages these days. It's not directly comparable but lots of the JS stuff seems to be going back to SSR anyway, so I just took a different spin on it. And all of this is just a 1-click deploy with Ansible on to a VPS. No cloud bloat needed. PHP has improved over the years too. Now with a JIT and seemingly better integrated types than Python has, I think it's pretty compelling. I know that most people are using Laravel which sort of feels like a different standard library, but the builtin one seems fine. People love to bikeshed about that but it's mostly hot air from people who feel like complaining.

My take-away is probably that you need to pay attention to the costs of the abstractions and whether they are applicable to your goals. People mostly put programming language choice front and centre in this discussion but frameworks and libraries are certainly relevant too. If I ever decide to scale this and add features, it'll probably all fall apart. But that's fine - it's mostly about getting an MVP and shipping it. Once you have something actually deployed, the pressure really comes off and you can re-evaluate and refactor if necessary.