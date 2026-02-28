'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { historicosService } from '@/services/historicos.service';
import { Historico } from '@/types';
import { TableSkeleton } from '@/components/loading/Skeletons';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { useFetchData } from '@/lib/hooks/useFetchData';
import { formatDate } from '@/lib/utils/formatters';
import { Plus, Eye, Pencil } from 'lucide-react';

export default function HistoricosPage() {
  const { data: historicos, isLoading, error, reload } = useFetchData<Historico[]>({
    fetchFn: () => historicosService.getAll(),
    errorMessage: 'Error al cargar históricos'
  });

  if (isLoading) return <div><h1 className="text-3xl font-bold mb-6">Históricos</h1><TableSkeleton /></div>;

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Históricos</h1>
        <ErrorState message={error} onRetry={reload} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Históricos</h1>
        <Link href="/historicos/create">
          <Button><Plus className="mr-2 h-4 w-4" />Nuevo Histórico</Button>
        </Link>
      </div>

      {!historicos || historicos.length === 0 ? (
        <EmptyState
          message="No hay históricos registrados"
          createLink="/historicos/create"
          createLabel="Crear Primer Histórico"
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Servicios</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historicos.map((historico) => (
                <TableRow key={historico.id}>
                  <TableCell className="font-medium">
                    {formatDate(historico.fecha_consulta)}
                  </TableCell>
                  <TableCell>{historico.cliente_nombre || `ID ${historico.cliente}`}</TableCell>
                  <TableCell>{historico.servicios?.length || 0} servicios</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/historicos/${historico.id}`}>
                        <Button variant="outline" size="sm"><Eye className="h-4 w-4" /></Button>
                      </Link>
                      <Link href={`/historicos/${historico.id}/edit`}>
                        <Button variant="outline" size="sm"><Pencil className="h-4 w-4" /></Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
