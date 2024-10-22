import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

import { env } from "~/env";
import { verifyToken } from "~/lib/jwt";
import { appRouter } from "~/server/api/root";
import { createTRPCContext, type UserInterface } from "~/server/api/trpc";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async (req: NextRequest) => {
  const token = req.cookies.get("auth-token");
  let user = null;
  if (token) {
    const decoded = await verifyToken(token.value);

    if (!decoded) {
      return createTRPCContext({
        headers: req.headers,
        user: null,
      });
    }

    user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
    } as UserInterface;
  }

  return createTRPCContext({
    headers: req.headers,
    user,
  });
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          }
        : undefined,
  });

export { handler as GET, handler as POST };
