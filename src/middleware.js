import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname, searchParams } = req.nextUrl;
  const token = req.cookies.get("token");

  console.log("token",token)

  const origin = req.nextUrl.origin;

  try {
    if (!token || !token?.value) {
      if (pathname.includes("/login") || pathname === "/") {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/login", origin));
      }
    } else if (pathname === "/" || pathname.includes("/login")) {
      return NextResponse.redirect(new URL("/dashboard", origin));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)",
  ],
};
