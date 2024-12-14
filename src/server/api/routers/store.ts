import { z } from "zod";
import {
  createTRPCRouter,
  isAuthenticated,
  publicProcedure,
} from "~/server/api/trpc";
import { generateToken, TokenType } from "~/lib/jwt";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { OrderStatus } from "@prisma/client";

export const storeRouter = createTRPCRouter({
  fetch: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.store.findFirst({
      where: {
        id: input,
      },
    });
  }),
  fetchByOwner: publicProcedure.use(isAuthenticated).query(async ({ ctx }) => {
    return ctx.db.store.findMany({
      where: {
        ownerId: ctx.user!.id,
      },
    });
  }),
  updateSaleNotes: publicProcedure
    .use(isAuthenticated)
    .input(
      z.object({
        orderId: z.string(),
        notes: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const storeOrder = await ctx.db.storesOrders.findFirst({
        where: {
          orderId: input.orderId,
          store: {
            ownerId: ctx.user!.id,
          },
        },
      });

      if (!storeOrder) {
        throw new Error("Invalid order");
      }

      const result = await ctx.db.storeOrder.update({
        where: {
          id: input.orderId,
        },
        data: {
          notes: input.notes,
        },
      });

      return {
        notes: result.notes,
        orderId: result.id,
      };
    }),

  updateSaleStatus: publicProcedure
    .use(isAuthenticated)
    .input(
      z.object({
        orderId: z.string(),
        status: z.enum([
          OrderStatus.PLACED,
          OrderStatus.PROCESSED,
          OrderStatus.SHIPPED,
          OrderStatus.CANCELLED,
          OrderStatus.DELIVERED,
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const storeOrder = await ctx.db.storesOrders.findFirst({
        where: {
          orderId: input.orderId,
          store: {
            ownerId: ctx.user!.id,
          },
        },
      });

      if (!storeOrder) {
        throw new Error("Invalid order");
      }

      const result = await ctx.db.storeOrder.update({
        where: {
          id: input.orderId,
        },
        data: {
          status: input.status,
        },
      });

      return {
        newStatus: result.status,
        orderId: result.id,
      };
    }),
  fetchByMechanic: publicProcedure
    .use(isAuthenticated)
    .query(async ({ ctx }) => {
      return ctx.db.store.findMany({
        where: {
          mechanics: {
            some: {
              mechanicId: ctx.user!.id,
            },
          },
        },
      });
    }),
  search: publicProcedure
    .use(isAuthenticated)
    .input(
      z.object({
        type: z.enum(["name", "city", "country"]),
        query: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.type === "name") {
        return ctx.db.store.findMany({
          where: {
            name: {
              contains: input.query,
              mode: "insensitive",
            },
          },
        });
      }

      if (input.type === "city") {
        return ctx.db.store.findMany({
          where: {
            city: {
              contains: input.query,
              mode: "insensitive",
            },
          },
        });
      }

      if (input.type === "country") {
        return ctx.db.store.findMany({
          where: {
            country: {
              contains: input.query,
              mode: "insensitive",
            },
          },
        });
      }

      return [];
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
    .input(
      z.object({
        inviteToken: z.string(),
        name: z.string(),
        email: z.string(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const inviteToken = await ctx.db.inviteToken.findFirst({
        where: {
          id: Buffer.from(input.inviteToken, "base64").toString(),
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!inviteToken) {
        throw new Error("Invalid token");
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const user = await ctx.db.mechanicUser.create({
        data: {
          password: hashedPassword,
          name: input.name,
          email: input.email,
          createdAt: new Date(),
          stores: {
            create: {
              storeId: inviteToken.storeId,
            },
          },
        },
      });

      const token = await generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
        type: TokenType.Mechanic,
      });

      return {
        token,
        user,
      };
    }),
  deleteMechanic: publicProcedure
    .use(isAuthenticated)
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const owner = await ctx.db.storeOwnerUser.findFirst({
        where: {
          id: ctx.user!.id,
          stores: {
            some: {
              mechanics: {
                some: {
                  mechanicId: input,
                },
              },
            },
          },
        },
      });

      if (!owner) {
        throw new Error("Not the owner of this store");
      }

      // Delete the mechanic from the store mechanics connecting table, and from any stores they are connected to

      await ctx.db.mechanicsStores.deleteMany({
        where: {
          mechanicId: input,
        },
      });

      return ctx.db.mechanicUser.delete({
        where: {
          id: input,
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
  requestInvite: publicProcedure
    .use(isAuthenticated)
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const owner = await ctx.db.storeOwnerUser.findFirst({
        where: {
          id: ctx.user!.id,
          stores: {
            some: {
              id: input,
            },
          },
        },
      });

      if (!owner) {
        throw new Error("Not the owner of this store");
      }

      const token = await ctx.db.inviteToken.create({
        data: {
          storeId: input,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
      });

      // 5 * 60 * 1000 = 5 minutes

      const base64 = Buffer.from(token.id).toString("base64");
      return base64;
    }),

  validateInvite: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const id = Buffer.from(input, "base64").toString();
      const token = await ctx.db.inviteToken.findFirst({
        where: {
          id,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!token) {
        throw new Error("Invalid token");
      }

      const store = await ctx.db.store.findFirst({
        where: {
          id: token.storeId,
        },
      });

      return {
        store,
        token,
      };
    }),

  getProducts: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.product.findMany({
        where: {
          storeId: input,
        },
      });
    }),
  createProduct: publicProcedure
    .use(isAuthenticated)
    .input(
      z.object({
        storeId: z.string(),
        name: z.string(),
        price: z.number(),
        description: z.string(),
        category: z.string(),
        image: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.product.create({
        data: {
          ...input,
        },
      });
    }),
  isOwner: publicProcedure
    .use(isAuthenticated)
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const owner = ctx.db.storeOwnerUser.findFirst({
        where: {
          id: ctx.user!.id,
          stores: {
            some: {
              id: input,
            },
          },
        },
      });
      return owner !== null;
    }),

  updateProduct: publicProcedure
    .use(isAuthenticated)
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // check that the user is the owner of the store
      const owner = await ctx.db.storeOwnerUser.findFirst({
        where: {
          id: ctx.user!.id,
          stores: {
            some: {
              products: {
                some: {
                  id: input.id,
                },
              },
            },
          },
        },
      });

      if (!owner) {
        throw new Error("Not the owner of this store");
      }

      return ctx.db.product.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          price: input.price,
          description: input.description,
        },
      });
    }),

  createSale: publicProcedure
    .use(isAuthenticated)
    .input(
      z.object({
        storeId: z.string(),
        products: z.array(
          z.object({
            productId: z.string(),
            quantity: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const store = await ctx.db.store.findFirst({
        where: {
          id: input.storeId,
        },
      });

      if (!store) {
        throw new Error("Store not found");
      }

      const products = await ctx.db.product.findMany({
        where: {
          id: {
            in: input.products.map((product) => product.productId),
          },
        },
      });

      if (products.length !== input.products.length) {
        throw new Error("Invalid product");
      }

      const order = await ctx.db.storeOrder.create({
        data: {
          storeId: input.storeId,
          customerId: ctx.user!.id,
          total: products.reduce((acc, product) => {
            const productQuantity = input.products.find(
              (p) => p.productId === product.id
            )!.quantity;

            return acc + product.price * productQuantity;
          }, 0),
          products: {
            create: input.products.map((product) => ({
              product: {
                connect: {
                  id: product.productId,
                },
              },
              quantity: product.quantity,
            })),
          },
        },
      });

      const storeOrder = await ctx.db.storesOrders.create({
        data: {
          storeId: input.storeId,
          orderId: order.id,
        },
      });

      return storeOrder;
    }),

  fetchSales: publicProcedure
    .use(isAuthenticated)
    .input(z.string())
    .query(async ({ ctx, input }) => {
      // validate that the user is the owner of the store
      const owner = await ctx.db.storeOwnerUser.findFirst({
        where: {
          id: ctx.user!.id,
          stores: {
            some: {
              id: input,
            },
          },
        },
      });

      if (!owner) {
        throw new Error("Not the owner of this store");
      }

      // last month sales and no more than 10
      /* each record has a storeId, orderId and an order object attached, so the createdAt is actually an attribute of the order
       */

      const storeOrders = await ctx.db.storesOrders.findMany({
        where: {
          storeId: input,
          order: {
            createdAt: {
              gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
        orderBy: {
          order: {
            createdAt: "desc",
          },
        },
        take: 10,
      });
      /* filter the results to only include the order object */

      /* build a list of orders based on the results .orderId */

      const orders = storeOrders.map((storeOrder) => storeOrder.orderId);

      /* fetch the order objects */
      const ordersDetails = await ctx.db.storeOrder.findMany({
        where: {
          id: {
            in: orders,
          },
        },
      });

      const customers = await ctx.db.clientUser.findMany({
        where: {
          id: {
            in: ordersDetails.map((order) => order.customerId),
          },
        },
      });

      const products = await ctx.db.ordersProducts.findMany({
        where: {
          orderId: {
            in: orders,
          },
        },
      });

      const finalOrders = ordersDetails.map((order) => {
        const orderProducts = products.filter(
          (product) => product.orderId === order.id
        );

        return {
          ...order,
          customer: customers.find(
            (customer) => customer.id === order.customerId
          ),
          products: orderProducts,
          id: crypto
            .createHash("sha256")
            .update(order.id)
            .digest("hex")
            .substring(0, 8)
            .toUpperCase(),
          realId: order.id,
        };
      });

      return finalOrders;
    }),
  deleteOrder: publicProcedure
    .use(isAuthenticated)
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      console.log(input);

      const storeOrder = await ctx.db.storesOrders.findFirst({
        where: {
          orderId: input,
          order: {
            customerId: ctx.user!.id,
          },
        },
      });

      if (!storeOrder) {
        throw new Error("Invalid order");
      }

      const order = await ctx.db.storeOrder.findFirst({
        where: {
          id: input,
        },
      });

      if (!order) {
        throw new Error("Order not found");
      }

      if (order.status !== OrderStatus.PLACED) {
        throw new Error("Order cannot be deleted");
      }

      await ctx.db.ordersProducts.deleteMany({
        where: {
          orderId: input,
        },
      });

      await ctx.db.storesOrders.delete({
        where: {
          id: storeOrder.id,
        },
      });

      await ctx.db.storeOrder.delete({
        where: {
          id: input,
        },
      });

      return true;
    }),
});
