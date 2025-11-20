import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname === "/dashboard/login") {
    return NextResponse.next()
  }

  if (pathname.startsWith("/dashboard")) {
    const adminAuth = request.cookies.get("admin-auth")?.value

    if (!adminAuth) {
      return NextResponse.redirect(new URL("/dashboard/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
