import 'next-auth';

declare module 'next-auth' {
  export interface Session {
    user: {
      CODUSUARIO: string;
      SEQUSUARIO: number;
      NOME: string;
      NIVEL: number;
      NROEMPRESA: number;
      CPF: string;
      CHAPA: string;
      CODSETOR: string;
      SETOR: string;
      FUNCAO: string;
    };
  }
}
