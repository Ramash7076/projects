import { NextResponse } from "next/server";

export function GET() {
    const res = NextResponse.json({ success: true });

    res.cookies.set("token", "", {
        httpOnly: true,
        secure: true,
        path: "/",
        expires: new Date(0), // instantly expire cookie
    });

    return res;
}
