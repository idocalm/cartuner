import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/jwt";

const redirectToDashboard = (type: string) => {
  switch (type) {
    case "user":
      return "/screens/client/dashboard";
    case "mechanic":
      return "/screens/mechanic/dashboard";
    case "store_owner":
      return "/screens/owner/dashboard";
    case "admin":
      return "/screens/admin/dashboard";
    default:
      return "/auth/client/signin";
  }
};

const redirectToAuth = (type: string) => {
  switch (type) {
    case "user":
      return "/auth/client/signin";
    case "mechanic":
      return "/auth/mechanic/signin";
    case "admin":
      return "/auth/admin/signin";
    case "store_owner":
      return "/auth/mechanic/signin";
    default:
      return "/auth/client/signin";
  }
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token");

  const url = request.nextUrl.clone();

  if (request.nextUrl.pathname.startsWith("/screens/mechanic")) {
    if (!token) {
      url.pathname = redirectToAuth("mechanic");
      return NextResponse.redirect(url.toString());
    } else {
      const decoded = (await verifyToken(token.value)) as { type: string };
      if (!decoded || decoded.type != "mechanic") {
        url.pathname = redirectToAuth(decoded ? decoded.type : "mechanic");
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
      url.pathname = redirectToAuth("user");
      return NextResponse.redirect(url.toString());
    } else {
      const decoded = (await verifyToken(token.value)) as { type: string };
      if (!decoded || decoded.type !== "user") {
        url.pathname = redirectToAuth(decoded ? decoded.type : "user");
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
      url.pathname = redirectToAuth("admin");
      return NextResponse.redirect(url.toString());
    } else {
      const decoded = (await verifyToken(token.value)) as { type: string };
      if (!decoded || decoded.type !== "admin") {
        url.pathname = redirectToAuth(decoded ? decoded.type : "admin");
        return NextResponse.redirect(url.toString());
      } else {
        const response = NextResponse.next();
        response.headers.set("x-decoded-token", JSON.stringify(decoded));
        return response;
      }
    }
  }

  if (request.nextUrl.pathname.startsWith("/screens/owner")) {
    if (!token) {
      url.pathname = redirectToAuth("store_owner");
      return NextResponse.redirect(url.toString());
    } else {
      const decoded = (await verifyToken(token.value)) as { type: string };
      if (!decoded || decoded.type !== "store_owner") {
        url.pathname = redirectToAuth(decoded ? decoded.type : "store_owner");
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
      if (decoded) {
        url.pathname = redirectToDashboard(decoded.type);
        return NextResponse.redirect(url.toString());
      }
    }
  }

  if (request.nextUrl.pathname.startsWith("/auth/mechanic/")) {
    if (token) {
      const decoded = (await verifyToken(token.value)) as { type: string };
      if (decoded) {
        url.pathname = redirectToDashboard(decoded.type);
        return NextResponse.redirect(url.toString());
      }
    }
  }

  if (request.nextUrl.pathname.startsWith("/auth/admin")) {
    console.log("Admin auth route");
    if (token) {
      const decoded = (await verifyToken(token.value)) as { type: string };
      if (decoded) {
        url.pathname = redirectToDashboard(decoded.type);
        return NextResponse.redirect(url.toString());
      }
    }
  }

  return NextResponse.next();
}

// TODO: Make sure when a mechanic is deleted, they are automatically signed out if they are signed in
