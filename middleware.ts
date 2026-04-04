import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  // Temporary Auth Bypass: Allow all traffic to proceed without login.
  return NextResponse.next();
}

export const config = {
  matcher: ["/simulator/:path*", "/chart/:path*", "/menu/:path*", "/settings/:path*", "/login"],
};
