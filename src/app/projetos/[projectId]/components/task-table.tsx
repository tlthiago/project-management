// import { Pagination } from '@/components/pagination';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

// import { ProjectTableFilters } from './-table-filters';
import { TaskTableRow } from './task-table-row';

export default function TasksTable() {
  return (
    <>
      <div className="mx-5 flex flex-col gap-4 pt-6">
        <div className="space-y-2.5">
          {/* <ProjectTableFilters /> */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Datas</TableHead>
                  <TableHead>Equipes</TableHead>
                  <TableHead>Responsáveis</TableHead>
                  <TableHead>Comentários</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => {
                  return <TaskTableRow key={i} />;
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
