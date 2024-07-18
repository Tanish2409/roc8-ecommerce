import { env } from "@/env";
import { type GetSessionUserRes } from "@/types/auth";
import { getBaseUrl } from "@/utils/get-base-url";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * @description: to be only called in the server context. (middleware, rsc, actions)
 */
export async function getSessionUser(): Promise<{
  data: GetSessionUserRes;
  res: NextResponse<GetSessionUserRes>;
}> {
  const sessionToken = cookies().get("auth-session")?.value;

  let data: GetSessionUserRes = {
    isAuthenticated: false,
    user: null,
  };

  if (!sessionToken) {
    return {
      data,
      res: NextResponse.json(data, { status: 400 }),
    };
  }

  const res = (await fetch(`${getBaseUrl()}/api/auth/getSessionUser`, {
    method: "GET",
    credentials: "same-origin",
    headers: {
      Cookie: `sessionToken=${sessionToken}`,
      "x-api-key": env.PLATFORM_API_KEY,
    },
  })) as NextResponse<GetSessionUserRes>;

  data = (await res.json()) as GetSessionUserRes;

  return {
    data,
    res,
  };
}
