import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if we are trying to access a protected route
  if (request.nextUrl.pathname.startsWith("/client-relations-management")) {
    // Check for the dummy auth cookie
    const authCookie = request.cookies.get("almaster-auth");
    
    // If no cookie exists, redirect to the login page
    if (!authCookie || authCookie.value !== "true") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If we are on the login page but already authenticated, redirect to CRM
  if (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/") {
    const authCookie = request.cookies.get("almaster-auth");
    if (authCookie && authCookie.value === "true") {
      return NextResponse.redirect(new URL("/client-relations-management", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/client-relations-management/:path*",
    "/login",
    "/"
  ],
};
