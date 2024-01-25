import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        usuario: { label: 'usuario', type: 'text' },
        senha: { label: 'senha', type: 'password' }
      },

      async authorize(credentials, req) {
        const response = await fetch('http://localhost:3001/autenticacao', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            usuario: credentials?.usuario,
            senha: credentials?.senha
          })
        });

        const usuario = await response.json();

        if (usuario && response.ok) {
          return usuario;
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: '/'
  }
};

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
