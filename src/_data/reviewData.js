// Google reviews for the home page. The real data lives in reviews.json and is only
// filled from Google (scripts/fetch-reviews.mjs). REVIEWS_FIXTURE lets the layout test
// render the strip with clearly marked sample data; it is refused in production builds.
import fs from 'node:fs';

export default function () {
  const file = process.env.REVIEWS_FIXTURE;
  const real = JSON.parse(fs.readFileSync(new URL('./reviews.json', import.meta.url)));
  if (!file) return { ...real, isSample: false };
  const context = process.env.CONTEXT || process.env.SITE_CONTEXT || 'development';
  if (context === 'production') throw new Error('REVIEWS_FIXTURE must not be used for a production build');
  return { ...JSON.parse(fs.readFileSync(file)), isSample: true };
}
