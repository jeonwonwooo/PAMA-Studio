export function getSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "http://localhost:3000";

  return configuredUrl.replace(/\/$/, "");
}

export function getAuthCallbackUrl(redirectTo: string) {
  return `${getSiteUrl()}/api/auth/callback?redirectTo=${encodeURIComponent(
    redirectTo
  )}`;
}
