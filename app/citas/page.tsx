'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { citasService } from '@/services/citas.service';
import { Cita } from '@/types';
import { TableSkeleton } from '@/components/loading/Skeletons';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { useFetchData } from '@/lib/hooks/useFetchData';
import { Plus, Eye, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function CitasPage() {
  const { data: citas, isLoading, error, reload } = useFetchData<Cita[]>({
    fetchFn: () => citasService.getAll(),
    errorMessage: 'Error al cargar citas'
  });

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, any> = {
      pendiente: 'secondary',
      confirmada: 'default',
      completada: 'default',
      cancelada: 'destructive',
    };
    return <Badge variant={variants[estado] || 'secondary'}>{estado}</Badge>;
  };

  if (isLoading) return <div><h1 className="text-3xl font-bold mb-6">Citas</h1><TableSkeleton /></div>;

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Citas</h1>
        <ErrorState message={error} onRetry={reload} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Citas</h1>
        <Link href="/citas/create">
          <Button><Plus className="mr-2 h-4 w-4" />Nueva Cita</Button>
        </Link>
      </div>

      {!citas || citas.length === 0 ? (
        <EmptyState
          message="No hay citas registradas"
          createLink="/citas/create"
          createLabel="Crear Primera Cita"
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha y Hora</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {citas.map((cita) => (
                <TableRow key={cita.id}>
                  <TableCell className="font-medium">
                    {format(new Date(cita.fecha_hora), 'dd/MM/yyyy HH:mm', { locale: es })}
                  </TableCell>
                  <TableCell>{cita.cliente_nombre || `ID ${cita.cliente}`}</TableCell>
                  <TableCell>{cita.servicio_nombre || '-'}</TableCell>
                  <TableCell>{getEstadoBadge(cita.estado)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/citas/${cita.id}`}>
                        <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                      </Link>
                      <Link href={`/citas/${cita.id}/edit`}>
                        <Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button>
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
