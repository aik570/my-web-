// Fetch the shop's Google rating and reviews into src/_data/reviews.json.
//
//   GOOGLE_PLACES_API_KEY=… GOOGLE_PLACE_ID=… node scripts/fetch-reviews.mjs
//
// Uses the Places API (New), Place Details with the fields rating, userRatingCount,
// reviews and googleMapsUri. Google returns at most five reviews, in Google's own
// order. Texts, names and ratings are stored unchanged; nothing is filtered or edited.
// The key belongs in the build environment (e.g. Netlify environment variables),
// never in the repository or the page source. Check Google Maps Platform terms with
// the owner before storing the reviews in the repository on a schedule.
import fs from 'node:fs';

const key = process.env.GOOGLE_PLACES_API_KEY;
const placeId = process.env.GOOGLE_PLACE_ID;
if (!key || !placeId) {
  console.error('GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID are required. Nothing changed.');
  process.exit(1);
}

const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=de`, {
  headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'rating,userRatingCount,reviews,googleMapsUri' }
});
if (!res.ok) {
  console.error(`Google answered ${res.status}: ${await res.text()}`);
  process.exit(1);
}
const place = await res.json();
const file = new URL('../src/_data/reviews.json', import.meta.url);
const old = JSON.parse(fs.readFileSync(file));
const items = (place.reviews || [])
  .filter((r) => r.authorAttribution?.displayName && (r.originalText?.text || r.text?.text))
  .map((r) => ({
    author: r.authorAttribution.displayName,
    authorUrl: r.authorAttribution.uri || '',
    rating: r.rating,
    text: (r.originalText || r.text).text,
    when: r.relativePublishTimeDescription || '',
    published: r.publishTime || '',
    googleUrl: r.googleMapsUri || ''
  }));
fs.writeFileSync(file, JSON.stringify({
  ...old,
  placeId,
  googleUrl: place.googleMapsUri || old.googleUrl,
  rating: place.rating ?? null,
  count: place.userRatingCount ?? null,
  fetchedAt: new Date().toISOString().slice(0, 10),
  items
}, null, 2) + '\n');
console.log(`Saved ${items.length} reviews (rating ${place.rating}, ${place.userRatingCount} in total).`);
