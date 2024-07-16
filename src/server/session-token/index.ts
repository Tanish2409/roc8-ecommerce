/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/**
 * ref: https://www.npmjs.com/package/session-token
 */

import SessionToken from "session-token";
import { redisClient } from "@/server/redis";

export const sessionToken = new SessionToken({
  expireTime: 7 * 24 * 60 * 60, //the time of seconds before the session data expired // 7days
  redisKeyPrefix: "session:", //the redis key's prefix
  redis: redisClient, //the redis client used to save session data
  maxSize: 0, // The max size of the cache in memory.
});
