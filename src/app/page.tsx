'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Ear, Loader2, PenLine, Phone, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import loginImg from '../../public/loginMartDom.png';

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
    <div className="relative">
      <Image
        src={loginImg}
        alt="Loja MM & DOM"
        quality={100}
        fill
        style={{
          objectFit: 'cover',
          objectPosition: 'bottom'
        }}
        priority
        className="absolute left-0 top-0 -z-10 h-full w-full"
      />
      <div className="flex min-h-screen flex-col items-center justify-center space-y-3 sm:flex-row">
        <div className="grid grid-cols-2 items-center justify-center text-neutral-50 sm:flex sm:flex-col sm:items-baseline sm:space-y-6">
          <div className="flex flex-col items-center justify-center gap-4 p-2 sm:flex sm:flex-row">
            <PenLine />
            <Link
              href="http://martminasweb.grupomartminas.local/assinatura"
              className="hover:underline"
            >
              Assinatura
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 p-2 sm:flex sm:flex-row">
            <Ear />
            <Link
              href="http://martminasweb.grupomartminas.local/Ouvidoria"
              className="hover:underline"
            >
              Ouvidoria Interna
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 p-2 sm:flex sm:flex-row">
            <Phone />
            <Link
              href="http://martminasweb.grupomartminas.local/Agenda_Telefonica"
              className="hover:underline"
            >
              Agenda Telefônica
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 p-2 sm:flex sm:flex-row">
            <ShoppingCart />
            <Link href="#" className="hover:underline">
              Relatório DONV
            </Link>
          </div>
        </div>
        <div className="hidden sm:flex sm:items-center sm:justify-center sm:px-16">
          <span className="h-80 w-px bg-[#FFFF00]"></span>
        </div>
        <Card className="flex flex-col gap-2 rounded-2xl border-none bg-gradient-to-r from-[#00A451] to-[#052846] px-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold tracking-tight text-neutral-50">
              SISTEMAS WEB
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex flex-col items-center justify-center">
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
                        <FormLabel className="text-neutral-50">
                          Usuário:
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="uppercase dark:border-none dark:bg-white dark:text-neutral-950"
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
                        <FormLabel className="text-neutral-50">
                          Senha:
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Senha"
                            className="dark:border-none dark:bg-white dark:text-neutral-950"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-center">
                    {!form.formState.isSubmitting ? (
                      <Button
                        className="bg-white hover:bg-white/85 dark:bg-white"
                        type="submit"
                      >
                        <span className="text-neutral-950 dark:text-neutral-950">
                          Entrar
                        </span>
                      </Button>
                    ) : (
                      <Button className="" disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span className="text-neutral-50 dark:text-neutral-950">
                          Carregando
                        </span>
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
