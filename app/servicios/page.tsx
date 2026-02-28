'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { serviciosService } from '@/services/servicios.service';
import { Servicio } from '@/types';
import { TableSkeleton } from '@/components/loading/Skeletons';
import { Plus, Eye, Pencil } from 'lucide-react';

export default function ServiciosPage() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadServicios = async () => {
      try {
        const data = await serviciosService.getAll();
        setServicios(data);
      } catch (error) {
        toast.error('Error al cargar servicios');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadServicios();
  }, []);

  if (isLoading) return <div><h1 className="text-3xl font-bold mb-6">Servicios</h1><TableSkeleton /></div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Servicios</h1>
        <Link href="/servicios/create">
          <Button><Plus className="mr-2 h-4 w-4" />Nuevo Servicio</Button>
        </Link>
      </div>

      {servicios.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No hay servicios registrados</p>
        </div>
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
                  <TableCell>€{servicio.coste_sin_iva?.toFixed(2) || '-'}</TableCell>
                  <TableCell>€{servicio.coste_con_iva.toFixed(2)}</TableCell>
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
