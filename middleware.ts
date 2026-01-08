import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const firstSegment = pathname.split("/")[1]
  const locale = isLocale(firstSegment) ? firstSegment : DEFAULT_LOCALE

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-locale", locale)

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
}

