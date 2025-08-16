import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const reviewsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.findByID({
        collection: "products",
        id: input.productId,
      });

      if (!product)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });

      const reviewsData = await ctx.db.find({
        collection: "reviews",
        limit: 1,
        where: {
          and: [
            {
              product: {
                equals: product.id,
              },
            },
            {
              user: {
                equals: ctx.session.user.id,
              },
            },
          ],
        },
      });

      const review = reviewsData.docs[0];

      if (!review) return null;

      return review;
    }),

  create: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        rating: z.number().min(1, "Rating is required").max(5),
        desciption: z.string().min(1, "Description is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.findByID({
        collection: "products",
        id: input.productId,
      });

      if (!product)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });

      const existingReviewsData = await ctx.db.find({
        collection: "reviews",
        where: {
          and: [
            {
              product: {
                equals: product.id,
              },
            },
            {
              user: {
                equals: ctx.session.user.id,
              },
            },
          ],
        },
      });

      if (existingReviewsData.totalDocs > 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already reviewed this product",
        });

      const review = await ctx.db.create({
        collection: "reviews",
        data: {
          user: ctx.session.user,
          product: product.id,
          rating: input.rating,
          description: input.desciption,
        },
      });

      return review;
    }),
  update: protectedProcedure
    .input(
      z.object({
        reviewId: z.string(),
        rating: z.number().min(1, "Rating is required").max(5),
        desciption: z.string().min(1, "Description is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.db.findByID({
        collection: "reviews",
        depth: 0,
        id: input.reviewId,
      });

      if (!review)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });

      if (review.user !== ctx.session.user.id)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to update this review",
        });

      const updatedReview = await ctx.db.update({
        collection: "reviews",
        id: input.reviewId,
        data: {
          rating: input.rating,
          description: input.desciption,
        },
      });

      return updatedReview;
    }),
});
