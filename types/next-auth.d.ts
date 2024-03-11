import 'next-auth';

declare module 'next-auth' {
  export interface Session {
    user: {
      CODUSUARIO: string;
      USUARIO: number;
      NOME: string;
      NIVEL: number;
      NROEMPRESA: number;
      LOGINID: string;
      CHAPA: string;
      SETOR: string;
    };
  }
}
