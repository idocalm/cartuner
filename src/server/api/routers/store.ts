import { z } from "zod";
import {
  createTRPCRouter,
  isAuthenticated,
  publicProcedure,
} from "~/server/api/trpc";

export const storeRouter = createTRPCRouter({
  fetch: publicProcedure
    .use(isAuthenticated)
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.store.findFirst({
        where: {
          id: input,
        },
      });
    }),
});
