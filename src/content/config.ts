import { z, defineCollection } from "astro:content";

const re = /^0/;

const link = defineCollection({
    schema: z.object({
        title: z.string(),
        url: z.string(),
        date: z.string().transform(s => {
            const parts = s.split('/').map(n => parseInt(n.replace(re, '')));
            return new Date(parts[0], parts[1] - 1, parts[2]);
        }),
    })
});

export const collections = {
    'link': link,
}