import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { cookies, headers as getHeaders } from "next/headers";
import { z } from "zod";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();

    const session = await ctx.db.auth({ headers });

    return session;
  }),

  logout: baseProcedure.mutation(async ({ ctx }) => {
    const cookieStore = await cookies();
    cookieStore.delete(`${ctx.db.config.cookiePrefix}-token`);
  }),

  register: baseProcedure
    .input(
      z.object({
        email: z.email(),
        passward: z.string().min(3),
        username: z
          .string()
          .min(3, "Username must be at least 3 characters")
          .max(30, "Username must be less than 30 characters")
          .regex(
            /^[a-z0-9][a-z0-9]*[a-z0-9]/,
            "Username can only contain lowercase letters, numbers and hypens. It must start and end with a letter or a number"
          )
          .refine(
            (val) => !val.includes("--"),
            "Username cannot contain consecutive hyphens"
          )
          .transform((val) => val.toLowerCase()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.create({
        collection: "users",
        data: { ...input },
      });

      const data = await ctx.db.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.passward,
        },
      });

      if (!data.token)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Failed to login",
        });

      const cookieStore = await cookies();
      cookieStore.set({
        name: `${ctx.db.config.cookiePrefix}-token`,
        value: data.token,
        httpOnly: true,
        path: "/",
      });
    }),

  login: baseProcedure
    .input(
      z.object({
        email: z.email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const data = await ctx.db.login({
        collection: "users",
        data: { ...input },
      });

      if (!data.token)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Failed to login",
        });

      const cookieStore = await cookies();
      cookieStore.set({
        name: `${ctx.db.config.cookiePrefix}-token`,
        value: data.token,
        httpOnly: true,
        path: "/",
      });

      return data;
    }),
});
