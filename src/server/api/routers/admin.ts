import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { generateToken, TokenType } from "~/lib/jwt";

export const adminRouter = createTRPCRouter({
  login: publicProcedure
    .input(
      z.object({
        username: z.string({
          message: "Invalid username",
        }),
        password: z.string({
          message: "Invalid password",
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { username, password } = input;
      const user = await ctx.db.adminUser.findUnique({
        where: { username },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid username",
        });
      }
      const pass = await bcrypt.hash("admin", 10);
      console.log(pass);

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid password",
        });
      }

      const token = await generateToken({
        id: user.id,
        email: "admin@cartuner.dev",
        name: user.username,
        type: TokenType.Admin,
      });

      return {
        token,
        user,
      };
    }),
});
