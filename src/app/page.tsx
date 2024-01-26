'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { signIn } from './api/sign-in';

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

  const { mutateAsync: login } = useMutation({
    mutationFn: signIn
  });

  const router = useRouter();

  async function handleSignIn(data: SignInForm) {
    try {
      const transformedData: SignInForm = {
        username: data.username.toUpperCase(),
        password: data.password.toUpperCase()
      };

      console.log(transformedData);

      await login(transformedData);

      toast.success('Usuário autenticado');

      router.replace('/dashboard');
    } catch {
      toast.error('Credenciais inválidas');
    }
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
                  {...register('username')}
                ></Input>
              </div>
              <div>
                <Label htmlFor="password">Senha:</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                ></Input>
              </div>
              <div className="flex justify-center">
                <Button disabled={isSubmitting} type="submit">
                  Entrar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
