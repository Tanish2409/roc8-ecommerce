import { env } from "@/env";
import Redis from "ioredis";

const createRedisClient = () => new Redis(env.REDIS_URL);

const globalForRedis = globalThis as unknown as {
  redisClient: ReturnType<typeof createRedisClient> | undefined;
};

export const redisClient = globalForRedis.redisClient ?? createRedisClient();

if (env.NODE_ENV !== "production") globalForRedis.redisClient = redisClient;
