---
title: Building and deploying a site with SvelteKit and docker
date: 2021-07-26
layout: ../../layouts/Post.astro
tags: programming, web, svelte
---

## Tldr

Use [adapter-node](https://github.com/sveltejs/kit/tree/master/packages/adapter-node), build a docker image and host it anywhere you can figure out the configuration for.

If you want to read my life story instead, carry on.

## Intro

For a while at work, I've been building a full stack web app using React on the frontend. All in all it's not too bad really. The ecosystem is fantastic that's for sure. But when it comes to personal projects, I just can't resist a little experimentation.

I was playing around with the idea of writing a game based on electron (no longer the case, by the way - but it was enlightening). I didn't really fancy using something popular like React. Plus, based on benchmarks at the time, it was a little inefficient / bloated. That's when I came across [Svelte](https://svelte.dev). It seemed like it ticked all the boxes - lightweight, highly performant, good developer experience (by eschewing webpack - and at this current point using [Vite](https://vitejs.dev) which is lovely and quick). So I thought I'd definitely give it a punt.

Later on in time, after I had moved on from the idea of a game written with electron, I wanted to build a [little app for speed reading](https://swiftwpm.com). Svelte fit the bill perfectly here too. Not only Svelte, but now [SvelteKit](https://kit.svelte.dev) is a thing too. It's an application framework the same as [Next](https://nextjs.org) or [Nuxt](https://nuxtjs.org) but with all those perks like the small footprint which initially drew me to Svelte. They added a few other things too such as file based routing, code splitting, offline support, SSR and so on. There's a [talk and blog post](https://svelte.dev/blog/whats-the-deal-with-sveltekit) if you want to read more about it.

At this point, this is definitely my favourite way to build an web app or interactive website. Especially having access to a very easy to use server alongside for integration with node packages.

## Building

I won't go into massive amounts of detail since most of the other articles about SvelteKit right now just seem to use the example repo. This was pretty frustrating to me since I had built more functionality into my app before thinking about building. Generally their methods didn't work for my code. So I'm going to assume you have your SvelteKit site ready to go at this point. If not, you can run the example on their homepage:

```
$ npm init svelte@next my-app
$ cd my-app
$ npm i
$ npm run dev
```

The first step will put you in a wizard for setting up your project. If you just want to test deploying then go for the SvelteKit demo app, otherwise pick the skeleton project and add your stuff to that.

Since we're going to deploy using docker, we are going to be running our site with node (see: [adapters](https://kit.svelte.dev/docs#adapters)). The reason for this is even though there are other adapters available at the moment:

1. adapter-static won't support the server/api backend side of things and I am not interested in building a static site with SvelteKit (even though it's probably decent).
2. I tried all of: adapter-(vercel, netlify, cloudflare-workers, etc) and while they are a breeze to use, I had a lot of errors in actual deployment. For example, in vercel the serverless function would just completely crash with no warning message. In netlify, I got a warning message but it was to do with some package I can only assume was a very very deep dependency since I trawled npm a bit to try and find the relation and nothing came up - essentially I had no way to fix this.

Well if you can't get it working on their systems, bring your system to them: docker.

Back on topic - install [@sveltejs/adapter-node](https://github.com/sveltejs/kit/tree/master/packages/adapter-node) according to their readme, something like `npm i -D @sveltejs/adapter-node@next`. The `@next` is important (for now) - it wouldn't work for me without it.

Bosh out a little Dockerfile. The following worked for me (taken from somewhere else lost to the mists of time).

`Dockerfile`

```dockerfile
FROM node:14.17-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i --no-optional

COPY . .

RUN npm run build

FROM node:14.17-slim

WORKDIR /app
COPY --from=0 /app .
COPY . .

EXPOSE 3000
CMD ["node", "./build"]
```

Note: node images are interchangeable and node 14 will probably break everything if you're reading this in a month or two (ah, the joys of both javascript and using beta quality software - I wouldn't change it for the world).

## Deploying

Right, with a site and a Dockerfile setup it's time to stick it somewhere. I tried a lot of different options here but I went with the easiest since I'm lazy and too dumb to set things up properly. I already mentioned trying vercel and netlify and neither worked. I also tried Azure but lost motivation after trying for a few hours.

I ended up choosing [DigitalOcean](https://www.digitalocean.com/). I pretty much followed their new user wizard using their [App Platform](https://www.digitalocean.com/products/app-platform/). I just hooked it up to my github account, pointed it at the repo and it detected my Dockerfile and the default settings just worked. No hassle https and everything. This is my first time using DigitalOcean though and I'm not a guru so for any problems you'll have to look elsewhere.

If you don't fancy DO though, you've already got the site in a container so you can pretty much stick it anywhere that supports it. So no worries if you are already a whizz with ECS etc.

## Extras

I've also really been enjoying using [Tailwind CSS](https://tailwindcss.com/) lately. It really just takes all of the hassle out of working with css. It does have a little bit of a learning curve but I can assure you it's worth it - especially if you kind of just hate css.

Anyway, the reason I'm mentioning this is because I've found in other projects with React or Vue, setting up tailwind can be a bit of a pain, faffing around with various different config files (man, do js people LOVE config files). But with SvelteKit it's trivial using [svelte-add tailwind](https://github.com/svelte-add/tailwindcss). Just follow the instructions in their readme to set it up, but for me it was entirely just a case of running:

```
npx svelte-add@latest tailwindcss
```

Oh and by the way, if you wanted to check out my speed reading app, it's at [Swift](https://swiftwpm.com). Next step: build a phone app with SvelteKit!
