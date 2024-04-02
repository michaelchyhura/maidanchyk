// import { authMiddleware } from "./shared/middlewares/auth";
// import { chain } from "./shared/middlewares/chain";

// export default chain([authMiddleware]);

// // Stop Middleware running on static files
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - _next
//      * - static (static files)
//      * - favicon.ico (favicon file)
//      */
//     // "/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)",
//     "/((?!api|static|.*\\..*|_next|favicon.ico).*)",
//   ],
// };
