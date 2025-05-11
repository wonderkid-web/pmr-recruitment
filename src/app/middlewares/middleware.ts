import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
   const role = req.cookies.get("role")?.value;

   if (!role) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
   }

   const url = req.nextUrl.pathname;

   if (role === "ADMIN") {
      return NextResponse.next();
   }

   if (role === "MANAGER") {
      if (
         url.includes("/dashboard/schedule")
      ) {
         return NextResponse.next();
      } else {
         return NextResponse.redirect(new URL("/dashboard", req.url));
      }
   }

   if (role === "MEMBER") {
      if (url.includes("/dashboard/record")) {
         return NextResponse.next();
      } else {
         return NextResponse.redirect(new URL("/dashboard", req.url));
      }
   }

   return NextResponse.redirect(new URL("/auth/login", req.url));
}

export const config = {
   matcher: ["/dashboard/:path*"],
};
