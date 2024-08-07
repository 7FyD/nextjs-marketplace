import NextAuth from "next-auth";
import authConfig from "@/auth.config";

import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  apiImageUpload,
  authRoutes,
  publicRoutes,
  dynamicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isDynamicRoute = dynamicRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isImageUploadRoute = apiImageUpload.includes(nextUrl.pathname);
  if (isApiAuthRoute || isImageUploadRoute) return null;

  if (isAuthRoute) {
    if (isLoggedIn)
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    return null;
  }

  if (!isLoggedIn && !(isPublicRoute || isDynamicRoute)) {
    let callbackUrl = nextUrl.pathname;
    if (callbackUrl !== "/auth/signout") {
      if (nextUrl.search) {
        callbackUrl += nextUrl.search;
      }
    } else callbackUrl = "/";
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  return null;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
