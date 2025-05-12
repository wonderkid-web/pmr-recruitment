import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const role = req.cookies.get("id")?.value;

  if (!role) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const url = req.nextUrl.pathname;

  if (role === "admin") {
    return NextResponse.next();
  } else {
    // if (role === "MANAGER") {
    //    if (
    //       url.includes("/dashboard/schedule")
    //    ) {
    //       return NextResponse.next();
    //    } else {
    //       return NextResponse.redirect(new URL("/dashboard", req.url));
    //    }
    // }

    if (url.includes("/member")) {
      return NextResponse.next();
    }
  }

  return NextResponse.redirect(new URL("/auth/login", req.url));
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
