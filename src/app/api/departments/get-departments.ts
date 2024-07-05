import { api } from '@/lib/axios';

export interface GetDepartmentsResponse {
  ID: string;
  DEPARTAMENTO: string;
}

export async function getDepartments() {
  const response = await api.get<GetDepartmentsResponse[]>('/departments');

  return response.data;
}
