import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/jwt";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token");

  const url = request.nextUrl.clone();

  if (request.nextUrl.pathname.startsWith("/screens/mechanic")) {
    if (!token) {
      url.pathname = "/auth/mechanic/signin";
      return NextResponse.redirect(url.toString());
    } else {
      const decoded = (await verifyToken(token.value)) as { type: string };
      if (
        !decoded ||
        (decoded.type != "mechanic" && decoded.type != "store_owner")
      ) {
        url.pathname = "/auth/mechanic/signin";
        return NextResponse.redirect(url.toString());
      } else {
        const response = NextResponse.next();
        response.headers.set("x-decoded-token", JSON.stringify(decoded));
        return response;
      }
    }
  }

  if (request.nextUrl.pathname.startsWith("/screens/client")) {
    if (!token) {
      url.pathname = "/auth/client/signin";
      return NextResponse.redirect(url.toString());
    } else {
      const decoded = (await verifyToken(token.value)) as { type: string };
      if (!decoded || decoded.type !== "user") {
        url.pathname = "/auth/client/signin";
        return NextResponse.redirect(url.toString());
      } else {
        const response = NextResponse.next();
        response.headers.set("x-decoded-token", JSON.stringify(decoded));
        return response;
      }
    }
  }

  if (request.nextUrl.pathname.startsWith("/screens/admin")) {
    if (!token) {
      url.pathname = "/auth/admin/signin";
      return NextResponse.redirect(url.toString());
    } else {
      const decoded = (await verifyToken(token.value)) as { type: string };
      if (!decoded || decoded.type !== "admin") {
        url.pathname = "/auth/admin/signin";
        return NextResponse.redirect(url.toString());
      } else {
        const response = NextResponse.next();
        response.headers.set("x-decoded-token", JSON.stringify(decoded));
        return response;
      }
    }
  }

  if (request.nextUrl.pathname.startsWith("/auth/client/")) {
    if (token) {
      const decoded = (await verifyToken(token.value)) as { type: string };
      if (decoded && decoded.type === "user") {
        url.pathname = "/screens/client/dashboard";
        return NextResponse.redirect(url.toString());
      }
    }
  }

  if (request.nextUrl.pathname.startsWith("/auth/mechanic/")) {
    if (token) {
      const decoded = (await verifyToken(token.value)) as { type: string };
      if (
        decoded &&
        (decoded.type === "mechanic" || decoded.type === "store_owner")
      ) {
        url.pathname = "/screens/mechanic/dashboard";
        return NextResponse.redirect(url.toString());
      }
    }
  }

  if (request.nextUrl.pathname.startsWith("/auth/admin")) {
    console.log("Admin auth route");
    if (token) {
      const decoded = (await verifyToken(token.value)) as { type: string };
      if (decoded && decoded.type === "admin") {
        url.pathname = "/screens/admin/dashboard";
        return NextResponse.redirect(url.toString());
      }
    }
  }

  return NextResponse.next();
}
