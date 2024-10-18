import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { generateToken, TokenType } from "~/lib/jwt";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email({
          message: "Invalid email",
        }),
        password: z.string().min(6, {
          message: "Password must be at least 6 characters",
        }),
        name: z.string().min(3, {
          message: "Name must be at least 3 characters",
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await ctx.db.clientUser
        .create({
          data: {
            email,
            password: hashedPassword,
            name: input.name,
          },
        })
        .catch((error: { message: string }) => {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        });

      const token = await generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
        type: TokenType.User,
      });
      return {
        token,
        user,
      };
    }),
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email({
          message: "Invalid email",
        }),
        password: z.string({
          message: "Invalid password",
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;
      const user = await ctx.db.clientUser.findUnique({
        where: { email },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid email",
        });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid password",
        });
      }

      const token = await generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
        type: TokenType.User,
      });

      return {
        token,
        user,
      };
    }),
  getId: publicProcedure.query(async ({ ctx }) => {
    return ctx.user?.id;
  }),
});
