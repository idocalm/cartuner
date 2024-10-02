import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/jwt";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token");

  const url = request.nextUrl.clone();
  console.log("URL", url.toString());

  if (
    request.nextUrl.pathname.startsWith("/client/") ||
    request.nextUrl.pathname.startsWith("/mechanic/")
  ) {
    if (!token) {
      url.pathname = "/auth/signin";
      return NextResponse.redirect(url.toString());
    } else {
      const decoded = await verifyToken(token.value);
      if (!decoded) {
        url.pathname = "/auth/signin";
        return NextResponse.redirect(url.toString());
      }
    }
  }

  if (request.nextUrl.pathname.startsWith("/auth/")) {
    if (token) {
      const decoded = await verifyToken(token.value);
      if (decoded) {
        url.pathname = "/client/dashboard";
        return NextResponse.redirect(url.toString());
      }
    }
  }

  return NextResponse.next();
}
