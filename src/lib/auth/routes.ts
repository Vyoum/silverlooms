/** Routes that require a signed-in user */
export const PROTECTED_ROUTE_PREFIXES = ["/admin", "/account"] as const;

export const AUTH_ROUTES = ["/login", "/auth/callback"] as const;

export const ACCOUNT_ROUTE = "/account" as const;

export const HOME_ROUTE = "/" as const;

export function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTE_PREFIXES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

/** Prevent redirect loops after sign-in (e.g. /login → /login) */
export function getPostLoginRedirect(path: string | null | undefined) {
  if (
    !path ||
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path === HOME_ROUTE
  ) {
    return HOME_ROUTE;
  }
  if (isAuthRoute(path) || path === "/login") {
    return HOME_ROUTE;
  }
  return path;
}
