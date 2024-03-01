/** The prefix for all the public dynamic pages.
 These routes do not require authentification.
 @type {string[]}
 */
export const dynamicRoutes = ["/listings", "/user/profile"];

/**  An array of public routes that are accessible to the public.
These routes do not require authentification.
@type {string[]}
*/
export const publicRoutes = [
  "/",
  "/auth/new_verification",
  "/auth/new_password",
];

/**  An array of routes that are used for authentification.
These routes will redirect logged in users to /settings.
@type {string[]}
*/
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/forgot_password",
];

/** The prefix for API auth routes.
Routes that start with this prefix are used for API auth purposes.
@type {string}
*/
export const apiAuthPrefix = "/api/auth";

/**
Image uplaoding API via UploadThing
@type {string}
*/
export const apiImageUpload = "/api/uploadthing";
/**  The default redirect path after logging in.
@type {string}
*/
export const DEFAULT_LOGIN_REDIRECT = "/user/settings";
