import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      CODUSUARIO: string;
      USUARIO: number;
      NOME: string;
      NIVEL: number;
      NROEMPRESA: number;
      LOGINID: string;
      CHAPA: string;
      SETOR: string;
    }
  }
}
