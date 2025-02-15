export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/serviser/:path*", "/client/:path*"],
}

