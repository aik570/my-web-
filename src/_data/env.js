// Build context. Netlify sets CONTEXT to "production", "deploy-preview" or
// "branch-deploy"; everything else (local builds, tests) is "development".
// Only production builds may publish; all other builds are marked as preview.
export default function () {
  const context = process.env.CONTEXT || process.env.SITE_CONTEXT || 'development';
  return { context, isProduction: context === 'production' };
}
