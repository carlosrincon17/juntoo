import { NextRequest, NextResponse } from "next/server";
import { USER_KEY } from "@/utils/storage/constants";

export function middleware(request: NextRequest) {
    const user = request.cookies.get(USER_KEY);
    if (!user) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url);
    }
}

export const config = {
    matcher: ['/dashboard', '/dashboard/:path*']
}