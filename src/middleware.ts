import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import {
  authenticatedRouteLinks,
  authenticatedRoutes,
  publicRouteLinks,
  publicRoutes,
} from "@/config/routes";
import { getSessionUser } from "@/server/api/routeHandler/auth";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const sessionToken = cookies().get("auth-session")?.value;

  if (authenticatedRouteLinks.includes(pathname) && !sessionToken) {
    return NextResponse.redirect(new URL(publicRoutes.login.link, req.url));
  }

  if (publicRouteLinks.includes(pathname) && !sessionToken) {
    return NextResponse.next();
  }

  // At this point we are sure that the session token exists
  // Now we will check wether the session token is valid or not

  const { data: sessionUser } = await getSessionUser();

  if (sessionUser.isAuthenticated) {
    if (publicRouteLinks.includes(pathname)) {
      return NextResponse.redirect(
        new URL(authenticatedRoutes.categories.link, req.url),
      );
    }

    if (authenticatedRouteLinks.includes(pathname)) {
      return NextResponse.next();
    }
  }

  if (!sessionUser.isAuthenticated) {
    if (publicRouteLinks.includes(pathname)) {
      const response = NextResponse.next();
      response.cookies.delete("auth-session");
      return response;
    }

    if (authenticatedRouteLinks.includes(pathname)) {
      const response = NextResponse.redirect(
        new URL(publicRoutes.login.link, req.url),
      );
      response.cookies.delete("auth-session");
      return response;
    }
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
