// import NextAuth, { NextAuthOptions } from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';

// const nextAuthOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: 'credentials',
//       credentials: {
//         username: { label: 'username', type: 'text' },
//         password: { label: 'password', type: 'password' }
//       },

//       async authorize(credentials, req) {
//         const response = await fetch('http://10.110.96.213:3002/login', {
//           method: 'POST',
//           headers: {
//             'Content-type': 'application/json'
//           },
//           body: JSON.stringify({
//             username: credentials?.username,
//             password: credentials?.password
//           })
//         });

//         console.log('Route response: ', response);

//         const userData = await response.json();

//         if (userData && response.ok) {
//           return userData;
//         }

//         return null;
//       }
//     })
//   ],
//   pages: {
//     signIn: '/'
//   }
// };

// const handler = NextAuth(nextAuthOptions);

// export { handler as GET, handler as POST };
