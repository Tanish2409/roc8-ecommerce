import bcrypt from "bcrypt";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { loginSchema, signupSchema, verifyOtpSchema } from "@/types/auth";
import { TRPCError } from "@trpc/server";
import { sendVerifyEmail } from "@/server/email";
import { generateOtp } from "@/utils/generate-otp";
import { redisSessions } from "@/server/redis-session";
import { cookies } from "next/headers";
import { env } from "@/env";
import { type User } from "@prisma/client";
import { z } from "zod";

const setSessionToken = async ({ user }: { user: User }) => {
  const sessionToken = await redisSessions.create({
    app: "web",
    id: user.id,
    d: {
      email: user.email,
      name: user.name,
    },
    ip: "0.0.0.0",
    ttl: parseInt(env.SESSION_EXPIRY_TIME),
    no_resave: true,
  });

  cookies().set("auth-session", sessionToken.token, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "strict",
    maxAge: parseInt(env.SESSION_EXPIRY_TIME),
  });
};

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(signupSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.$transaction(async (tx) => {
          const userTable = tx.user;
          const otpTable = tx.otp;

          // Check for existing user
          const existingUser = await userTable.findUnique({
            where: {
              email: input.email,
            },
          });

          /**
           * if the user exists and it's verified then we will throw error
           * otherwise if user exists and is not verified then we will resend a new otp.
           *
           * This ensures that if the user loses the verify page, they can generate the otp
           * again even after the user was created inside the db.
           */
          if (existingUser?.isVerified) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "User already exists",
            });
          }

          // create a user only when the user does not exists
          if (!existingUser) {
            // hash password
            const hashedPassword = await bcrypt.hash(input.password, 10);

            // create user
            await userTable.create({
              data: {
                name: input.name,
                email: input.email,
                password: hashedPassword,
              },
            });
          }

          /**
           * if the user exists & is not verified
           * or
           * user does not exists then
           * we will send a new otp to verify email
           */
          if ((existingUser && !existingUser.isVerified) ?? !existingUser) {
            // create otp and save to collection
            const otp = generateOtp();

            // create new if user does not exists otherwise update the previous record
            await otpTable.upsert({
              where: {
                email: input.email,
              },
              create: {
                email: input.email,
                otp,
              },
              update: {
                otp,
                retries: 0,
              },
            });

            // send email
            await sendVerifyEmail({
              name: input.name,
              otp,
              email: input.email,
            });
          }

          return {
            email: input.email,
          };
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: error.code,
            message: error.message,
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong. Please try again later",
        });
      }
    }),

  verifyOtp: publicProcedure
    .input(verifyOtpSchema)
    .mutation(async ({ ctx, input }) => {
      const MAX_RETRIES = 3;
      try {
        const savedOtp = await ctx.db.otp.findUnique({
          where: {
            email: input.email,
          },
        });

        if (!savedOtp) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "OTP does not exists. Request a new OTP.",
          });
        }

        const isOtpMatch = savedOtp.otp === input.otp;

        if (!isOtpMatch) {
          /**
           * We add a max retries logic so that no one can bruteforce their way in
           * to our platform since we don't have any expiration time for the otp
           * and on successful otp verification, user is logged in to the platform.
           */
          if (savedOtp.retries >= MAX_RETRIES) {
            await ctx.db.otp.delete({
              where: { id: savedOtp.id },
            });

            throw new TRPCError({
              code: "TOO_MANY_REQUESTS",
              message: "Retries limit reached. Please request a new OTP.",
            });
          } else {
            await ctx.db.otp.update({
              where: { id: savedOtp.id },
              data: {
                retries: { increment: 1 },
              },
            });

            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Invalid OTP. You have ${MAX_RETRIES - savedOtp.retries} tries left.`,
            });
          }
        }

        return await ctx.db.$transaction(async (tx) => {
          const userTable = tx.user;
          const otpTable = tx.otp;

          const user = await userTable.update({
            where: {
              email: savedOtp.email,
            },
            data: {
              isVerified: true,
            },
          });

          await otpTable.delete({
            where: {
              id: savedOtp.id,
            },
          });

          await setSessionToken({ user });
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: error.code,
            message: error.message,
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong. Please try again later",
        });
      }
    }),

  resendOtp: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(async (tx) => {
        const userTable = tx.user;
        const otpTable = tx.otp;

        const user = await userTable.findUnique({
          where: { email: input.email },
        });

        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User not found.",
          });
        }

        if (!user || user.isVerified) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Already verified. Please login.",
          });
        }

        // create otp and save to collection
        const otp = generateOtp();

        // create new if user does not exists otherwise update the previous record
        await otpTable.upsert({
          where: {
            email: input.email,
          },
          create: {
            email: input.email,
            otp,
          },
          update: {
            otp,
            retries: 0,
          },
        });

        // send email
        await sendVerifyEmail({
          name: user.name,
          otp,
          email: input.email,
        });
      });
    }),

  login: publicProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    const userTable = ctx.db.user;

    const existingUser = await userTable.findUnique({
      where: {
        email: input.email,
      },
    });

    if (!existingUser) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User does not exists",
      });
    }

    /**
     * TODO: send a new otp & redirect to verify page instead of throwing error
     */
    if (!existingUser.isVerified) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Email not verified. Signup again to get a verification code.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      input.password,
      existingUser.password,
    );

    if (!isPasswordMatch) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Incorrect password.",
      });
    }

    await setSessionToken({
      user: existingUser,
    });

    return;
  }),
});
