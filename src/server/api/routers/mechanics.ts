import { z } from "zod";
import {
  createTRPCRouter,
  isAuthenticated,
  publicProcedure,
} from "~/server/api/trpc";
import bcrypt from "bcryptjs";
import { generateToken, TokenType } from "~/lib/jwt";
import { TRPCError } from "@trpc/server";

export const mechanicsRouter = createTRPCRouter({
  createStore: publicProcedure
    .input(
      z.object({
        name: z.string(),
        establishedAt: z.date(),
        url: z.string().url({
          message: "Invalid URL",
        }),
        phone: z.string(),
        country: z.string(),
        city: z.string(),
        postalCode: z.string(),
        address: z.string(),
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const store = await ctx.db.store.create({
        data: {
          name: input.name,
          establishedAt: input.establishedAt,
          url: input.url,
          phone: input.phone,
          country: input.country,
          city: input.city,
          postalCode: input.postalCode,
          address: input.address,
        },
      });
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const ownerUser = await ctx.db.mechanicUser.create({
        data: {
          email: input.email,
          password: hashedPassword,
        },
      });

      await ctx.db.store.update({
        where: {
          id: store.id,
        },
        data: {
          ownerId: ownerUser.id,
        },
      });

      const token = await generateToken({
        id: ownerUser.id,
        email: ownerUser.email,
        name: input.name + " owner",
        type: TokenType.Mechanic,
      });

      return {
        token,
        user: ownerUser,
        store: store,
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
      const user = await ctx.db.mechanicUser.findUnique({
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
        name: "Mechanic",
        type: TokenType.Mechanic,
      });

      return {
        token,
        user,
      };
    }),
});
