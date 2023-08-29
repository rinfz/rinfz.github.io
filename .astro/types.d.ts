declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;
	export type CollectionEntry<C extends keyof AnyEntryMap> = Flatten<AnyEntryMap[C]>;

	// TODO: Remove this when having this fallback is no longer relevant. 2.3? 3.0? - erika, 2023-04-04
	/**
	 * @deprecated
	 * `astro:content` no longer provide `image()`.
	 *
	 * Please use it through `schema`, like such:
	 * ```ts
	 * import { defineCollection, z } from "astro:content";
	 *
	 * defineCollection({
	 *   schema: ({ image }) =>
	 *     z.object({
	 *       image: image(),
	 *     }),
	 * });
	 * ```
	 */
	export const image: never;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>
			]
		>;
	}>;

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

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"link": {
"3d-cube-world-level-generation.md": {
	id: "3d-cube-world-level-generation.md";
  slug: "3d-cube-world-level-generation";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"7-langs-12-months.md": {
	id: "7-langs-12-months.md";
  slug: "7-langs-12-months";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"916-days-of-emacs.md": {
	id: "916-days-of-emacs.md";
  slug: "916-days-of-emacs";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"a-complete-guide-to-useeffect.md": {
	id: "a-complete-guide-to-useeffect.md";
  slug: "a-complete-guide-to-useeffect";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"a-high-performance-parallel-radio-coverage-prediction-tool-for-grass-gis.md": {
	id: "a-high-performance-parallel-radio-coverage-prediction-tool-for-grass-gis.md";
  slug: "a-high-performance-parallel-radio-coverage-prediction-tool-for-grass-gis";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"a-practical-theory-of-programming-(pdf).md": {
	id: "a-practical-theory-of-programming-(pdf).md";
  slug: "a-practical-theory-of-programming-pdf";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"a-walk-through-lightweight-blogging.md": {
	id: "a-walk-through-lightweight-blogging.md";
  slug: "a-walk-through-lightweight-blogging";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"ada-concurrency.md": {
	id: "ada-concurrency.md";
  slug: "ada-concurrency";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"advice-that-actually-worked-for-me.md": {
	id: "advice-that-actually-worked-for-me.md";
  slug: "advice-that-actually-worked-for-me";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"against-sql.md": {
	id: "against-sql.md";
  slug: "against-sql";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"algorithmica-_-hpc.md": {
	id: "algorithmica-_-hpc.md";
  slug: "algorithmica-_-hpc";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"all-you-need-is-data-and-functions.md": {
	id: "all-you-need-is-data-and-functions.md";
  slug: "all-you-need-is-data-and-functions";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"alloy.md": {
	id: "alloy.md";
  slug: "alloy";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"an-integer-formula-for-fibonacci-numbers.md": {
	id: "an-integer-formula-for-fibonacci-numbers.md";
  slug: "an-integer-formula-for-fibonacci-numbers";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"an-io-efficient-parallel-implementation-of-an-r2-viewshed-algorithm-for-large-terrain-maps-on-a-cuda-gpu.md": {
	id: "an-io-efficient-parallel-implementation-of-an-r2-viewshed-algorithm-for-large-terrain-maps-on-a-cuda-gpu.md";
  slug: "an-io-efficient-parallel-implementation-of-an-r2-viewshed-algorithm-for-large-terrain-maps-on-a-cuda-gpu";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"an-on-ramp-to-flow.md": {
	id: "an-on-ramp-to-flow.md";
  slug: "an-on-ramp-to-flow";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"are-you-user-friendly.md": {
	id: "are-you-user-friendly.md";
  slug: "are-you-user-friendly";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"aria2.md": {
	id: "aria2.md";
  slug: "aria2";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"assign-multiple-engineers-to-the-same-task.md": {
	id: "assign-multiple-engineers-to-the-same-task.md";
  slug: "assign-multiple-engineers-to-the-same-task";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"avl-tree-tutorial.md": {
	id: "avl-tree-tutorial.md";
  slug: "avl-tree-tutorial";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"beautiful-binary-search-d.md": {
	id: "beautiful-binary-search-d.md";
  slug: "beautiful-binary-search-d";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"beginning-raku-(pdf).md": {
	id: "beginning-raku-(pdf).md";
  slug: "beginning-raku-pdf";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"bison-manual-(pdf).md": {
	id: "bison-manual-(pdf).md";
  slug: "bison-manual-pdf";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"book_-daily-rituals.md": {
	id: "book_-daily-rituals.md";
  slug: "book_-daily-rituals";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"book_-the-now-habit.md": {
	id: "book_-the-now-habit.md";
  slug: "book_-the-now-habit";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"book_-the-war-of-art.md": {
	id: "book_-the-war-of-art.md";
  slug: "book_-the-war-of-art";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"brian-lovin---writing.md": {
	id: "brian-lovin---writing.md";
  slug: "brian-lovin---writing";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"building-a-desktop-app-using-svelte-and-electron.md": {
	id: "building-a-desktop-app-using-svelte-and-electron.md";
  slug: "building-a-desktop-app-using-svelte-and-electron";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"building-a-programming-language-in-twenty-four-hours.md": {
	id: "building-a-programming-language-in-twenty-four-hours.md";
  slug: "building-a-programming-language-in-twenty-four-hours";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"c++-frequently-questioned-answers.md": {
	id: "c++-frequently-questioned-answers.md";
  slug: "c-frequently-questioned-answers";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"c++20-concepts_-testing-constrained-functions.md": {
	id: "c++20-concepts_-testing-constrained-functions.md";
  slug: "c20-concepts_-testing-constrained-functions";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"cache-oblivious-algorithms-and-data-structures-(pdf).md": {
	id: "cache-oblivious-algorithms-and-data-structures-(pdf).md";
  slug: "cache-oblivious-algorithms-and-data-structures-pdf";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"caddy.md": {
	id: "caddy.md";
  slug: "caddy";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"calculus-made-easy.md": {
	id: "calculus-made-easy.md";
  slug: "calculus-made-easy";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"category-theory-illustrated---index.md": {
	id: "category-theory-illustrated---index.md";
  slug: "category-theory-illustrated---index";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"challenging-algorithms-and-data-structures-every-programmer-should-try.md": {
	id: "challenging-algorithms-and-data-structures-every-programmer-should-try.md";
  slug: "challenging-algorithms-and-data-structures-every-programmer-should-try";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"characterizing-tech-debt.md": {
	id: "characterizing-tech-debt.md";
  slug: "characterizing-tech-debt";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"cmmi.md": {
	id: "cmmi.md";
  slug: "cmmi";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"code-browser.md": {
	id: "code-browser.md";
  slug: "code-browser";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"code-generation-with-templates.md": {
	id: "code-generation-with-templates.md";
  slug: "code-generation-with-templates";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"code-review-checklist.md": {
	id: "code-review-checklist.md";
  slug: "code-review-checklist";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"coding-challenges.md": {
	id: "coding-challenges.md";
  slug: "coding-challenges";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"collection-of-good-talks_videos.md": {
	id: "collection-of-good-talks_videos.md";
  slug: "collection-of-good-talks_videos";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"combinatory-logic.md": {
	id: "combinatory-logic.md";
  slug: "combinatory-logic";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"complicated-haskell-words---isomorphism.md": {
	id: "complicated-haskell-words---isomorphism.md";
  slug: "complicated-haskell-words---isomorphism";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"component-programming-with-ranges.md": {
	id: "component-programming-with-ranges.md";
  slug: "component-programming-with-ranges";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"computational-geometry---algorithms-and-applications-(pdf).md": {
	id: "computational-geometry---algorithms-and-applications-(pdf).md";
  slug: "computational-geometry---algorithms-and-applications-pdf";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"continuous-distance-dependent-level-of-detail-for-rendering-heightmaps-(cdlod)-(pdf).md": {
	id: "continuous-distance-dependent-level-of-detail-for-rendering-heightmaps-(cdlod)-(pdf).md";
  slug: "continuous-distance-dependent-level-of-detail-for-rendering-heightmaps-cdlod-pdf";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"creating-a-language-using-only-assembly-language.md": {
	id: "creating-a-language-using-only-assembly-language.md";
  slug: "creating-a-language-using-only-assembly-language";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"dash_-a-new-language-for-declarative-behavioural-requirements-with-control-state-hierachy-(pdf).md": {
	id: "dash_-a-new-language-for-declarative-behavioural-requirements-with-control-state-hierachy-(pdf).md";
  slug: "dash_-a-new-language-for-declarative-behavioural-requirements-with-control-state-hierachy-pdf";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"david-mackay_-information-theory,-inference,-and-learning-algorithms.md": {
	id: "david-mackay_-information-theory,-inference,-and-learning-algorithms.md";
  slug: "david-mackay_-information-theory-inference-and-learning-algorithms";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"demystifying-type-classes.md": {
	id: "demystifying-type-classes.md";
  slug: "demystifying-type-classes";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"divisibility-by-7-is-a-walk-on-a-graph.md": {
	id: "divisibility-by-7-is-a-walk-on-a-graph.md";
  slug: "divisibility-by-7-is-a-walk-on-a-graph";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"docker-compose-production-best-practices.md": {
	id: "docker-compose-production-best-practices.md";
  slug: "docker-compose-production-best-practices";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"dream-tidy-web-framework-for-ocaml-and-reasonml.md": {
	id: "dream-tidy-web-framework-for-ocaml-and-reasonml.md";
  slug: "dream-tidy-web-framework-for-ocaml-and-reasonml";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"edward-tufte-books---envisioning-information.md": {
	id: "edward-tufte-books---envisioning-information.md";
  slug: "edward-tufte-books---envisioning-information";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"efficient-generation-of-simple-polygons-for-characterizing-the-shape-of-a-set-of-points-in-the-plane-(pdf).md": {
	id: "efficient-generation-of-simple-polygons-for-characterizing-the-shape-of-a-set-of-points-in-the-plane-(pdf).md";
  slug: "efficient-generation-of-simple-polygons-for-characterizing-the-shape-of-a-set-of-points-in-the-plane-pdf";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"effortless-personal-productivity.md": {
	id: "effortless-personal-productivity.md";
  slug: "effortless-personal-productivity";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"eiffel-standard-(pdf).md": {
	id: "eiffel-standard-(pdf).md";
  slug: "eiffel-standard-pdf";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"elixir-for-cynical-curmudgeons.md": {
	id: "elixir-for-cynical-curmudgeons.md";
  slug: "elixir-for-cynical-curmudgeons";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"empirical-analysis-of-programming-language-adoption-(pdf).md": {
	id: "empirical-analysis-of-programming-language-adoption-(pdf).md";
  slug: "empirical-analysis-of-programming-language-adoption-pdf";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"explore-the-in-our-time-archive-braggoscope.md": {
	id: "explore-the-in-our-time-archive-braggoscope.md";
  slug: "explore-the-in-our-time-archive-braggoscope";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"failing-to-learn-zig-via-advent-of-code.md": {
	id: "failing-to-learn-zig-via-advent-of-code.md";
  slug: "failing-to-learn-zig-via-advent-of-code";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"fast-computation-of-generalized-voronoi-diagrams-using-graphics-hardware-(pdf).md": {
	id: "fast-computation-of-generalized-voronoi-diagrams-using-graphics-hardware-(pdf).md";
  slug: "fast-computation-of-generalized-voronoi-diagrams-using-graphics-hardware-pdf";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"fear-of-macros.md": {
	id: "fear-of-macros.md";
  slug: "fear-of-macros";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"finite-and-infinite-games-(pdf).md": {
	id: "finite-and-infinite-games-(pdf).md";
  slug: "finite-and-infinite-games-pdf";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"first-principles-of-interaction-design.md": {
	id: "first-principles-of-interaction-design.md";
  slug: "first-principles-of-interaction-design";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"flex-manual-(pdf).md": {
	id: "flex-manual-(pdf).md";
  slug: "flex-manual-pdf";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"forth-the-programming-language-that-writes-itself-the-web-page.md": {
	id: "forth-the-programming-language-that-writes-itself-the-web-page.md";
  slug: "forth-the-programming-language-that-writes-itself-the-web-page";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"fortune's-algorithm_-the-details.md": {
	id: "fortune's-algorithm_-the-details.md";
  slug: "fortunes-algorithm_-the-details";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"fortune-s-algorithm-the-details.md": {
	id: "fortune-s-algorithm-the-details.md";
  slug: "fortune-s-algorithm-the-details";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"fortunes-algorithm-an-intuitive-explanation.md": {
	id: "fortunes-algorithm-an-intuitive-explanation.md";
  slug: "fortunes-algorithm-an-intuitive-explanation";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"fortunes-algorithm-part-2-some-implementation-details.md": {
	id: "fortunes-algorithm-part-2-some-implementation-details.md";
  slug: "fortunes-algorithm-part-2-some-implementation-details";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"freecad.md": {
	id: "freecad.md";
  slug: "freecad";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"fsharp-is-the-best-coding-language-today.md": {
	id: "fsharp-is-the-best-coding-language-today.md";
  slug: "fsharp-is-the-best-coding-language-today";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"functional-data-structures.md": {
	id: "functional-data-structures.md";
  slug: "functional-data-structures";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"functional-design-and-architecture.md": {
	id: "functional-design-and-architecture.md";
  slug: "functional-design-and-architecture";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"functional-programming-in-ocaml.md": {
	id: "functional-programming-in-ocaml.md";
  slug: "functional-programming-in-ocaml";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"functorio.md": {
	id: "functorio.md";
  slug: "functorio";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"game-engine-programming_-animation-groundwork.md": {
	id: "game-engine-programming_-animation-groundwork.md";
  slug: "game-engine-programming_-animation-groundwork";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"game-engine-programming_-animation-playback-(part-1).md": {
	id: "game-engine-programming_-animation-playback-(part-1).md";
  slug: "game-engine-programming_-animation-playback-part-1";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"game-of-life-(32b).md": {
	id: "game-of-life-(32b).md";
  slug: "game-of-life-32b";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"generating-call-graphs-for-understanding-and-refactoring-python-code.md": {
	id: "generating-call-graphs-for-understanding-and-refactoring-python-code.md";
  slug: "generating-call-graphs-for-understanding-and-refactoring-python-code";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"generating-json-directly-from-postgres.md": {
	id: "generating-json-directly-from-postgres.md";
  slug: "generating-json-directly-from-postgres";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"getting-started-with-org-mode.md": {
	id: "getting-started-with-org-mode.md";
  slug: "getting-started-with-org-mode";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"git-magic-preface.md": {
	id: "git-magic-preface.md";
  slug: "git-magic-preface";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"github---rhasspy-piper--a-fast--local-neural-text-to-speech-system.md": {
	id: "github---rhasspy-piper--a-fast--local-neural-text-to-speech-system.md";
  slug: "github---rhasspy-piper--a-fast--local-neural-text-to-speech-system";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"grass-raplat-user-guide-(pdf).md": {
	id: "grass-raplat-user-guide-(pdf).md";
  slug: "grass-raplat-user-guide-pdf";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"groups---a-primer.md": {
	id: "groups---a-primer.md";
  slug: "groups---a-primer";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"hash-visualisation-(pdf).md": {
	id: "hash-visualisation-(pdf).md";
  slug: "hash-visualisation-pdf";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"haskell-fan-site.md": {
	id: "haskell-fan-site.md";
  slug: "haskell-fan-site";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"haskell-for-imperative-programmers.md": {
	id: "haskell-for-imperative-programmers.md";
  slug: "haskell-for-imperative-programmers";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"haskell-is-not-category-theory.md": {
	id: "haskell-is-not-category-theory.md";
  slug: "haskell-is-not-category-theory";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"havoc-(pdf).md": {
	id: "havoc-(pdf).md";
  slug: "havoc-pdf";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"how-the-blog-broke-the-web.md": {
	id: "how-the-blog-broke-the-web.md";
  slug: "how-the-blog-broke-the-web";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"how-to-build-static-checking-systems-using-orders-of-magnitude-less-code.md": {
	id: "how-to-build-static-checking-systems-using-orders-of-magnitude-less-code.md";
  slug: "how-to-build-static-checking-systems-using-orders-of-magnitude-less-code";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"how-to-design-a-chat-bot.md": {
	id: "how-to-design-a-chat-bot.md";
  slug: "how-to-design-a-chat-bot";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"how-to-get-rich.md": {
	id: "how-to-get-rich.md";
  slug: "how-to-get-rich";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"how-to-remember-everything-you'll-ever-learn.md": {
	id: "how-to-remember-everything-you'll-ever-learn.md";
  slug: "how-to-remember-everything-youll-ever-learn";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"how-to-roman-republic-101-part-i-spqr.md": {
	id: "how-to-roman-republic-101-part-i-spqr.md";
  slug: "how-to-roman-republic-101-part-i-spqr";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"how-to-solve-it.md": {
	id: "how-to-solve-it.md";
  slug: "how-to-solve-it";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"how-to-survive-your-project-s-first-100-000-lines.md": {
	id: "how-to-survive-your-project-s-first-100-000-lines.md";
  slug: "how-to-survive-your-project-s-first-100-000-lines";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"hyperscript.md": {
	id: "hyperscript.md";
  slug: "hyperscript";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"imaginary-problems-are-the-root-of-bad-software.md": {
	id: "imaginary-problems-are-the-root-of-bad-software.md";
  slug: "imaginary-problems-are-the-root-of-bad-software";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"intentionally-making-close-friends.md": {
	id: "intentionally-making-close-friends.md";
  slug: "intentionally-making-close-friends";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"investing-advice-inspired-by-jack-bogle.md": {
	id: "investing-advice-inspired-by-jack-bogle.md";
  slug: "investing-advice-inspired-by-jack-bogle";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"it-s-2023-so-of-course-i-m-learning-common-lisp.md": {
	id: "it-s-2023-so-of-course-i-m-learning-common-lisp.md";
  slug: "it-s-2023-so-of-course-i-m-learning-common-lisp";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"its-worth-putting-in-the-effort-to-update-deps.md": {
	id: "its-worth-putting-in-the-effort-to-update-deps.md";
  slug: "its-worth-putting-in-the-effort-to-update-deps";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"janet-for-mortals.md": {
	id: "janet-for-mortals.md";
  slug: "janet-for-mortals";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"je-ne-sais-quoi.md": {
	id: "je-ne-sais-quoi.md";
  slug: "je-ne-sais-quoi";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"kata-kumite-koan-and-dreyfus-codekata.md": {
	id: "kata-kumite-koan-and-dreyfus-codekata.md";
  slug: "kata-kumite-koan-and-dreyfus-codekata";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"lambda-you-keep-using-that-letter.md": {
	id: "lambda-you-keep-using-that-letter.md";
  slug: "lambda-you-keep-using-that-letter";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"laws-of-ux.md": {
	id: "laws-of-ux.md";
  slug: "laws-of-ux";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"lazy-functional-state-threads-(pdf).md": {
	id: "lazy-functional-state-threads-(pdf).md";
  slug: "lazy-functional-state-threads-pdf";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"learning-by-writing.md": {
	id: "learning-by-writing.md";
  slug: "learning-by-writing";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"learning-skills-you-can-practice.md": {
	id: "learning-skills-you-can-practice.md";
  slug: "learning-skills-you-can-practice";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"leaving-haskell-behind.md": {
	id: "leaving-haskell-behind.md";
  slug: "leaving-haskell-behind";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"lessons-from-building-static-analysis-tools-at-google.md": {
	id: "lessons-from-building-static-analysis-tools-at-google.md";
  slug: "lessons-from-building-static-analysis-tools-at-google";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"links-to-ada-gems.md": {
	id: "links-to-ada-gems.md";
  slug: "links-to-ada-gems";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"litestream-streaming-sqlite-replication.md": {
	id: "litestream-streaming-sqlite-replication.md";
  slug: "litestream-streaming-sqlite-replication";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"local-state-is-harmful.md": {
	id: "local-state-is-harmful.md";
  slug: "local-state-is-harmful";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"making-the-world's-fastest-website,-and-other-mistakes.md": {
	id: "making-the-world's-fastest-website,-and-other-mistakes.md";
  slug: "making-the-worlds-fastest-website-and-other-mistakes";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"marian-petre-and-andre-van-der-hoek-on-software-design.md": {
	id: "marian-petre-and-andre-van-der-hoek-on-software-design.md";
  slug: "marian-petre-and-andre-van-der-hoek-on-software-design";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"maths-reading-list-(pdf).md": {
	id: "maths-reading-list-(pdf).md";
  slug: "maths-reading-list-pdf";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"mental-liquidity.md": {
	id: "mental-liquidity.md";
  slug: "mental-liquidity";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"mental-maths-prime-factorisation.md": {
	id: "mental-maths-prime-factorisation.md";
  slug: "mental-maths-prime-factorisation";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"modern-object-pascal-introduction-for-programmers.md": {
	id: "modern-object-pascal-introduction-for-programmers.md";
  slug: "modern-object-pascal-introduction-for-programmers";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"modules-matter-most--for-the-masses.md": {
	id: "modules-matter-most--for-the-masses.md";
  slug: "modules-matter-most--for-the-masses";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"monadic-comprehension-via-linq.md": {
	id: "monadic-comprehension-via-linq.md";
  slug: "monadic-comprehension-via-linq";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"more-challenging-projects-every-programmer-should-try.md": {
	id: "more-challenging-projects-every-programmer-should-try.md";
  slug: "more-challenging-projects-every-programmer-should-try";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"my-future-with-elixir.md": {
	id: "my-future-with-elixir.md";
  slug: "my-future-with-elixir";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"noaa-satellite-signals-with-a-pvc-qfh-antenna-and-laptop.md": {
	id: "noaa-satellite-signals-with-a-pvc-qfh-antenna-and-laptop.md";
  slug: "noaa-satellite-signals-with-a-pvc-qfh-antenna-and-laptop";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"obsidian.md": {
	id: "obsidian.md";
  slug: "obsidian";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"ocaml-textbook.md": {
	id: "ocaml-textbook.md";
  slug: "ocaml-textbook";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"on-technical-debt.md": {
	id: "on-technical-debt.md";
  slug: "on-technical-debt";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"on-the-shoulders-of-giants-(damian-conway).md": {
	id: "on-the-shoulders-of-giants-(damian-conway).md";
  slug: "on-the-shoulders-of-giants-damian-conway";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"only-solve-one-new-problem-at-a-time.md": {
	id: "only-solve-one-new-problem-at-a-time.md";
  slug: "only-solve-one-new-problem-at-a-time";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"oop-vs-type-classes-haskellwiki.md": {
	id: "oop-vs-type-classes-haskellwiki.md";
  slug: "oop-vs-type-classes-haskellwiki";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"open-logic-project.md": {
	id: "open-logic-project.md";
  slug: "open-logic-project";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"org-mode-reference-card-(pdf).md": {
	id: "org-mode-reference-card-(pdf).md";
  slug: "org-mode-reference-card-pdf";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"owasp-authentication-cheat-sheet.md": {
	id: "owasp-authentication-cheat-sheet.md";
  slug: "owasp-authentication-cheat-sheet";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"owasp-session-management-cheat-sheet.md": {
	id: "owasp-session-management-cheat-sheet.md";
  slug: "owasp-session-management-cheat-sheet";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"painless-functional-specs-(part-1-of-4).md": {
	id: "painless-functional-specs-(part-1-of-4).md";
  slug: "painless-functional-specs-part-1-of-4";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"perl,-the-first-postmodern-computer-language.md": {
	id: "perl,-the-first-postmodern-computer-language.md";
  slug: "perl-the-first-postmodern-computer-language";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"perlin-noise-explanation.md": {
	id: "perlin-noise-explanation.md";
  slug: "perlin-noise-explanation";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"pg_cron.md": {
	id: "pg_cron.md";
  slug: "pg_cron";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"pharo-by-example-5-(pdf).md": {
	id: "pharo-by-example-5-(pdf).md";
  slug: "pharo-by-example-5-pdf";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"polymorphism-in-python.md": {
	id: "polymorphism-in-python.md";
  slug: "polymorphism-in-python";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"postmodernism.md": {
	id: "postmodernism.md";
  slug: "postmodernism";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"precomputed-atmospheric-scattering.md": {
	id: "precomputed-atmospheric-scattering.md";
  slug: "precomputed-atmospheric-scattering";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"prefers-color-scheme.md": {
	id: "prefers-color-scheme.md";
  slug: "prefers-color-scheme";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"preql.md": {
	id: "preql.md";
  slug: "preql";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"programming-from-the-ground-up-(pdf).md": {
	id: "programming-from-the-ground-up-(pdf).md";
  slug: "programming-from-the-ground-up-pdf";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"programming-in-the-21st-century.md": {
	id: "programming-in-the-21st-century.md";
  slug: "programming-in-the-21st-century";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"protection-system-conceptual-design.md": {
	id: "protection-system-conceptual-design.md";
  slug: "protection-system-conceptual-design";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"pulumi.md": {
	id: "pulumi.md";
  slug: "pulumi";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"pycolorpalette.md": {
	id: "pycolorpalette.md";
  slug: "pycolorpalette";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"python-asyncio.md": {
	id: "python-asyncio.md";
  slug: "python-asyncio";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"r-trees-with-voronoi-diagrams-for-efficient-processing-of-spatial-nearest-neighbor-querie-(pdf).md": {
	id: "r-trees-with-voronoi-diagrams-for-efficient-processing-of-spatial-nearest-neighbor-querie-(pdf).md";
  slug: "r-trees-with-voronoi-diagrams-for-efficient-processing-of-spatial-nearest-neighbor-querie-pdf";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"radical-simplicity-in-technology.md": {
	id: "radical-simplicity-in-technology.md";
  slug: "radical-simplicity-in-technology";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"raku-is-pretty-damn-cool.md": {
	id: "raku-is-pretty-damn-cool.md";
  slug: "raku-is-pretty-damn-cool";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"re2c-manual.md": {
	id: "re2c-manual.md";
  slug: "re2c-manual";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"react-i-love-you,-but-you're-bringing-me-down.md": {
	id: "react-i-love-you,-but-you're-bringing-me-down.md";
  slug: "react-i-love-you-but-youre-bringing-me-down";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"reading-slightly-more-incrementally.md": {
	id: "reading-slightly-more-incrementally.md";
  slug: "reading-slightly-more-incrementally";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"recursive-permutations-|-programming-abstractions.md": {
	id: "recursive-permutations-|-programming-abstractions.md";
  slug: "recursive-permutations--programming-abstractions";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"redux-vs.-xstate.md": {
	id: "redux-vs.-xstate.md";
  slug: "redux-vs-xstate";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"rewrite-refactor-or-reinvent.md": {
	id: "rewrite-refactor-or-reinvent.md";
  slug: "rewrite-refactor-or-reinvent";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"right-and-wrote_-ten-choices-in-language-design-(pdf).md": {
	id: "right-and-wrote_-ten-choices-in-language-design-(pdf).md";
  slug: "right-and-wrote_-ten-choices-in-language-design-pdf";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"roam.md": {
	id: "roam.md";
  slug: "roam";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"ruby-for-the-self-taught-developer.md": {
	id: "ruby-for-the-self-taught-developer.md";
  slug: "ruby-for-the-self-taught-developer";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"rust-based-platform-for-the-web-swc.md": {
	id: "rust-based-platform-for-the-web-swc.md";
  slug: "rust-based-platform-for-the-web-swc";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"serverless-sqlite.md": {
	id: "serverless-sqlite.md";
  slug: "serverless-sqlite";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"sixteen-days-of-haskell-code-lyrical.md": {
	id: "sixteen-days-of-haskell-code-lyrical.md";
  slug: "sixteen-days-of-haskell-code-lyrical";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"smooth-voxel-terrain.md": {
	id: "smooth-voxel-terrain.md";
  slug: "smooth-voxel-terrain";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"software-requirements-spec-(wiki).md": {
	id: "software-requirements-spec-(wiki).md";
  slug: "software-requirements-spec-wiki";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"software-verification_-model-checking-vs.-testing-(pdf).md": {
	id: "software-verification_-model-checking-vs.-testing-(pdf).md";
  slug: "software-verification_-model-checking-vs-testing-pdf";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"sokoban-10-lines.md": {
	id: "sokoban-10-lines.md";
  slug: "sokoban-10-lines";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"some-thoughts-on-security-after-ten-years-of-qmail-1.0-(pdf).md": {
	id: "some-thoughts-on-security-after-ten-years-of-qmail-1.0-(pdf).md";
  slug: "some-thoughts-on-security-after-ten-years-of-qmail-10-pdf";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"speed-reading-is-bullshit.md": {
	id: "speed-reading-is-bullshit.md";
  slug: "speed-reading-is-bullshit";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"sqlite-performance-tuning.md": {
	id: "sqlite-performance-tuning.md";
  slug: "sqlite-performance-tuning";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"surviving-disillusionment.md": {
	id: "surviving-disillusionment.md";
  slug: "surviving-disillusionment";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"taboo-oo.md": {
	id: "taboo-oo.md";
  slug: "taboo-oo";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"terrain-erosion-3-ways.md": {
	id: "terrain-erosion-3-ways.md";
  slug: "terrain-erosion-3-ways";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"the-art-of-money-getting.md": {
	id: "the-art-of-money-getting.md";
  slug: "the-art-of-money-getting";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"the-art-of-not-thinking.md": {
	id: "the-art-of-not-thinking.md";
  slug: "the-art-of-not-thinking";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"the-case-for-frameworks.md": {
	id: "the-case-for-frameworks.md";
  slug: "the-case-for-frameworks";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"the-case-for-models.md": {
	id: "the-case-for-models.md";
  slug: "the-case-for-models";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"the-codeless-code.md": {
	id: "the-codeless-code.md";
  slug: "the-codeless-code";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"the-construction-and-use-of-c++-algorithms.md": {
	id: "the-construction-and-use-of-c++-algorithms.md";
  slug: "the-construction-and-use-of-c-algorithms";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"the-elmish-book.md": {
	id: "the-elmish-book.md";
  slug: "the-elmish-book";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"the-gentle-art-of-patch-review.md": {
	id: "the-gentle-art-of-patch-review.md";
  slug: "the-gentle-art-of-patch-review";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"the-market-for-lemons.md": {
	id: "the-market-for-lemons.md";
  slug: "the-market-for-lemons";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"the-seven-programming-ur-languages.md": {
	id: "the-seven-programming-ur-languages.md";
  slug: "the-seven-programming-ur-languages";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"the-smalltalk-80-system.md": {
	id: "the-smalltalk-80-system.md";
  slug: "the-smalltalk-80-system";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"the-sound-of-space-filling-curves.md": {
	id: "the-sound-of-space-filling-curves.md";
  slug: "the-sound-of-space-filling-curves";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"the-staff-engineer-39-s-path-book-review-stanislav-myachenkov.md": {
	id: "the-staff-engineer-39-s-path-book-review-stanislav-myachenkov.md";
  slug: "the-staff-engineer-39-s-path-book-review-stanislav-myachenkov";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"the-surprising-rigidness-of-higher-rank-kinds.md": {
	id: "the-surprising-rigidness-of-higher-rank-kinds.md";
  slug: "the-surprising-rigidness-of-higher-rank-kinds";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"the-timeless-way-of-programming-tomas-petricek.md": {
	id: "the-timeless-way-of-programming-tomas-petricek.md";
  slug: "the-timeless-way-of-programming-tomas-petricek";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"the-true-power-of-regular-expressions.md": {
	id: "the-true-power-of-regular-expressions.md";
  slug: "the-true-power-of-regular-expressions";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"the-ultimate-deliberate-practice-guide-how-to-be-the-best.md": {
	id: "the-ultimate-deliberate-practice-guide-how-to-be-the-best.md";
  slug: "the-ultimate-deliberate-practice-guide-how-to-be-the-best";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"to-compute-a-constant-of-calculus.md": {
	id: "to-compute-a-constant-of-calculus.md";
  slug: "to-compute-a-constant-of-calculus";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"traditional-assignment-considered-harmful-(pdf).md": {
	id: "traditional-assignment-considered-harmful-(pdf).md";
  slug: "traditional-assignment-considered-harmful-pdf";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"transitional-apps-with-phoenix-and-svelte.md": {
	id: "transitional-apps-with-phoenix-and-svelte.md";
  slug: "transitional-apps-with-phoenix-and-svelte";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"trpl-pdfs.md": {
	id: "trpl-pdfs.md";
  slug: "trpl-pdfs";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"typeclassopedia.md": {
	id: "typeclassopedia.md";
  slug: "typeclassopedia";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"umami.md": {
	id: "umami.md";
  slug: "umami";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"unbounded-sieve-of-eratosthenes.md": {
	id: "unbounded-sieve-of-eratosthenes.md";
  slug: "unbounded-sieve-of-eratosthenes";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"understanding-onion-architecture.md": {
	id: "understanding-onion-architecture.md";
  slug: "understanding-onion-architecture";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"use-constexpr-for-faster,-smaller,-and-safer-code.md": {
	id: "use-constexpr-for-faster,-smaller,-and-safer-code.md";
  slug: "use-constexpr-for-faster-smaller-and-safer-code";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"use-google-like-a-pro.md": {
	id: "use-google-like-a-pro.md";
  slug: "use-google-like-a-pro";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"what-to-blog-about.md": {
	id: "what-to-blog-about.md";
  slug: "what-to-blog-about";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"where-have-all-the-hackers-gone.md": {
	id: "where-have-all-the-hackers-gone.md";
  slug: "where-have-all-the-hackers-gone";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"why-and-how-to-write-things-on-the-internet.md": {
	id: "why-and-how-to-write-things-on-the-internet.md";
  slug: "why-and-how-to-write-things-on-the-internet";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"without-belief-in-a-god-but-never-without-belief-in-a-devil.md": {
	id: "without-belief-in-a-god-but-never-without-belief-in-a-devil.md";
  slug: "without-belief-in-a-god-but-never-without-belief-in-a-devil";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"word-numbers,-part-1_-billion-approaches.md": {
	id: "word-numbers,-part-1_-billion-approaches.md";
  slug: "word-numbers-part-1_-billion-approaches";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"work-is-work.md": {
	id: "work-is-work.md";
  slug: "work-is-work";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"working-in-godot-with-sqlite-and-csharp.md": {
	id: "working-in-godot-with-sqlite-and-csharp.md";
  slug: "working-in-godot-with-sqlite-and-csharp";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"write-code-that-is-easy-to-delete,-not-easy-to-extend.md": {
	id: "write-code-that-is-easy-to-delete,-not-easy-to-extend.md";
  slug: "write-code-that-is-easy-to-delete-not-easy-to-extend";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"write-up_-out-of-the-tar-pit.md": {
	id: "write-up_-out-of-the-tar-pit.md";
  slug: "write-up_-out-of-the-tar-pit";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"writing---foundations---human-interface-guidelines---design---apple-developer.md": {
	id: "writing---foundations---human-interface-guidelines---design---apple-developer.md";
  slug: "writing---foundations---human-interface-guidelines---design---apple-developer";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"writing-by-hand-is-the-best-way-to-retain-information.md": {
	id: "writing-by-hand-is-the-best-way-to-retain-information.md";
  slug: "writing-by-hand-is-the-best-way-to-retain-information";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"writing-python-like-it-s-rust.md": {
	id: "writing-python-like-it-s-rust.md";
  slug: "writing-python-like-it-s-rust";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
"zettelkasten.md": {
	id: "zettelkasten.md";
  slug: "zettelkasten";
  body: string;
  collection: "link";
  data: InferEntrySchema<"link">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
