import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./app/lib/sessions";

export function middleware(request: NextRequest) {
    const user = getSession()
    if (!user) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url);
    }
}

export const config = {
    matcher: ['/finances', '/finances/:path*']
}