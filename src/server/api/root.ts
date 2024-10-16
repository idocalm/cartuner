import { authRouter } from "~/server/api/routers/auth";
import { clientsRouter } from "~/server/api/routers/clients";
import { mechanicsRouter } from "~/server/api/routers/mechanics";
import { storeRouter } from "~/server/api/routers/store";
import { adminRouter } from "~/server/api/routers/admin";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  clients: clientsRouter,
  mechanics: mechanicsRouter,
  store: storeRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
