/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('access_token'); // Lấy access token từ cookies
    const userData = typeof window !== 'undefined' ? localStorage.getItem("user_data") : null; // Lấy user data từ localStorage
    let userRole = null;

    // Nếu userData tồn tại, parse nó để lấy role
    if (userData) {
        try {
            const parsedUserObject = JSON.parse(userData);
            userRole = parsedUserObject.role; // Lưu vai trò người dùng
        } catch (error) {
            console.error("Error parsing user data:", error);
        }
    }

    const pathname = request.nextUrl.pathname;

    // Cho phép truy cập vào trang chính ("/") mà không cần access token
    if (pathname === '/') {
        return NextResponse.next();
    }

    // Kiểm tra xem user có token không
    if (!accessToken) {
        return NextResponse.redirect(new URL('/auth/login', request.url)); // Chuyển hướng về trang đăng nhập nếu không có token
    }
   



     

    return NextResponse.next(); // Cho phép truy cập nếu không có vấn đề gì
}

export const config = {
    matcher: ['/((?!api|auth|_next/static|_next/image).*)'], // Chỉ áp dụng middleware cho các route không phải API hoặc static
};
