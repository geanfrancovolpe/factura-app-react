'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { remitentesService } from '@/services/remitentes.service';
import { Remitente } from '@/types';
import { TableSkeleton } from '@/components/loading/Skeletons';
import { Plus, Eye, Pencil } from 'lucide-react';

export default function RemitentesPage() {
  const [remitentes, setRemitentes] = useState<Remitente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRemitentes = async () => {
      try {
        const data = await remitentesService.getAll();
        setRemitentes(data);
      } catch (error) {
        toast.error('Error al cargar remitentes');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadRemitentes();
  }, []);

  if (isLoading) return <div><h1 className="text-3xl font-bold mb-6">Remitentes</h1><TableSkeleton /></div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Remitentes</h1>
        <Link href="/remitentes/create">
          <Button><Plus className="mr-2 h-4 w-4" />Nuevo Remitente</Button>
        </Link>
      </div>

      {remitentes.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No hay remitentes registrados</p>
        </div>
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
