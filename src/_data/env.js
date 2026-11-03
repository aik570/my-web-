// Build context. Netlify sets CONTEXT to "production", "deploy-preview" or
// "branch-deploy"; everything else (local builds, tests) is "development".
// Only production builds may publish; all other builds are marked as preview.
export default function () {
  // HC_PREVIEW_SITE=1 (set in Netlify for the test site): build as a marked preview even in Netlify's production context
  const context = process.env.HC_PREVIEW_SITE === '1' ? 'branch-deploy' : (process.env.CONTEXT || process.env.SITE_CONTEXT || 'development');
  return { context, isProduction: context === 'production' };
}
