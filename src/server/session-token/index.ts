/* eslint-disable @typescript-eslint/no-unsafe-call */
/**
 * ref: https://www.npmjs.com/package/session-token
 */

import SessionToken from "session-token";
import { redisClient } from "@/server/redis";
import { env } from "@/env";

type GenerateCallback = (err: Error | null, token?: string) => void;

type GenerateValues = Record<string, unknown>;

type SessionToken = {
  generate: (values: GenerateValues, callback: GenerateCallback) => void;
};

const createSessionToken = () =>
  new SessionToken({
    expireTime: 7 * 24 * 60 * 60, //the time of seconds before the session data expired // 7days
    redisKeyPrefix: "session:", //the redis key's prefix
    redis: redisClient, //the redis client used to save session data
    maxSize: 0, // The max size of the cache in memory.
  }) as SessionToken;

const globalForSesssionToken = globalThis as unknown as {
  sessionToken: ReturnType<typeof createSessionToken> | undefined;
};

export const sessionToken =
  globalForSesssionToken.sessionToken ?? createSessionToken();

// Promisify the library's generate token method
export function generateToken(values: GenerateValues): Promise<string> {
  return new Promise((resolve, reject) => {
    sessionToken.generate(values, (err, token) => {
      if (err) {
        reject(err);
      } else if (token) {
        resolve(token);
      } else {
        reject(new Error("Token generation failed with no error"));
      }
    });
  });
}

if (env.NODE_ENV !== "production")
  globalForSesssionToken.sessionToken = sessionToken;
