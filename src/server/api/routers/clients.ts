import { z } from "zod";
import {
  createTRPCRouter,
  isAuthenticated,
  publicProcedure,
} from "~/server/api/trpc";

const periodScheme = z.enum(["year", "week", "month", "lifetime"]);

export const clientsRouter = createTRPCRouter({
  name: publicProcedure.use(isAuthenticated).query(async ({ ctx }) => {
    return ctx.user?.name;
  }),
  vehicles: publicProcedure
    .use(isAuthenticated)
    .input(z.string())
    .query(async ({ ctx, input }) => {
      if (input === "all") {
        return ctx.db.vehicle.findMany({
          where: {
            type: input,
            ownerId: ctx.user!.id as string,
          },
        });
      }

      return ctx.db.vehicle.findMany({
        where: {
          ownerId: ctx.user!.id,
          type: input,
        },
      });
    }),

  createVehicle: publicProcedure
    .use(isAuthenticated)
    .input(
      z.object({
        brand: z.string(),
        model: z.string(),
        year: z
          .number({
            message: "Year must be a number",
          })
          .min(1900, {
            message: "Year must be at least 1900",
          })
          .max(new Date().getFullYear() + 1, {
            message: "Year must be at most the current year",
          }),
        plate: z.string({
          message: "Plate number must be a string",
        }),
        name: z.string({
          message: "Name must be a string",
        }),
        type: z.string({
          message: "Type must be a string",
        }),
        vin: z
          .string({
            message: "VIN number must be a string",
          })
          .min(17, {
            message: "VIN number must be 17 characters long",
          })
          .max(17, {
            message: "VIN number must be 17 characters long",
          }),
        notes: z.string({
          message: "Notes must be a string",
        }),
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
  findVehicleById: publicProcedure
    .use(isAuthenticated)
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.vehicle.findFirst({
        where: {
          id: input,
          ownerId: ctx.user!.id,
        },
      });
    }),

  loadVehicleIncidents: publicProcedure
    .use(isAuthenticated)
    .input(z.object({ vehicleId: z.string(), period: periodScheme }))
    .query(async ({ ctx, input }) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      switch (input.period) {
        case "week":
          date.setDate(date.getDate() - 7);
          break;
        case "month":
          date.setMonth(date.getMonth() - 1);
          break;
        case "year":
          date.setFullYear(date.getFullYear() - 1);
          break;
        case "lifetime":
          date.setFullYear(0);
          break;
      }

      return ctx.db.incident.findMany({
        where: {
          vehicleId: input.vehicleId,
          ownerId: ctx.user!.id,
          createdAt: {
            gte: date,
          },
        },
      });
    }),

  loadVehicleRepairs: publicProcedure
    .use(isAuthenticated)
    .input(z.object({ vehicleId: z.string(), period: periodScheme }))
    .query(async ({ ctx, input }) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      switch (input.period) {
        case "week":
          date.setDate(date.getDate() - 7);
          break;
        case "month":
          date.setMonth(date.getMonth() - 1);
          break;
        case "year":
          date.setFullYear(date.getFullYear() - 1);
          break;
        case "lifetime":
          date.setFullYear(0);
          break;
      }

      return ctx.db.repair.findMany({
        where: {
          vehicleId: input.vehicleId,
          ownerId: ctx.user!.id,
          createdAt: {
            gte: date,
          },
        },
      });
    }),

  updateVehicleNotes: publicProcedure
    .use(isAuthenticated)
    .input(
      z.object({
        id: z.string(),
        notes: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.vehicle.update({
        where: {
          id: input.id,
          ownerId: ctx.user!.id,
        },
        data: {
          notes: input.notes,
        },
      });
    }),
});
