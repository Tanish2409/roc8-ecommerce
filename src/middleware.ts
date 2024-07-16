import { NextResponse, type NextRequest } from "next/server";
import { publicRouteLinks, authenticatedRouteLinks } from "@/config/routes";
import { getSessionValue, redisSessions } from "@/server/redis-session";

export default async function middleware(req: NextRequest) {
  // const { getUser, isAuthenticated } = getKindeServerSession();
  // const user = await getUser();

  // if (!(await isAuthenticated())) {
  // 	return NextResponse.redirect(new URL("/", req.url));
  // }

  // if (user?.email?.split("@")[1] !== "byldd.com") {
  // 	return NextResponse.redirect(new URL("/api/auth/logout", req.url));
  // }

  const { pathname } = req.nextUrl;

  const sessionId = req.cookies.get("auth-session");

  if (sessionId) {
    // console.log(sessionId, typeof sessionId);

    const res = await redisSessions.get({
      app: "web",
      token: sessionId.value,
    });
    // const res = await getSessionValue(sessionId.value);
    console.log("res", res);
  }

  if (publicRouteLinks.includes(pathname)) console.log(req.nextUrl);

  // const response = NextResponse.next();

  // return response;
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
