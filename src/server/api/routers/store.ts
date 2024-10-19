import { z } from "zod";
import {
  createTRPCRouter,
  isAuthenticated,
  publicProcedure,
} from "~/server/api/trpc";

export const storeRouter = createTRPCRouter({
  fetch: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.store.findFirst({
      where: {
        id: input,
      },
    });
  }),
  updateName: publicProcedure
    .use(isAuthenticated)
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.store.update({
        where: {
          id: input.id,
          ownerId: ctx.user!.id,
        },
        data: {
          name: input.name,
        },
      });
    }),
  updateImage: publicProcedure
    .use(isAuthenticated)
    .input(
      z.object({
        id: z.string(),
        image: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.store.update({
        where: {
          id: input.id,
          ownerId: ctx.user!.id,
        },
        data: {
          image: input.image,
        },
      });
    }),
  getOwner: publicProcedure
    .use(isAuthenticated)
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const store = await ctx.db.store.findFirst({
        where: {
          id: input,
          ownerId: ctx.user!.id,
        },
      });

      if (!store) {
        return null;
      }

      return ctx.db.storeOwnerUser.findFirst({
        where: {
          id: store.ownerId || "",
        },
      });
    }),
  newMechanic: publicProcedure
    .use(isAuthenticated)
    .input(
      z.object({
        storeId: z.string(),
        name: z.string(),
        email: z.string(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.mechanicUser.create({
        data: {
          password: input.password,
          name: input.name,
          email: input.email,
          createdAt: new Date(),
          stores: {
            create: {
              storeId: input.storeId,
            },
          },
        },
      });
    }),

  getMechanics: publicProcedure
    .use(isAuthenticated)
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.mechanicUser.findMany({
        where: {
          stores: {
            some: {
              storeId: input,
            },
          },
        },
      });
    }),
});
