/** Production canonical: https://www.citelens.app — override with NEXT_PUBLIC_APP_URL. */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ?? "https://www.citelens.app";
  let origin = raw.replace(/\/$/, "");
  if (
    origin === "https://citelens.app" ||
    origin === "http://citelens.app"
  ) {
    origin = "https://www.citelens.app";
  }
  return origin;
}
