/**  An array of public routes that are accessible to the public.
These routes do not require authentification.
@type {string[]}
*/
export const publicRoutes = ["/", "/auth/new-verification"];

/**  An array of routes that are used for authentification.
These routes will redirect logged in users to /settings.
@type {string[]}
*/
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
];

/** The prefix for API auth routes.
Routes that start with this prefix are used for API auth purposes.
@type {string}
*/
export const apiAuthPrefix = "/api/auth";

/**  The default redirect path after logging in.
@type {string}
*/
export const DEFAULT_LOGIN_REDIRECT = "/settings";
