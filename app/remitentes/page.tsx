'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { remitentesService } from '@/services/remitentes.service';
import { Remitente } from '@/types';
import { TableSkeleton } from '@/components/loading/Skeletons';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { useFetchData } from '@/lib/hooks/useFetchData';
import { Plus, Eye, Pencil } from 'lucide-react';

export default function RemitentesPage() {
  const { data: remitentes, isLoading, error, reload } = useFetchData<Remitente[]>({
    fetchFn: () => remitentesService.getAll(),
    errorMessage: 'Error al cargar remitentes'
  });

  if (isLoading) return <div><h1 className="text-3xl font-bold mb-6">Remitentes</h1><TableSkeleton /></div>;

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Remitentes</h1>
        <ErrorState message={error} onRetry={reload} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Remitentes</h1>
        <Link href="/remitentes/create">
          <Button><Plus className="mr-2 h-4 w-4" />Nuevo Remitente</Button>
        </Link>
      </div>

      {!remitentes || remitentes.length === 0 ? (
        <EmptyState
          message="No hay remitentes registrados"
          createLink="/remitentes/create"
          createLabel="Crear Primer Remitente"
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>NIF</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {remitentes.map((remitente) => (
                <TableRow key={remitente.id}>
                  <TableCell className="font-medium">{remitente.nombre}</TableCell>
                  <TableCell>{remitente.email || '-'}</TableCell>
                  <TableCell>{remitente.telefono || '-'}</TableCell>
                  <TableCell>{remitente.nif || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/remitentes/${remitente.id}`}>
                        <Button variant="outline" size="sm"><Eye className="h-4 w-4" /></Button>
                      </Link>
                      <Link href={`/remitentes/${remitente.id}/edit`}>
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
