// import { CheckCircle2, Circle, HelpCircle, Timer } from 'lucide-react';
// import { ReactNode } from 'react';

// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { ScrollArea } from '@/components/ui/scroll-area';

// interface TasksContainerProps {
//   title: string;
// }

// export function TaskContainer({ title }: TasksContainerProps) {
//   let titleIcon: ReactNode = undefined;

//   switch (title) {
//     case 'ATRASADO':
//       titleIcon = <HelpCircle className="h-5 w-5 text-rose-600" />;
//       break;
//     case 'PENDENTE':
//       titleIcon = <Circle className="h-5 w-5" />;
//       break;
//     case 'EM PROGRESSO':
//       titleIcon = <Timer className="h-5 w-5" />;
//       break;
//     case 'FINALIZADO':
//       titleIcon = <CheckCircle2 className="h-5 w-5" />;
//       break;
//   }

//   return (
//     <Card className="border-0 shadow-none">
//       <CardHeader className="flex">
//         <CardTitle className="flex justify-between text-base">
//           <div className="flex items-center gap-3">
//             <span className="mr-2">{titleIcon}</span>
//             <span className={title === 'ATRASADO' ? 'text-rose-600' : ''}>
//               {title}
//             </span>
//           </div>
//           <Avatar className="h-6 w-6 shadow-sm">
//             <AvatarFallback className="bg-muted text-sm">3</AvatarFallback>
//           </Avatar>
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <ScrollArea className="h-[35rem] max-h-[35rem]">
//           {Array.from({ length: 5 }).map((_, i) => {
//             return (
//               <div className="mb-2" key={i}>
//                 {/* <TaskCard /> */}
//               </div>
//             );
//           })}
//         </ScrollArea>
//       </CardContent>
//     </Card>
//   );
// }
