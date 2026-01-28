import { createAuthOptions } from "@form-me/auth";

export const authOptions = createAuthOptions({
  allowedRoles: ['LEARNER', 'CLIENT'],
  signInPage: '/auth/signin',
  errorPage: '/auth/error',
});
