import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { api } from '@/lib/axios';

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'username', type: 'text' },
        password: { label: 'password', type: 'text' }
      },

      async authorize(credentials) {
        const response = await api.post('/login', {
          username: credentials?.username,
          password: credentials?.password
        });

        const user = await response.data;

        if (user && response.status === 200) {
          return user;
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      user && (token.user = user);
      return token;
    },
    async session({ session, token }) {
      session = token.user;
      return session;
    }
  },
  pages: {
    signIn: '/'
  }
};
