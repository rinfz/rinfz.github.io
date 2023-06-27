import { CollectionEntry } from "astro:content";

type Whisky = { name: string; rating: string };

export const simpleDate = date => date.split("T")[0];

function whiskyRating(w: Whisky) {
    return parseFloat(w.rating.split("/")[0]);
}

export function sortWhisky(a: Whisky, b: Whisky) {
    const ar = whiskyRating(a);
    const br = whiskyRating(b);
    // desc. sort
    if (ar > br) return -1;
    if (br > ar) return 1;
    return 0;
}

export function formatDate(date: Date) {
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
}

export function writeUpLink(link: CollectionEntry<'link'>) {
    if (link.body) {
        // TODO
        return 'some writeup';
    }
    return 'no notes';
}

export function sortLink(a: CollectionEntry<'link'>, b: CollectionEntry<'link'>) {
    const l = a.data.date;
    const r = b.data.date;
    if (l > r) return -1;
    if (r > l) return 1;
    return 0;
}
