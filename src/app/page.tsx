'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const signInForm = z.object({
  username: z.string().min(1, { message: 'Digite o usuário.' }),
  password: z.string().min(1, { message: 'Digite a senha.' })
});

type SignInForm = z.infer<typeof signInForm>;

export default function Login() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInForm>>({
    resolver: zodResolver(signInForm),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  async function onSubmit(userData: z.infer<typeof signInForm>) {
    const transformedData: SignInForm = {
      username: userData.username.toUpperCase(),
      password: userData.password.toUpperCase()
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usuário:</FormLabel>
                      <FormControl>
                        <Input
                          className="uppercase"
                          placeholder="A_NOME"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha:</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-center">
                  {!form.formState.isSubmitting ? (
                    <Button type="submit">Entrar</Button>
                  ) : (
                    <Button disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Carregando
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
