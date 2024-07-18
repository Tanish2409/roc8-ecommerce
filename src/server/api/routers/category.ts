import { authProtectedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const categoryRouter = createTRPCRouter({
  getAll: authProtectedProcedure
    .input(
      z.object({
        page: z.number().int().gte(1).default(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const LIMIT = 6;
      try {
        const categories = await ctx.db.category.findMany({
          take: LIMIT,
          skip: (input.page - 1) * LIMIT,
        });

        const count = await ctx.db.category.count();

        return {
          categories,
          page: input.page,
          count,
          limit: LIMIT,
        };
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
});
