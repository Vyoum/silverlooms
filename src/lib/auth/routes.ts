export const PUBLIC_ROUTES = ["/login", "/auth/callback"] as const;

export function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}
