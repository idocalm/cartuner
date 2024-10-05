import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  UserInterface,
} from "~/server/api/trpc";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { generateToken, verifyToken } from "~/lib/jwt";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(3),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await ctx.db.user
        .create({
          data: {
            email,
            password: hashedPassword,
            name: input.name,
          },
        })
        .catch((error) => {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        });

      const token = await generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
      });
      return {
        token,
        user,
      };
    }),
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;
      const user = await ctx.db.user.findUnique({
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
      });

      return {
        token,
        user,
      };
    }),
});
