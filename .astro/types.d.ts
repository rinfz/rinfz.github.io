declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof typeof entryMap> =
		(typeof entryMap)[C][keyof (typeof entryMap)[C]] & Render;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<
				import('astro/zod').AnyZodObject,
				import('astro/zod').AnyZodObject
		  >;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	type BaseCollectionConfig<S extends BaseSchema> = {
		schema?: S;
		slug?: (entry: {
			id: CollectionEntry<keyof typeof entryMap>['id'];
			defaultSlug: string;
			collection: string;
			body: string;
			data: import('astro/zod').infer<S>;
		}) => string | Promise<string>;
	};
	export function defineCollection<S extends BaseSchema>(
		input: BaseCollectionConfig<S>
	): BaseCollectionConfig<S>;

	type EntryMapKeys = keyof typeof entryMap;
	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidEntrySlug<C extends EntryMapKeys> = AllValuesOf<(typeof entryMap)[C]>['slug'];

	export function getEntryBySlug<
		C extends keyof typeof entryMap,
		E extends ValidEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getCollection<C extends keyof typeof entryMap>(
		collection: C,
		filter?: (data: CollectionEntry<C>) => boolean
	): Promise<CollectionEntry<C>[]>;

	type InferEntrySchema<C extends keyof typeof entryMap> = import('astro/zod').infer<
		Required<ContentConfig['collections'][C]>['schema']
	>;

	type Render = {
		render(): Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	};

	const entryMap: {
		"link": {
"3d-cube-world-level-generation.md": {
  id: "3d-cube-world-level-generation.md",
  slug: "3d-cube-world-level-generation",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"7-langs-12-months.md": {
  id: "7-langs-12-months.md",
  slug: "7-langs-12-months",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"a-complete-guide-to-useeffect.md": {
  id: "a-complete-guide-to-useeffect.md",
  slug: "a-complete-guide-to-useeffect",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"a-high-performance-parallel-radio-coverage-prediction-tool-for-grass-gis.md": {
  id: "a-high-performance-parallel-radio-coverage-prediction-tool-for-grass-gis.md",
  slug: "a-high-performance-parallel-radio-coverage-prediction-tool-for-grass-gis",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"a-practical-theory-of-programming-(pdf).md": {
  id: "a-practical-theory-of-programming-(pdf).md",
  slug: "a-practical-theory-of-programming-pdf",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"a-walk-through-lightweight-blogging.md": {
  id: "a-walk-through-lightweight-blogging.md",
  slug: "a-walk-through-lightweight-blogging",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"ada-concurrency.md": {
  id: "ada-concurrency.md",
  slug: "ada-concurrency",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"advice-that-actually-worked-for-me.md": {
  id: "advice-that-actually-worked-for-me.md",
  slug: "advice-that-actually-worked-for-me",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"against-sql.md": {
  id: "against-sql.md",
  slug: "against-sql",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"algorithmica-_-hpc.md": {
  id: "algorithmica-_-hpc.md",
  slug: "algorithmica-_-hpc",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"alloy.md": {
  id: "alloy.md",
  slug: "alloy",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"an-integer-formula-for-fibonacci-numbers.md": {
  id: "an-integer-formula-for-fibonacci-numbers.md",
  slug: "an-integer-formula-for-fibonacci-numbers",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"an-io-efficient-parallel-implementation-of-an-r2-viewshed-algorithm-for-large-terrain-maps-on-a-cuda-gpu.md": {
  id: "an-io-efficient-parallel-implementation-of-an-r2-viewshed-algorithm-for-large-terrain-maps-on-a-cuda-gpu.md",
  slug: "an-io-efficient-parallel-implementation-of-an-r2-viewshed-algorithm-for-large-terrain-maps-on-a-cuda-gpu",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"are-you-user-friendly.md": {
  id: "are-you-user-friendly.md",
  slug: "are-you-user-friendly",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"aria2.md": {
  id: "aria2.md",
  slug: "aria2",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"assign-multiple-engineers-to-the-same-task.md": {
  id: "assign-multiple-engineers-to-the-same-task.md",
  slug: "assign-multiple-engineers-to-the-same-task",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"avl-tree-tutorial.md": {
  id: "avl-tree-tutorial.md",
  slug: "avl-tree-tutorial",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"beautiful-binary-search-d.md": {
  id: "beautiful-binary-search-d.md",
  slug: "beautiful-binary-search-d",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"beginning-raku-(pdf).md": {
  id: "beginning-raku-(pdf).md",
  slug: "beginning-raku-pdf",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"bison-manual-(pdf).md": {
  id: "bison-manual-(pdf).md",
  slug: "bison-manual-pdf",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"book_-daily-rituals.md": {
  id: "book_-daily-rituals.md",
  slug: "book_-daily-rituals",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"book_-the-now-habit.md": {
  id: "book_-the-now-habit.md",
  slug: "book_-the-now-habit",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"book_-the-war-of-art.md": {
  id: "book_-the-war-of-art.md",
  slug: "book_-the-war-of-art",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"brian-lovin---writing.md": {
  id: "brian-lovin---writing.md",
  slug: "brian-lovin---writing",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"building-a-desktop-app-using-svelte-and-electron.md": {
  id: "building-a-desktop-app-using-svelte-and-electron.md",
  slug: "building-a-desktop-app-using-svelte-and-electron",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"c++-frequently-questioned-answers.md": {
  id: "c++-frequently-questioned-answers.md",
  slug: "c-frequently-questioned-answers",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"c++20-concepts_-testing-constrained-functions.md": {
  id: "c++20-concepts_-testing-constrained-functions.md",
  slug: "c20-concepts_-testing-constrained-functions",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"cache-oblivious-algorithms-and-data-structures-(pdf).md": {
  id: "cache-oblivious-algorithms-and-data-structures-(pdf).md",
  slug: "cache-oblivious-algorithms-and-data-structures-pdf",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"calculus-made-easy.md": {
  id: "calculus-made-easy.md",
  slug: "calculus-made-easy",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"challenging-algorithms-and-data-structures-every-programmer-should-try.md": {
  id: "challenging-algorithms-and-data-structures-every-programmer-should-try.md",
  slug: "challenging-algorithms-and-data-structures-every-programmer-should-try",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"cmmi.md": {
  id: "cmmi.md",
  slug: "cmmi",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"code-browser.md": {
  id: "code-browser.md",
  slug: "code-browser",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"code-generation-with-templates.md": {
  id: "code-generation-with-templates.md",
  slug: "code-generation-with-templates",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"code-review-checklist.md": {
  id: "code-review-checklist.md",
  slug: "code-review-checklist",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"collection-of-good-talks_videos.md": {
  id: "collection-of-good-talks_videos.md",
  slug: "collection-of-good-talks_videos",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"complicated-haskell-words---isomorphism.md": {
  id: "complicated-haskell-words---isomorphism.md",
  slug: "complicated-haskell-words---isomorphism",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"component-programming-with-ranges.md": {
  id: "component-programming-with-ranges.md",
  slug: "component-programming-with-ranges",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"computational-geometry---algorithms-and-applications-(pdf).md": {
  id: "computational-geometry---algorithms-and-applications-(pdf).md",
  slug: "computational-geometry---algorithms-and-applications-pdf",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"continuous-distance-dependent-level-of-detail-for-rendering-heightmaps-(cdlod)-(pdf).md": {
  id: "continuous-distance-dependent-level-of-detail-for-rendering-heightmaps-(cdlod)-(pdf).md",
  slug: "continuous-distance-dependent-level-of-detail-for-rendering-heightmaps-cdlod-pdf",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"creating-a-language-using-only-assembly-language.md": {
  id: "creating-a-language-using-only-assembly-language.md",
  slug: "creating-a-language-using-only-assembly-language",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"dash_-a-new-language-for-declarative-behavioural-requirements-with-control-state-hierachy-(pdf).md": {
  id: "dash_-a-new-language-for-declarative-behavioural-requirements-with-control-state-hierachy-(pdf).md",
  slug: "dash_-a-new-language-for-declarative-behavioural-requirements-with-control-state-hierachy-pdf",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"david-mackay_-information-theory,-inference,-and-learning-algorithms.md": {
  id: "david-mackay_-information-theory,-inference,-and-learning-algorithms.md",
  slug: "david-mackay_-information-theory-inference-and-learning-algorithms",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"divisibility-by-7-is-a-walk-on-a-graph.md": {
  id: "divisibility-by-7-is-a-walk-on-a-graph.md",
  slug: "divisibility-by-7-is-a-walk-on-a-graph",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"docker-compose-production-best-practices.md": {
  id: "docker-compose-production-best-practices.md",
  slug: "docker-compose-production-best-practices",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"efficient-generation-of-simple-polygons-for-characterizing-the-shape-of-a-set-of-points-in-the-plane-(pdf).md": {
  id: "efficient-generation-of-simple-polygons-for-characterizing-the-shape-of-a-set-of-points-in-the-plane-(pdf).md",
  slug: "efficient-generation-of-simple-polygons-for-characterizing-the-shape-of-a-set-of-points-in-the-plane-pdf",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"effortless-personal-productivity.md": {
  id: "effortless-personal-productivity.md",
  slug: "effortless-personal-productivity",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"eiffel-standard-(pdf).md": {
  id: "eiffel-standard-(pdf).md",
  slug: "eiffel-standard-pdf",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"empirical-analysis-of-programming-language-adoption-(pdf).md": {
  id: "empirical-analysis-of-programming-language-adoption-(pdf).md",
  slug: "empirical-analysis-of-programming-language-adoption-pdf",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"failing-to-learn-zig-via-advent-of-code.md": {
  id: "failing-to-learn-zig-via-advent-of-code.md",
  slug: "failing-to-learn-zig-via-advent-of-code",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"fast-computation-of-generalized-voronoi-diagrams-using-graphics-hardware-(pdf).md": {
  id: "fast-computation-of-generalized-voronoi-diagrams-using-graphics-hardware-(pdf).md",
  slug: "fast-computation-of-generalized-voronoi-diagrams-using-graphics-hardware-pdf",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"finite-and-infinite-games-(pdf).md": {
  id: "finite-and-infinite-games-(pdf).md",
  slug: "finite-and-infinite-games-pdf",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"flex-manual-(pdf).md": {
  id: "flex-manual-(pdf).md",
  slug: "flex-manual-pdf",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"fortune's-algorithm_-the-details.md": {
  id: "fortune's-algorithm_-the-details.md",
  slug: "fortunes-algorithm_-the-details",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"freecad.md": {
  id: "freecad.md",
  slug: "freecad",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"fsharp-is-the-best-coding-language-today.md": {
  id: "fsharp-is-the-best-coding-language-today.md",
  slug: "fsharp-is-the-best-coding-language-today",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"functional-data-structures.md": {
  id: "functional-data-structures.md",
  slug: "functional-data-structures",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"functional-design-and-architecture.md": {
  id: "functional-design-and-architecture.md",
  slug: "functional-design-and-architecture",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"functional-programming-in-ocaml.md": {
  id: "functional-programming-in-ocaml.md",
  slug: "functional-programming-in-ocaml",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"functorio.md": {
  id: "functorio.md",
  slug: "functorio",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"game-engine-programming_-animation-groundwork.md": {
  id: "game-engine-programming_-animation-groundwork.md",
  slug: "game-engine-programming_-animation-groundwork",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"game-engine-programming_-animation-playback-(part-1).md": {
  id: "game-engine-programming_-animation-playback-(part-1).md",
  slug: "game-engine-programming_-animation-playback-part-1",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"game-of-life-(32b).md": {
  id: "game-of-life-(32b).md",
  slug: "game-of-life-32b",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"generating-call-graphs-for-understanding-and-refactoring-python-code.md": {
  id: "generating-call-graphs-for-understanding-and-refactoring-python-code.md",
  slug: "generating-call-graphs-for-understanding-and-refactoring-python-code",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"generating-json-directly-from-postgres.md": {
  id: "generating-json-directly-from-postgres.md",
  slug: "generating-json-directly-from-postgres",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"getting-started-with-org-mode.md": {
  id: "getting-started-with-org-mode.md",
  slug: "getting-started-with-org-mode",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"grass-raplat-user-guide-(pdf).md": {
  id: "grass-raplat-user-guide-(pdf).md",
  slug: "grass-raplat-user-guide-pdf",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"groups---a-primer.md": {
  id: "groups---a-primer.md",
  slug: "groups---a-primer",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"hash-visualisation-(pdf).md": {
  id: "hash-visualisation-(pdf).md",
  slug: "hash-visualisation-pdf",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"haskell-for-imperative-programmers.md": {
  id: "haskell-for-imperative-programmers.md",
  slug: "haskell-for-imperative-programmers",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"haskell-is-not-category-theory.md": {
  id: "haskell-is-not-category-theory.md",
  slug: "haskell-is-not-category-theory",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"havoc-(pdf).md": {
  id: "havoc-(pdf).md",
  slug: "havoc-pdf",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"how-the-blog-broke-the-web.md": {
  id: "how-the-blog-broke-the-web.md",
  slug: "how-the-blog-broke-the-web",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"how-to-build-static-checking-systems-using-orders-of-magnitude-less-code.md": {
  id: "how-to-build-static-checking-systems-using-orders-of-magnitude-less-code.md",
  slug: "how-to-build-static-checking-systems-using-orders-of-magnitude-less-code",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"how-to-design-a-chat-bot.md": {
  id: "how-to-design-a-chat-bot.md",
  slug: "how-to-design-a-chat-bot",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"how-to-get-rich.md": {
  id: "how-to-get-rich.md",
  slug: "how-to-get-rich",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"how-to-remember-everything-you'll-ever-learn.md": {
  id: "how-to-remember-everything-you'll-ever-learn.md",
  slug: "how-to-remember-everything-youll-ever-learn",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"how-to-solve-it.md": {
  id: "how-to-solve-it.md",
  slug: "how-to-solve-it",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"hyperscript.md": {
  id: "hyperscript.md",
  slug: "hyperscript",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"intentionally-making-close-friends.md": {
  id: "intentionally-making-close-friends.md",
  slug: "intentionally-making-close-friends",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"investing-advice-inspired-by-jack-bogle.md": {
  id: "investing-advice-inspired-by-jack-bogle.md",
  slug: "investing-advice-inspired-by-jack-bogle",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"lambda-you-keep-using-that-letter.md": {
  id: "lambda-you-keep-using-that-letter.md",
  slug: "lambda-you-keep-using-that-letter",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"lazy-functional-state-threads-(pdf).md": {
  id: "lazy-functional-state-threads-(pdf).md",
  slug: "lazy-functional-state-threads-pdf",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"learning-by-writing.md": {
  id: "learning-by-writing.md",
  slug: "learning-by-writing",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"learning-skills-you-can-practice.md": {
  id: "learning-skills-you-can-practice.md",
  slug: "learning-skills-you-can-practice",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"lessons-from-building-static-analysis-tools-at-google.md": {
  id: "lessons-from-building-static-analysis-tools-at-google.md",
  slug: "lessons-from-building-static-analysis-tools-at-google",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"links-to-ada-gems.md": {
  id: "links-to-ada-gems.md",
  slug: "links-to-ada-gems",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"making-the-world's-fastest-website,-and-other-mistakes.md": {
  id: "making-the-world's-fastest-website,-and-other-mistakes.md",
  slug: "making-the-worlds-fastest-website-and-other-mistakes",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"marian-petre-and-andre-van-der-hoek-on-software-design.md": {
  id: "marian-petre-and-andre-van-der-hoek-on-software-design.md",
  slug: "marian-petre-and-andre-van-der-hoek-on-software-design",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"maths-reading-list-(pdf).md": {
  id: "maths-reading-list-(pdf).md",
  slug: "maths-reading-list-pdf",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"mental-maths-prime-factorisation.md": {
  id: "mental-maths-prime-factorisation.md",
  slug: "mental-maths-prime-factorisation",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"modern-object-pascal-introduction-for-programmers.md": {
  id: "modern-object-pascal-introduction-for-programmers.md",
  slug: "modern-object-pascal-introduction-for-programmers",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"monadic-comprehension-via-linq.md": {
  id: "monadic-comprehension-via-linq.md",
  slug: "monadic-comprehension-via-linq",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"more-challenging-projects-every-programmer-should-try.md": {
  id: "more-challenging-projects-every-programmer-should-try.md",
  slug: "more-challenging-projects-every-programmer-should-try",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"my-future-with-elixir.md": {
  id: "my-future-with-elixir.md",
  slug: "my-future-with-elixir",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"noaa-satellite-signals-with-a-pvc-qfh-antenna-and-laptop.md": {
  id: "noaa-satellite-signals-with-a-pvc-qfh-antenna-and-laptop.md",
  slug: "noaa-satellite-signals-with-a-pvc-qfh-antenna-and-laptop",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"obsidian.md": {
  id: "obsidian.md",
  slug: "obsidian",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"on-technical-debt.md": {
  id: "on-technical-debt.md",
  slug: "on-technical-debt",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"on-the-shoulders-of-giants-(damian-conway).md": {
  id: "on-the-shoulders-of-giants-(damian-conway).md",
  slug: "on-the-shoulders-of-giants-damian-conway",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"only-solve-one-new-problem-at-a-time.md": {
  id: "only-solve-one-new-problem-at-a-time.md",
  slug: "only-solve-one-new-problem-at-a-time",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"open-logic-project.md": {
  id: "open-logic-project.md",
  slug: "open-logic-project",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"org-mode-reference-card-(pdf).md": {
  id: "org-mode-reference-card-(pdf).md",
  slug: "org-mode-reference-card-pdf",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"owasp-authentication-cheat-sheet.md": {
  id: "owasp-authentication-cheat-sheet.md",
  slug: "owasp-authentication-cheat-sheet",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"owasp-session-management-cheat-sheet.md": {
  id: "owasp-session-management-cheat-sheet.md",
  slug: "owasp-session-management-cheat-sheet",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"painless-functional-specs-(part-1-of-4).md": {
  id: "painless-functional-specs-(part-1-of-4).md",
  slug: "painless-functional-specs-part-1-of-4",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"perl,-the-first-postmodern-computer-language.md": {
  id: "perl,-the-first-postmodern-computer-language.md",
  slug: "perl-the-first-postmodern-computer-language",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"perlin-noise-explanation.md": {
  id: "perlin-noise-explanation.md",
  slug: "perlin-noise-explanation",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"pg_cron.md": {
  id: "pg_cron.md",
  slug: "pg_cron",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"pharo-by-example-5-(pdf).md": {
  id: "pharo-by-example-5-(pdf).md",
  slug: "pharo-by-example-5-pdf",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"polymorphism-in-python.md": {
  id: "polymorphism-in-python.md",
  slug: "polymorphism-in-python",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"postmodernism.md": {
  id: "postmodernism.md",
  slug: "postmodernism",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"precomputed-atmospheric-scattering.md": {
  id: "precomputed-atmospheric-scattering.md",
  slug: "precomputed-atmospheric-scattering",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"prefers-color-scheme.md": {
  id: "prefers-color-scheme.md",
  slug: "prefers-color-scheme",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"preql.md": {
  id: "preql.md",
  slug: "preql",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"programming-from-the-ground-up-(pdf).md": {
  id: "programming-from-the-ground-up-(pdf).md",
  slug: "programming-from-the-ground-up-pdf",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"programming-in-the-21st-century.md": {
  id: "programming-in-the-21st-century.md",
  slug: "programming-in-the-21st-century",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"protection-system-conceptual-design.md": {
  id: "protection-system-conceptual-design.md",
  slug: "protection-system-conceptual-design",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"pulumi.md": {
  id: "pulumi.md",
  slug: "pulumi",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"pycolorpalette.md": {
  id: "pycolorpalette.md",
  slug: "pycolorpalette",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"python-asyncio.md": {
  id: "python-asyncio.md",
  slug: "python-asyncio",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"r-trees-with-voronoi-diagrams-for-efficient-processing-of-spatial-nearest-neighbor-querie-(pdf).md": {
  id: "r-trees-with-voronoi-diagrams-for-efficient-processing-of-spatial-nearest-neighbor-querie-(pdf).md",
  slug: "r-trees-with-voronoi-diagrams-for-efficient-processing-of-spatial-nearest-neighbor-querie-pdf",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"re2c-manual.md": {
  id: "re2c-manual.md",
  slug: "re2c-manual",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"react-i-love-you,-but-you're-bringing-me-down.md": {
  id: "react-i-love-you,-but-you're-bringing-me-down.md",
  slug: "react-i-love-you-but-youre-bringing-me-down",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"recursive-permutations-|-programming-abstractions.md": {
  id: "recursive-permutations-|-programming-abstractions.md",
  slug: "recursive-permutations--programming-abstractions",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"redux-vs.-xstate.md": {
  id: "redux-vs.-xstate.md",
  slug: "redux-vs-xstate",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"rewrite-refactor-or-reinvent.md": {
  id: "rewrite-refactor-or-reinvent.md",
  slug: "rewrite-refactor-or-reinvent",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"right-and-wrote_-ten-choices-in-language-design-(pdf).md": {
  id: "right-and-wrote_-ten-choices-in-language-design-(pdf).md",
  slug: "right-and-wrote_-ten-choices-in-language-design-pdf",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"roam.md": {
  id: "roam.md",
  slug: "roam",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"ruby-for-the-self-taught-developer.md": {
  id: "ruby-for-the-self-taught-developer.md",
  slug: "ruby-for-the-self-taught-developer",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"serverless-sqlite.md": {
  id: "serverless-sqlite.md",
  slug: "serverless-sqlite",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"smooth-voxel-terrain.md": {
  id: "smooth-voxel-terrain.md",
  slug: "smooth-voxel-terrain",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"software-requirements-spec-(wiki).md": {
  id: "software-requirements-spec-(wiki).md",
  slug: "software-requirements-spec-wiki",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"software-verification_-model-checking-vs.-testing-(pdf).md": {
  id: "software-verification_-model-checking-vs.-testing-(pdf).md",
  slug: "software-verification_-model-checking-vs-testing-pdf",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"sokoban-10-lines.md": {
  id: "sokoban-10-lines.md",
  slug: "sokoban-10-lines",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"some-thoughts-on-security-after-ten-years-of-qmail-1.0-(pdf).md": {
  id: "some-thoughts-on-security-after-ten-years-of-qmail-1.0-(pdf).md",
  slug: "some-thoughts-on-security-after-ten-years-of-qmail-10-pdf",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"speed-reading-is-bullshit.md": {
  id: "speed-reading-is-bullshit.md",
  slug: "speed-reading-is-bullshit",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"surviving-disillusionment.md": {
  id: "surviving-disillusionment.md",
  slug: "surviving-disillusionment",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"terrain-erosion-3-ways.md": {
  id: "terrain-erosion-3-ways.md",
  slug: "terrain-erosion-3-ways",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"the-art-of-money-getting.md": {
  id: "the-art-of-money-getting.md",
  slug: "the-art-of-money-getting",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"the-art-of-not-thinking.md": {
  id: "the-art-of-not-thinking.md",
  slug: "the-art-of-not-thinking",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"the-case-for-frameworks.md": {
  id: "the-case-for-frameworks.md",
  slug: "the-case-for-frameworks",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"the-case-for-models.md": {
  id: "the-case-for-models.md",
  slug: "the-case-for-models",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"the-construction-and-use-of-c++-algorithms.md": {
  id: "the-construction-and-use-of-c++-algorithms.md",
  slug: "the-construction-and-use-of-c-algorithms",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"the-market-for-lemons.md": {
  id: "the-market-for-lemons.md",
  slug: "the-market-for-lemons",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"the-smalltalk-80-system.md": {
  id: "the-smalltalk-80-system.md",
  slug: "the-smalltalk-80-system",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"the-sound-of-space-filling-curves.md": {
  id: "the-sound-of-space-filling-curves.md",
  slug: "the-sound-of-space-filling-curves",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"the-surprising-rigidness-of-higher-rank-kinds.md": {
  id: "the-surprising-rigidness-of-higher-rank-kinds.md",
  slug: "the-surprising-rigidness-of-higher-rank-kinds",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"the-true-power-of-regular-expressions.md": {
  id: "the-true-power-of-regular-expressions.md",
  slug: "the-true-power-of-regular-expressions",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"to-compute-a-constant-of-calculus.md": {
  id: "to-compute-a-constant-of-calculus.md",
  slug: "to-compute-a-constant-of-calculus",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"traditional-assignment-considered-harmful-(pdf).md": {
  id: "traditional-assignment-considered-harmful-(pdf).md",
  slug: "traditional-assignment-considered-harmful-pdf",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"transitional-apps-with-phoenix-and-svelte.md": {
  id: "transitional-apps-with-phoenix-and-svelte.md",
  slug: "transitional-apps-with-phoenix-and-svelte",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"trpl-pdfs.md": {
  id: "trpl-pdfs.md",
  slug: "trpl-pdfs",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"typeclassopedia.md": {
  id: "typeclassopedia.md",
  slug: "typeclassopedia",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"umami.md": {
  id: "umami.md",
  slug: "umami",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"unbounded-sieve-of-eratosthenes.md": {
  id: "unbounded-sieve-of-eratosthenes.md",
  slug: "unbounded-sieve-of-eratosthenes",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"understanding-onion-architecture.md": {
  id: "understanding-onion-architecture.md",
  slug: "understanding-onion-architecture",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"use-constexpr-for-faster,-smaller,-and-safer-code.md": {
  id: "use-constexpr-for-faster,-smaller,-and-safer-code.md",
  slug: "use-constexpr-for-faster-smaller-and-safer-code",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"use-google-like-a-pro.md": {
  id: "use-google-like-a-pro.md",
  slug: "use-google-like-a-pro",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"what-to-blog-about.md": {
  id: "what-to-blog-about.md",
  slug: "what-to-blog-about",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"why-and-how-to-write-things-on-the-internet.md": {
  id: "why-and-how-to-write-things-on-the-internet.md",
  slug: "why-and-how-to-write-things-on-the-internet",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"word-numbers,-part-1_-billion-approaches.md": {
  id: "word-numbers,-part-1_-billion-approaches.md",
  slug: "word-numbers-part-1_-billion-approaches",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"work-is-work.md": {
  id: "work-is-work.md",
  slug: "work-is-work",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"working-in-godot-with-sqlite-and-csharp.md": {
  id: "working-in-godot-with-sqlite-and-csharp.md",
  slug: "working-in-godot-with-sqlite-and-csharp",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"write-code-that-is-easy-to-delete,-not-easy-to-extend.md": {
  id: "write-code-that-is-easy-to-delete,-not-easy-to-extend.md",
  slug: "write-code-that-is-easy-to-delete-not-easy-to-extend",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"write-up_-out-of-the-tar-pit.md": {
  id: "write-up_-out-of-the-tar-pit.md",
  slug: "write-up_-out-of-the-tar-pit",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"writing-by-hand-is-the-best-way-to-retain-information.md": {
  id: "writing-by-hand-is-the-best-way-to-retain-information.md",
  slug: "writing-by-hand-is-the-best-way-to-retain-information",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
"zettelkasten.md": {
  id: "zettelkasten.md",
  slug: "zettelkasten",
  body: string,
  collection: "link",
  data: InferEntrySchema<"link">
},
},

	};

	type ContentConfig = typeof import("../src/content/config");
}
