'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { serviciosService } from '@/services/servicios.service';
import { Servicio } from '@/types';
import { TableSkeleton } from '@/components/loading/Skeletons';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { useFetchData } from '@/lib/hooks/useFetchData';
import { formatPrice } from '@/lib/utils/formatters';
import { Plus, Eye, Pencil } from 'lucide-react';

export default function ServiciosPage() {
  const { data: servicios, isLoading, error, reload } = useFetchData<Servicio[]>({
    fetchFn: () => serviciosService.getAll(),
    errorMessage: 'Error al cargar servicios'
  });

  if (isLoading) return <div><h1 className="text-3xl font-bold mb-6">Servicios</h1><TableSkeleton /></div>;

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Servicios</h1>
        <ErrorState message={error} onRetry={reload} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Servicios</h1>
        <Link href="/servicios/create">
          <Button><Plus className="mr-2 h-4 w-4" />Nuevo Servicio</Button>
        </Link>
      </div>

      {!servicios || servicios.length === 0 ? (
        <EmptyState
          message="No hay servicios registrados"
          createLink="/servicios/create"
          createLabel="Crear Primer Servicio"
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Coste sin IVA</TableHead>
                <TableHead>Coste con IVA</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servicios.map((servicio) => (
                <TableRow key={servicio.id}>
                  <TableCell className="font-medium">{servicio.nombre}</TableCell>
                  <TableCell>{servicio.descripcion || '-'}</TableCell>
                  <TableCell>{formatPrice(servicio.coste_sin_iva)}</TableCell>
                  <TableCell>{formatPrice(servicio.coste_con_iva)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/servicios/${servicio.id}`}>
                        <Button variant="outline" size="sm"><Eye className="h-4 w-4" /></Button>
                      </Link>
                      <Link href={`/servicios/${servicio.id}/edit`}>
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
