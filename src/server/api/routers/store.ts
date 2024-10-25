import { z } from "zod";
import {
  createTRPCRouter,
  isAuthenticated,
  publicProcedure,
} from "~/server/api/trpc";
import { generateToken, TokenType } from "~/lib/jwt";
import bcrypt from "bcryptjs";

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
});
