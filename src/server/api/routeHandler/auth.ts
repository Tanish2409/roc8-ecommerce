import { env } from "@/env";
import { type GetSessionUserRes } from "@/types/auth";
import { type NextResponse } from "next/server";
import { getBaseUrl } from "@/trpc/react";

/**
 * @description: to be only called in the server context. (middleware, rsc, actions)
 */
export async function getSessionUser(sessionToken: string) {
  const res = (await fetch(`${getBaseUrl()}/api/auth/getSessionUser`, {
    method: "GET",
    credentials: "same-origin",
    headers: {
      Cookie: `sessionToken=${sessionToken}`,
      "x-api-key": env.PLATFORM_API_KEY,
    },
  })) as NextResponse<GetSessionUserRes>;

  const data = (await res.json()) as GetSessionUserRes;

  return {
    data,
    res,
  };
}
