import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  ApiError,
  CheckoutPaymentIntent,
  Client,
  Environment,
  LogLevel,
  OrdersController,
  PaymentsController,
} from "@paypal/paypal-server-sdk";

import paypal from "@paypal/checkout-server-sdk";

export const paymentRouter = createTRPCRouter({
  initPayment: publicProcedure
    .input(
      z.object({
        storeId: z.string(),
        total: z.number(),
        type: z.enum(["paypal", "stripe"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.type === "paypal") {
        const client = new Client({
          clientCredentialsAuthCredentials: {
            oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
            oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!,
          },
          timeout: 0,
          environment: Environment.Sandbox,
          logging: {
            logLevel: LogLevel.Info,
            logRequest: { logBody: true },
            logResponse: { logBody: true },
          },
        });
        const ordersController = new OrdersController(client);

        const collect = {
          body: {
            intent: CheckoutPaymentIntent.Capture,
            purchaseUnits: [
              {
                amount: {
                  currencyCode: "USD",
                  value: input.total.toString(),
                },
              },
            ],
          },
          prefer: "return=representation",
        };

        try {
          const { body, ...httpResponse } =
            await ordersController.ordersCreate(collect);
          const { statusCode, headers } = httpResponse;
          const bodyParsed = JSON.parse(body as string);
          const { id } = bodyParsed;

          console.log("Status Code: " + statusCode);
          console.log("ID: " + id);

          return id;
        } catch (error) {
          if (error instanceof ApiError) {
            return {
              status: error.statusCode,
              response: error.message,
            };
          }
        }

        return {
          status: 500,
          response: "Internal Server Error",
        };
      }
    }),
  capturePayment: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const client = new Client({
        clientCredentialsAuthCredentials: {
          oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
          oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!,
        },
        timeout: 0,
        environment: Environment.Sandbox,
        logging: {
          logLevel: LogLevel.Info,
          logRequest: { logBody: true },
          logResponse: { logBody: true },
        },
      });
      const ordersController = new OrdersController(client);

      const collect = {
        id: input,
        prefer: "return=representation",
      };

      try {
        const { body, ...httpResponse } =
          await ordersController.ordersCapture(collect);
        return {
          jsonResponse: body,
          httpStatusCode: httpResponse.statusCode,
        };
      } catch (error) {
        if (error instanceof ApiError) {
          // const { statusCode, headers } = error;
          throw new Error(error.message);
        }
      }

      throw new Error("Internal Server Error");
    }),
});
