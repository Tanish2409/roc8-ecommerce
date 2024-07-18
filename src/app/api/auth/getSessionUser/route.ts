import { env } from "@/env";
import { redisSessions } from "@/server/redis-session";
import { type GetSessionUserRes } from "@/types/auth";
import cookie from "cookie";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Defining this route handler seperately because to verify the session token in middleware function
 * I need to connect to redis, which the middleware fn is unable to do so because it's not executed
 * in the node runtime and the trpc procedure was failing as well, thus giving errors hence switched to
 * route handler.
 */
export async function GET(
  req: NextRequest,
): Promise<NextResponse<GetSessionUserRes>> {
  try {
    // We make sure that this public route is callable through
    // only our platform
    const apiKey = req.headers.get("x-api-key");

    if (apiKey !== env.PLATFORM_API_KEY) {
      return NextResponse.json(
        {
          isAuthenticated: false,
          user: null,
        },
        { status: 403 },
      );
    }

    const cookieHeader = req.headers.get("cookie");

    // reject if no cookie header
    if (!cookieHeader) {
      return NextResponse.json(
        {
          isAuthenticated: false,
          user: null,
        },
        { status: 400 },
      );
    }

    const cookies = cookie.parse(cookieHeader);

    const sessionToken = cookies?.sessionToken;

    // reject if no session token in cookies
    if (!sessionToken)
      return NextResponse.json(
        { isAuthenticated: false, user: null },
        { status: 400 },
      );

    const res = await redisSessions.get({
      app: "web",
      token: sessionToken,
    });

    // we receive null if the session token is not valid
    if (!res ?? !res?.d) {
      return NextResponse.json(
        {
          isAuthenticated: false,
          user: null,
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        isAuthenticated: true,
        user: {
          ...res.d,
          id: res.id,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        isAuthenticated: false,
        user: null,
      },
      { status: 400 },
    );
  }
}
