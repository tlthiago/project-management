import { api } from '@/lib/axios';

export interface SignInBody {
  username: string;
  password: string;
}

export async function signIn({ username, password }: SignInBody) {
  await api.post('/login', { username, password });
}
