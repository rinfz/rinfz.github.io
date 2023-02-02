import { z, defineCollection } from "astro:content";

const link = defineCollection({
    schema: z.object({
        title: z.string(),
        url: z.string(),
        date: z.string().transform(s => new Date(s)),
    })
});

export const collections = {
    'link': link,
}