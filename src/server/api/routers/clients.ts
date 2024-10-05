import { z } from "zod";
import {
  createTRPCRouter,
  isAuthenticated,
  publicProcedure,
} from "~/server/api/trpc";

export const clientsRouter = createTRPCRouter({
  name: publicProcedure.use(isAuthenticated).query(async ({ ctx }) => {
    return ctx.user?.name;
  }),
  vehicles: publicProcedure
    .use(isAuthenticated)
    .input(z.object({ type: z.string() }))
    .query(async ({ ctx, input }) => {
      if (input?.type === "all") {
        return ctx.db.vehicle.findMany({
          where: {
            type: input.type,
            ownerId: ctx.user!.id,
          },
        });
      }

      return ctx.db.vehicle.findMany({
        where: {
          ownerId: ctx.user!.id,
          type: input.type,
        },
      });
    }),

  createVehicle: publicProcedure
    .use(isAuthenticated)
    .input(
      z.object({
        brand: z.string(),
        model: z.string(),
        year: z.number(),
        plate: z.string(),
        name: z.string(),
        type: z.string(),
        vin: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.vehicle.create({
        data: {
          ...input,
          ownerId: ctx.user!.id,
        },
      });
    }),

  deleteVehicle: publicProcedure
    .use(isAuthenticated)
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.vehicle.delete({
        where: {
          id: input.id,
          ownerId: ctx.user!.id,
        },
      });
    }),
});
