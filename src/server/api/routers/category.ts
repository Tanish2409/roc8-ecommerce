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

      const userId = ctx.sessionUser.user.id;

      try {
        const categories = await ctx.db.category.findMany({
          take: LIMIT,
          skip: (input.page - 1) * LIMIT,
          include: {
            interestedUser: {
              select: {
                userId: true,
              },
            },
          },
        });

        /**
         * Since this is a protected route, we are checking on the server iteself
         * whether the category is liked by the login user or not.
         */
        const mappedCategoriesToUser = categories.map((category) => {
          const isUserInterested =
            category.interestedUser.filter((user) => user.userId === userId)
              .length > 0;

          return {
            ...category,
            isUserInterested,
          };
        });

        const count = await ctx.db.category.count();

        return {
          categories: mappedCategoriesToUser,
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

  updateInterested: authProtectedProcedure
    .input(
      z.object({
        categoryId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const isCategoryUserMappingExists =
          await ctx.db.userInterestedCategory.findFirst({
            where: {
              categoryId: input.categoryId,
              userId: ctx.sessionUser.user.id,
            },
          });

        if (!isCategoryUserMappingExists) {
          await ctx.db.userInterestedCategory.create({
            data: {
              userId: ctx.sessionUser.user.id,
              categoryId: input.categoryId,
            },
          });
        } else {
          await ctx.db.userInterestedCategory.delete({
            where: {
              id: isCategoryUserMappingExists.id,
            },
          });
        }

        return;
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
