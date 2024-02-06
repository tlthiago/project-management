import { 
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { 
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { columns } from "./components/data-tables/members/columns";
import { DataTable } from "./components/data-tables/members/data-table";

export interface Member {
  ID: number;
  NOME: string;
  EQUIPE: string;
  CARGO: string;
  FUNCAO: string;
}

export default function Membros() {
  const members: Member[] = [
    {
      ID: 1,
      NOME: "Thiago Alves",
      EQUIPE: "Desenvolvimento de Sistemas",
      CARGO: "Analista de Suporte Júnior",
      FUNCAO: "Membro"
    },
    {
      ID: 2,
      NOME: "Paulo Goncalves",
      EQUIPE: "Desenvolvimento de Sistemas",
      CARGO: "Desenvolvedor de Sistemas Pleno",
      FUNCAO: "Administrador"
    }
  ];

  return (
    <div className="space-y-5 p-5">
      <h1 className="text-3xl font-bold tracking-tight">Membros</h1>
      <Card>
        <CardHeader>
          <Tabs defaultValue="members">
            <TabsList className="bg-muted">
              <TabsTrigger value="members">
                <span>Membros</span>
              </TabsTrigger>
              <TabsTrigger value="groups">
                <span>Grupos</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="members">
              <DataTable columns={columns} data={members} />
            </TabsContent>
            <TabsContent value="groups">
              <span>Grupos</span>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
}
