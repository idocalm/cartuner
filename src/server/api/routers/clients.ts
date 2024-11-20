import { OrderStatus } from "@prisma/client";
import { z } from "zod";
import {
  createTRPCRouter,
  isAuthenticated,
  publicProcedure,
} from "~/server/api/trpc";
import crypto from "crypto";

const periodScheme = z.enum(["year", "week", "month", "lifetime"]);

export const clientsRouter = createTRPCRouter({
  name: publicProcedure.use(isAuthenticated).query(async ({ ctx }) => {
    return ctx.user?.name;
  }),
  avatar: publicProcedure.use(isAuthenticated).query(async ({ ctx }) => {
    const user = await ctx.db.clientUser.findUnique({
      where: {
        id: ctx.user!.id,
      },
    });

    return user?.avatar;
  }),
  changeProfile: publicProcedure
    .use(isAuthenticated)
    .input(
      z.object({
        name: z.string().optional(),
        img: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.clientUser.update({
        where: {
          id: ctx.user!.id,
        },
        data: {
          name: input.name,
          avatar: input.img,
        },
      });
    }),

  getOrders: publicProcedure.use(isAuthenticated).query(async ({ ctx }) => {
    // we need to find all orders made in the last 30 days that are not cancelled nor delivered, unless they are from the last 4 days.
    // For each order, we need to find the products that were bought, and return a Product[] array, in addition to the order id, date, and status, and any notes on it.
    // In addition we need to find the store that sold the product, and return the store name and email/phone number.

    const orders = await ctx.db.storeOrder.findMany({
      where: {
        customerId: ctx.user!.id,
        status: {
          not: OrderStatus.CANCELLED || OrderStatus.DELIVERED,
        },
        createdAt: {
          gt: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const storeIds = orders.map((order) => order.storeId);
    const stores = await ctx.db.store.findMany({
      where: {
        id: {
          in: storeIds,
        },
      },
      select: {
        name: true,
        phone: true,
        id: true,
      },
    });

    const storeOrders = await ctx.db.storeOrder.findMany({
      where: {
        id: {
          in: orders.map((order) => order.id),
        },
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    return orders.map((order) => {
      const store = stores.find((store) => store.id === order.storeId);
      const storeOrder = storeOrders.find(
        (storeOrder) => storeOrder.id === order.id
      );

      const products = storeOrder?.products.map((entry) => {
        return entry.product;
      });

      if (!store) {
        return null;
      }

      return {
        id: crypto
          .createHash("sha256")
          .update(order.id)
          .digest("hex")
          .substring(0, 8)
          .toUpperCase(),
        date: order.createdAt,
        status: order.status,
        notes: order.notes,
        store: {
          name: store.name,
          phone: store.phone,
        },
        createdAt: order.createdAt,
        products: products,
      };
    });
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
