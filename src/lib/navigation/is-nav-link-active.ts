export function isNavLinkActive(
  href: string,
  pathname: string,
  search: string,
  hash: string,
): boolean {
  const [pathAndHash, queryString] = href.split("?");
  const hashIndex = pathAndHash.indexOf("#");
  const linkPath =
    hashIndex >= 0 ? pathAndHash.slice(0, hashIndex) || "/" : pathAndHash;
  const linkHash = hashIndex >= 0 ? pathAndHash.slice(hashIndex) : "";

  if (linkHash) {
    return pathname === linkPath && hash === linkHash;
  }

  const pathMatches =
    pathname === linkPath ||
    (linkPath !== "/" && pathname.startsWith(`${linkPath}/`));

  if (!pathMatches) return false;

  if (!queryString) {
    if (linkPath === "/kurtis") {
      const params = new URLSearchParams(search);
      const sort = params.get("sort");
      return !sort || sort === "all";
    }
    return true;
  }

  const linkParams = new URLSearchParams(queryString);
  const currentParams = new URLSearchParams(search);

  for (const [key, value] of linkParams.entries()) {
    if (currentParams.get(key) !== value) return false;
  }

  return true;
}
