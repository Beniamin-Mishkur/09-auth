// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // передаємо куки з request далі
  const cookieHeader = request.headers.get("cookie") || "";

  // Перевірка для публічних маршрутів
  if (isPublicRoute) {
    const res = await fetch(`${request.nextUrl.origin}/api/auth/session`, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.success) {
        // авторизований користувач не повинен бачити sign-in/up
        return NextResponse.redirect(new URL("/profile", request.url));
      }
    }
    return NextResponse.next();
  }

  // Перевірка для приватних маршрутів
  if (isPrivateRoute) {
    const res = await fetch(`${request.nextUrl.origin}/api/auth/session`, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    const data = await res.json();
    if (!data?.success) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
