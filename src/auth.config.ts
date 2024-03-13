import NextAuth, { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcryptjs from 'bcryptjs';

const authenticatedRoutes = ['/checkout', '/profile', '/orders', '/admin'];
const adminRoutes = ['/admin'];

export const authConfig: NextAuthConfig = {
   trustHost: true,
   pages: {
      signIn: '/auth/login',
      newUser: '/auth/new-account',
   },
   callbacks: {
      authorized({ auth, request: { nextUrl } }) {
         const isLoggedIn = !!auth?.user;
         const isOnProtectedRoute = authenticatedRoutes.some((route) =>
            nextUrl.pathname.startsWith(route)
         );
         if (isOnProtectedRoute) {
            const isAdminRoute = adminRoutes.some((route) =>
               nextUrl.pathname.startsWith(route)
            );
            if (isAdminRoute && isLoggedIn) {
               const isAdmin = auth.user?.role === 'admin';
               if (!isAdmin) {
                  return Response.redirect(new URL('/unauthorized', nextUrl));
               }
            }
            return isLoggedIn;
         } else if (isLoggedIn) {
            const isOnAuth = nextUrl.pathname.startsWith('/auth');
            if (isOnAuth) {
               return Response.redirect(new URL('/', nextUrl));
            }
         }
         return true;
      },

      jwt({ token, user }) {
         if (user) {
            token.data = user;
         }

         return token;
      },
      session({ session, token, user }) {
         session.user = token.data as any;
         return session;
      },
   },

   providers: [
      Credentials({
         async authorize(credentials) {
            const parsedCredentials = z
               .object({
                  email: z.string().email(),
                  password: z.string().min(6),
               })
               .safeParse(credentials);

            if (!parsedCredentials.success) return null;

            const { email, password } = parsedCredentials.data;

            // Buscar el correo
            const user = await prisma.user.findUnique({
               where: {
                  email: email.toLowerCase(),
               },
            });
            if (!user) return null;

            // Comparar las contraseñas
            if (!bcryptjs.compareSync(password, user.password)) return null;

            // Regresar el usuario
            const { password: _, ...userWithoutPassword } = user;

            return userWithoutPassword;
         },
      }),
   ],
};

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);
