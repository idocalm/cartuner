import { z } from "zod";
import { EventEmitter } from "events";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// we are going to save each socket 


const emitter = new EventEmitter();

export const adminRouter = createTRPCRouter({
  createAlert: publicProcedure.mutation(async ({ ctx, input }) => {
    emitter.emit("alert", input);
  }),
});
