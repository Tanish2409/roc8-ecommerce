/**
 * ref: https://www.npmjs.com/package/redis-sessions
 */

import RedisSessions from "redis-sessions";
import { env } from "@/env";
import type { User } from "@prisma/client";

const createRedisSessions = () =>
  new RedisSessions<Pick<User, "email" | "name">>({
    options: {
      url: env.REDIS_URL,
    },
  });

const globalForRedisSessions = globalThis as unknown as {
  redisSessions: ReturnType<typeof createRedisSessions> | undefined;
};

export const redisSessions =
  globalForRedisSessions.redisSessions ?? createRedisSessions();

if (env.NODE_ENV !== "production")
  globalForRedisSessions.redisSessions = redisSessions;
