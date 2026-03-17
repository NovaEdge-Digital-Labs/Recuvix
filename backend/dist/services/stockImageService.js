"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchStockImages = fetchStockImages;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
async function fetchStockImages(topic, country, count, preferSource) {
    const queries = generateSearchQueries(topic, country);
    let allImages = [];
    if (preferSource === 'unsplash' || preferSource === 'both') {
        const unsplashImages = await fetchFromUnsplash(queries, count);
        allImages = [...allImages, ...unsplashImages];
    }
    if (preferSource === 'pexels' || preferSource === 'both') {
        // Only fetch from Pexels if we don't already have enough from Unsplash, or if we specifically want both
        const pexelsImages = await fetchFromPexels(queries, count);
        if (preferSource === 'both') {
            allImages = interleaveArrays(allImages, pexelsImages);
        }
        else {
            allImages = pexelsImages;
        }
    }
    // Ensure we only return requested number
    allImages = allImages.slice(0, count);
    return { images: allImages, total: allImages.length };
}
function generateSearchQueries(topic, country) {
    // Simple deterministic variation for queries
    const base = topic.toLowerCase().trim();
    const context = country.toLowerCase() === 'usa' ? 'professional' : country;
    return [
        base,
        `${base} ${context}`,
        `${base} concept`
    ];
}
async function fetchFromUnsplash(queries, count) {
    if (!UNSPLASH_ACCESS_KEY)
        return [];
    try {
        const url = new URL('https://api.unsplash.com/search/photos');
        url.searchParams.append('query', queries[0]);
        url.searchParams.append('per_page', count.toString());
        url.searchParams.append('orientation', 'landscape');
        const res = await fetch(url.toString(), {
            headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` }
        });
        if (!res.ok)
            throw new Error('Unsplash API failed');
        const data = await res.json();
        return data.results.map((img) => ({
            url: img.urls.regular,
            alt: generateSeoAltText(queries[0], img.alt_description),
            photographer: img.user.name,
            source: 'unsplash',
            width: img.width,
            height: img.height
        }));
    }
    catch (err) {
        console.error('Unsplash Error:', err);
        return [];
    }
}
async function fetchFromPexels(queries, count) {
    if (!PEXELS_API_KEY)
        return [];
    try {
        const url = new URL('https://api.pexels.com/v1/search');
        // Using second query for variety if it exists
        url.searchParams.append('query', queries[1] || queries[0]);
        url.searchParams.append('per_page', count.toString());
        url.searchParams.append('orientation', 'landscape');
        const res = await fetch(url.toString(), {
            headers: { Authorization: PEXELS_API_KEY }
        });
        if (!res.ok)
            throw new Error('Pexels API failed');
        const data = await res.json();
        return data.photos.map((img) => ({
            url: img.src.large,
            alt: generateSeoAltText(queries[0], img.alt),
            photographer: img.photographer,
            source: 'pexels',
            width: img.width,
            height: img.height
        }));
    }
    catch (err) {
        console.error('Pexels Error:', err);
        return [];
    }
}
function interleaveArrays(arr1, arr2) {
    const result = [];
    const maxLen = Math.max(arr1.length, arr2.length);
    for (let i = 0; i < maxLen; i++) {
        if (i < arr1.length)
            result.push(arr1[i]);
        if (i < arr2.length)
            result.push(arr2[i]);
    }
    return result;
}
function generateSeoAltText(topic, originalAlt) {
    if (!originalAlt)
        return `Professional representation of ${topic}`;
    return `${topic} context: ${originalAlt}`;
}
