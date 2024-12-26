import { BiddingStatus, OrderStatus } from "@prisma/client";
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
  loadIncidents: publicProcedure.use(isAuthenticated).query(async ({ ctx }) => {
    return ctx.db.incident.findMany({
      where: {
        ownerId: ctx.user!.id,
      },
    });
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
        realId: order.id,
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

  createIncident: publicProcedure
    .use(isAuthenticated)
    .input(
      z.object({
        vehicleId: z.string(),
        description: z.string(),
        date: z.date(),
        location: z.string(),
        photos: z.array(z.string()),
        hitbox: z.array(z.number()), //.length(4),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.incident.create({
        data: {
          ...input,
          ownerId: ctx.user!.id,
        },
      });
    }),

  loadIncident: publicProcedure
    .use(isAuthenticated)
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.incident.findFirst({
        where: {
          id: input,
          ownerId: ctx.user!.id,
        },
        include: {
          bid: {
            include: {
              bids: {
                include: {
                  store: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }),

  // delete this
  demoBids: publicProcedure.query(async ({ ctx }) => {
    const incident = await ctx.db.incident.findFirst({
      where: {
        ownerId: ctx.user!.id,
      },
    });

    if (!incident) {
      throw new Error("No incidents found");
    }

    const bid = await ctx.db.biddingData.findFirst({
      where: {
        incidentId: incident.id,
      },
    });

    if (!bid) {
      throw new Error("No bids found");
    }

    // create 3 bids with random prices
    for (let i = 0; i < 3; i++) {
      await ctx.db.bidding.create({
        data: {
          biddingDataId: bid.id,
          price: Math.floor(Math.random() * 1000),
          storeId: "67117b5cc99cf86b0880b1f7",
          notes: "This is a demo bid",
          isFlexible: Math.random() > 0.5,
          description: "This is a demo bid",
          incidentId: incident.id,
        },
      });
    }
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
    .query(async ({ input }) => {
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

      return []; // TODO: implement this
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
  createBid: publicProcedure
    .use(isAuthenticated)
    .input(
      z.object({
        incidentId: z.string(),
        type: z.enum(["ALL", "FAVOURITES"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const isUserOwner = await ctx.db.incident.findFirst({
        where: {
          id: input.incidentId,
          ownerId: ctx.user!.id,
        },
      });

      if (!isUserOwner) {
        throw new Error("You are not the owner of this incident");
      }

      const bid = await ctx.db.biddingData.create({
        data: {
          incidentId: input.incidentId,
          type: input.type,
          dueDate: new Date(new Date().getTime() + 72 * 60 * 60 * 1000), // 72 hours from now
        },
      });

      return ctx.db.incident.update({
        where: {
          id: input.incidentId,
          ownerId: ctx.user!.id,
        },
        data: {
          bidId: bid.id,
          biddingStatus: BiddingStatus.STARTED,
        },
      });
    }),
});
