'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { productosService } from '@/services/productos.service';
import { Producto } from '@/types';
import { TableSkeleton } from '@/components/loading/Skeletons';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { useFetchData } from '@/lib/hooks/useFetchData';
import { formatPrice } from '@/lib/utils/formatters';
import { Plus, Eye, Pencil } from 'lucide-react';

export default function ProductosPage() {
  const { data: productos, isLoading, error, reload } = useFetchData<Producto[]>({
    fetchFn: () => productosService.getAll(),
    errorMessage: 'Error al cargar productos'
  });

  if (isLoading) return <div><h1 className="text-3xl font-bold mb-6">Productos</h1><TableSkeleton /></div>;

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Productos</h1>
        <ErrorState message={error} onRetry={reload} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Productos</h1>
        <Link href="/productos/create">
          <Button><Plus className="mr-2 h-4 w-4" />Nuevo Producto</Button>
        </Link>
      </div>

      {!productos || productos.length === 0 ? (
        <EmptyState
          message="No hay productos registrados"
          createLink="/productos/create"
          createLabel="Crear Primer Producto"
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productos.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell className="font-medium">{producto.nombre}</TableCell>
                  <TableCell>{producto.descripcion || '-'}</TableCell>
                  <TableCell>{formatPrice(producto.precio)}</TableCell>
                  <TableCell>{producto.stock || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/productos/${producto.id}`}>
                        <Button variant="outline" size="sm"><Eye className="h-4 w-4" /></Button>
                      </Link>
                      <Link href={`/productos/${producto.id}/edit`}>
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
