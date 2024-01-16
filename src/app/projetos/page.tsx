// import { Pagination } from '@/components/pagination';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import { ProjectTableFilters } from './components/project-table-filters';
import { ProjectTableRow } from './components/project-table-row';

export default function Projects() {
  return (
    <>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
        <div className="space-y-2.5">
          <ProjectTableFilters />
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[140px]">Identificador</TableHead>
                  <TableHead className="w-[180px]">Realizado Há</TableHead>
                  <TableHead className="w-[140px]">Status</TableHead>
                  <TableHead>Responsáveis</TableHead>
                  <TableHead className="w-[140px]">Total do pedido</TableHead>
                  <TableHead className="w-[164px]"></TableHead>
                  <TableHead className="w-[132px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 10 }).map((_, i) => {
                  return <ProjectTableRow key={i} />;
                })}
              </TableBody>
            </Table>
          </div>

          {/* <Pagination pageIndex={0} perPage={10} totalCount={105} /> */}
        </div>
      </div>
    </>
  );
}
