'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const signInForm = z.object({
  username: z.string(),
  password: z.string()
});

type SignInForm = z.infer<typeof signInForm>;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<SignInForm>();

  const router = useRouter();

  async function handleSignIn(data: SignInForm) {
    const transformedData: SignInForm = {
      username: data.username.toUpperCase(),
      password: data.password.toUpperCase()
    };

    const result = await signIn('credentials', {
      username: transformedData.username,
      password: transformedData.password,
      redirect: false
    });

    if (result?.error) {
      console.log(result);
      toast.error('Usuário não encontrado.');
      return;
    }

    toast.success('Usuário autenticado.');
    router.replace('/projetos');
  }

  return (
    <div className="grid min-h-screen grid-cols-2">
      <div className="flex h-full flex-col border-r border-foreground/5 bg-muted p-10">
        <div className="flex items-center text-lg font-medium text-foreground">
          Mart Minas & Dom Atacadista
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="">
          <div className="flex flex-col justify-center gap-6">
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                SISTEMAS WEB
              </h1>
            </div>
            <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
              <div>
                <Label htmlFor="username">Usuário:</Label>
                <Input
                  id="username"
                  type="text"
                  className="uppercase"
                  placeholder="A_NOME"
                  {...register('username')}
                ></Input>
              </div>
              <div>
                <Label htmlFor="password">Senha:</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                ></Input>
              </div>
              <div className="flex justify-center">
                {!isSubmitting ? (
                  <Button type="submit">Entrar</Button>
                ) : (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Carregando
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
