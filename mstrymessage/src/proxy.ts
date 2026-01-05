import { NextRequest, NextResponse } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from 'next-auth/jwt'

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {

  const token = await getToken({ req: request })
  const url = request.nextUrl

  // if (token &&
  //   (
  //     url.pathname.startsWith('/sign-in') ||
  //     url.pathname.startsWith('/sign-up') ||
  //     url.pathname.startsWith('/verify') ||
  //     url.pathname.startsWith('/')
  //   )
  // ) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url))
  // }

  //   if (!token && url.pathname.startsWith('/dashboard')) {
  //     return NextResponse.redirect(new URL('/sign-in', request.url))
  //   }

  //   return NextResponse.next()

  // }

  if (
    token &&
    (
      url.pathname === "/sign-in" ||
      url.pathname === "/sign-up" ||
      url.pathname.startsWith("/verify")
    )
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'

  ]
}


// import withAuth from "next-auth/middleware"
// import { NextResponse } from "next/server"

// export default withAuth(
//   function proxy(req) {
//     const { pathname } = req.nextUrl
//     const token = req.nextauth.token

//     // logged-in user should not access auth pages or home
//     if (
//       token &&
//       (
//         pathname === "/" ||
//         pathname.startsWith("/sign-in") ||
//         pathname.startsWith("/sign-up") ||
//         pathname.startsWith("/verify")
//       )
//     ) {
//       return NextResponse.redirect(new URL("/dashboard", req.url))
//     }

//     // logged-out user should not access dashboard
//     if (!token && pathname.startsWith("/dashboard")) {
//       return NextResponse.redirect(new URL("/sign-in", req.url))
//     }

//     return NextResponse.next()
//   },
//   {
//     callbacks: {
//       authorized: ({ token, req }) => {
//         const { pathname } = req.nextUrl

//         // always allow next-auth APIs
//         if (pathname.startsWith("/api/auth")) {
//           return true
//         }

//         // allow middleware to run for all matched routes
//         return !!token
//       },
//     },
//   }
// )

// export const config = {
//   matcher: [
//     "/",
//     "/sign-in",
//     "/sign-up",
//     "/verify/:path*",
//     "/dashboard/:path*",
//   ],
// }
