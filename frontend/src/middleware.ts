/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('access_token')?.value; // Lấy access token từ cookies
    const pathname = request.nextUrl.pathname; // Đường dẫn hiện tại

    if (pathname === '/') {
        return NextResponse.next();
    }

    // Nếu đang ở trang đăng nhập và đã có access token, chuyển về đúng trang theo role
    // if (pathname === '/auth/login' && accessToken) {
    //     const { role } = decodeToken(accessToken);
    //     const redirectPath = role === 'admin' ? '/dashboard' : '/home';
    //     return NextResponse.redirect(new URL(redirectPath, request.url));
    // }

    // Nếu không có access token và không phải trang login, chuyển hướng về trang đăng nhập
    if (!accessToken && pathname !== '/auth/login') {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Nếu có access token, kiểm tra role và phân quyền
    if (accessToken) {
        const { role } = decodeToken(accessToken);

        // Phân quyền dựa trên role
        if (role === 'customer' && pathname === '/dashboard') {
            return NextResponse.redirect(new URL('/home', request.url));
        }

        if (role === 'admin' && pathname === '/home') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    // Cho phép truy cập nếu không có vi phạm phân quyền
    return NextResponse.next();
}

// Hàm giải mã JWT, thêm xử lý lỗi nếu token không hợp lệ
function decodeToken(token: any) {
    try {
        const base64Url = token.split('.')[1];
        const decodedValue = JSON.parse(Buffer.from(base64Url, 'base64').toString());
        return decodedValue;
    } catch (error) {
        console.error('Invalid token:', error);
        return { role: null };
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image).*)'], // Áp dụng cho tất cả các route trừ API và static
};
