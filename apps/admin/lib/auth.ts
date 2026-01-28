import { createAuthOptions } from "@form-me/auth";

export const authOptions = createAuthOptions({
  allowedRoles: ['ADMIN'],
  signInPage: '/auth/signin',
  errorPage: '/auth/error',
});
