'use client';

import { SyntheticEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function Login() {
  const [usuario, setUsuario] useState<string>('')
  const [senha, setSenha] useState<password>('')

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();
  }

  return (
    <div className="grid min-h-screen grid-cols-2">
      <div className="flex h-full flex-col border-r border-foreground/5 bg-muted p-10">
        <div className="flex items-center text-lg font-medium text-foreground">
          Mart Minas & Dom Atacadista
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="rounded-lg border p-10">
          <div className="flex w-52 flex-col justify-center gap-6">
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                SISTEMAS WEB
              </h1>
            </div>
            <form action="" className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="usuario">Usuário:</Label>
                <Input id="usuario" type="text"></Input>
              </div>
              <div>
                <Label htmlFor="senha">Senha:</Label>
                <Input id="senha" type="password"></Input>
              </div>
              <div className="flex justify-center">
                <Button type="submit">Entrar</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
