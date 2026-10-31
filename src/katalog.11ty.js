// Compact price catalogue for the selector, loaded only when a visitor uses it
// (keeps the homepage HTML small). Repairs: [type, label, price|null, from, note, duration];
// null = "auf Anfrage".
export const data = { permalink: '/preise/katalog.json', eleventyExcludeFromCollections: true };

export function render({ prices }) {
  return JSON.stringify({
    brands: prices.brands.map((b) => ({
      brand: b.brand,
      slug: b.slug,
      models: b.models.map((m) => ({
        name: m.name,
        slug: m.slug,
        category: m.category,
        series: m.series,
        repairs: m.repairs.map((r) => [r.service, r.label, r.onRequest ? null : r.price, r.from ? 1 : 0, r.note, r.duration])
      }))
    }))
  });
}
