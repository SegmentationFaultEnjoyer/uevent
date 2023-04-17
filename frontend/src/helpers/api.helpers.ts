import { ErrorHandler } from "./error-handler";
import { api } from "@/api";

export function isExcluded(url: string, excludeRoutes: string[]) {
    return excludeRoutes.some(route => {
        const pattern = new RegExp(`${route}?.`);
        return pattern.test(url);
    });
}

export function getPagesAmount(link: string) {
    if (!link) return

    const i = link.indexOf('page');

    return Number(link.charAt(i + 'page'.length + 1));
}

export function formatFiltersQuery(opts?: Object) {
    if (!opts) return null

    const filterParams = new Map()
    Object.entries(opts).forEach(([key, value]) => {
        filterParams.set(`filter[${key}]`, value)
    })

    return Object.fromEntries(filterParams.entries())
}

export function formatPageQuery(opts?: Object) {
    if (!opts) return null

    const filterParams = new Map()
    Object.entries(opts).forEach(([key, value]) => {
        filterParams.set(`page[${key}]`, value)
    })

    return Object.fromEntries(filterParams.entries())
}

export async function getImageFileFromUrl(url: string): Promise<File> {
    const response = await fetch(url, { mode: 'no-cors' });
    const buffer = await response.arrayBuffer()
    const blob = await response.blob();

    const filename = url.substring(url.lastIndexOf('/') + 1);
    const file = new File([blob], filename, { type: blob.type });

    return file;
}

export function formatQuery(queryParam: string) {
    queryParam = queryParam.toLowerCase()

    switch (queryParam) {
        case 'date':
            return 'publish_date'
        case 'rating':
            return 'likes'
        case 'alphabetic':
            return 'title'
        case 'status':
        case 'author':
        default:
            return queryParam;
    }
}