'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { facturasService } from '@/services/facturas.service';
import { Factura } from '@/types';
import { TableSkeleton } from '@/components/loading/Skeletons';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { useFetchData } from '@/lib/hooks/useFetchData';
import { Plus, Eye, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Facturas2Page() {
  const { data: facturas, isLoading, error, reload } = useFetchData<Factura[]>({
    fetchFn: () => facturasService.getAll(),
    errorMessage: 'Error al cargar facturas'
  });

  if (isLoading) return <div><h1 className="text-3xl font-bold mb-6">Facturas 2.0</h1><TableSkeleton /></div>;

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Facturas 2.0</h1>
        <ErrorState message={error} onRetry={reload} />
      </div>
    );
  }

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, any> = {
      borrador: 'secondary',
      emitida: 'default',
      pagada: 'default',
      vencida: 'destructive',
      cancelada: 'destructive',
    };
    return <Badge variant={variants[estado] || 'secondary'}>{estado}</Badge>;
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Facturas 2.0</h1>
        <Link href="/facturas-2/create">
          <Button><Plus className="mr-2 h-4 w-4" />Nueva Factura</Button>
        </Link>
      </div>

      {!facturas || facturas.length === 0 ? (
        <EmptyState
          message="No hay facturas registradas"
          createLink="/facturas-2/create"
          createLabel="Crear Primera Factura"
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facturas.map((factura) => (
                <TableRow key={factura.id}>
                  <TableCell className="font-medium">{factura.numero}</TableCell>
                  <TableCell>{format(new Date(factura.fecha), 'dd/MM/yyyy', { locale: es })}</TableCell>
                  <TableCell>{factura.cliente_nombre || `ID ${factura.cliente}`}</TableCell>
                  <TableCell>€{factura.total?.toFixed(2) || '-'}</TableCell>
                  <TableCell>{getEstadoBadge(factura.estado)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/facturas-2/${factura.id}`}>
                        <Button variant="outline" size="sm"><Eye className="h-4 w-4" /></Button>
                      </Link>
                      <Link href={`/facturas-2/${factura.id}/edit`}>
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
