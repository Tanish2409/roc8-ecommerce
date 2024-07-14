import bcrypt from "bcrypt";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { signupSchema, verifyOtpSchema } from "@/types/auth";
import { TRPCError } from "@trpc/server";
import { sendVerifyEmail } from "@/server/email";
import { generateOtp } from "@/utils/generate-otp";

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
      try {
        return await ctx.db.$transaction(async (tx) => {
          const userTable = tx.user;
          const otpTable = tx.otp;

          const savedOtp = await otpTable.findUnique({
            where: {
              email: input.email,
            },
          });

          if (!savedOtp) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "OTP does not exists. Try to login or signup again.",
            });
          }

          const isOtpMatch = savedOtp.otp === input.otp;

          if (!isOtpMatch) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Invalid OTP. Please try again.",
            });
          }

          await userTable.update({
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

  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),

  // create: publicProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     // simulate a slow db call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     return ctx.db.post.create({
  //       data: {
  //         name: input.name,
  //       },
  //     });
  //   }),

  // getLatest: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.post.findFirst({
  //     orderBy: { createdAt: "desc" },
  //   });
  // }),
});
