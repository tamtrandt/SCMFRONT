/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('access_token')?.value; // Get access token from cookies
    const pathname = request.nextUrl.pathname; // Current path

    // Allow access to these public pages without authentication
    const publicPaths = ['/', '/auth/register', '/auth/verify', '/auth/login'];
    if (publicPaths.includes(pathname)) {
        return NextResponse.next();
    }

    // Redirect to login if no access token and not on a public page
    if (!accessToken) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // If access token exists, decode the token and check user role
    const { role } = decodeToken(accessToken);

    // Redirect based on role and current path
    if (role === 'customer' && pathname === '/dashboard') {
        return NextResponse.redirect(new URL('/home/products', request.url));
    }

    if (role === 'admin' && pathname === '/home') {
        return NextResponse.redirect(new URL('/dashboard/products', request.url));
    }

    // Allow access if no role restrictions are violated
    return NextResponse.next();
}

// Function to decode JWT and handle errors if the token is invalid
function decodeToken(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const decodedValue = JSON.parse(Buffer.from(base64Url, 'base64').toString());
        return decodedValue;
    } catch (error) {
        console.error('Invalid token:', error);
        return { role: null }; // Return a default role when decoding fails
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image).*)'], // Apply to all routes except API and static assets
};
