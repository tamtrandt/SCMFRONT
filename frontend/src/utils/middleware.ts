// /app/middleware.ts
import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const token = request.headers.get("authorization") || "";

  // Nếu không có token, chuyển hướng đến trang login
  if (!token && !request.url.includes("/auth/login")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next(); // Cho phép tiếp tục nếu có token
}

// Áp dụng middleware cho các route cần thiết
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"], // Chỉ áp dụng cho các trang này
};
