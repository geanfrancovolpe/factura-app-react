'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { historicosService } from '@/services/historicos.service';
import { Historico } from '@/types';
import { TableSkeleton } from '@/components/loading/Skeletons';
import { Plus, Eye, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function HistoricosPage() {
  const [historicos, setHistoricos] = useState<Historico[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHistoricos = async () => {
      try {
        const data = await historicosService.getAll();
        setHistoricos(data);
      } catch (error) {
        toast.error('Error al cargar históricos');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadHistoricos();
  }, []);

  if (isLoading) return <div><h1 className="text-3xl font-bold mb-6">Históricos</h1><TableSkeleton /></div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Históricos Médicos</h1>
        <Link href="/historicos/create">
          <Button><Plus className="mr-2 h-4 w-4" />Nuevo Histórico</Button>
        </Link>
      </div>

      {historicos.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No hay históricos registrados</p>
        </div>
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
                    {format(new Date(historico.fecha_consulta), 'dd/MM/yyyy', { locale: es })}
                  </TableCell>
                  <TableCell>{historico.cliente_nombre || `ID ${historico.cliente}`}</TableCell>
                  <TableCell>{historico.servicios.length} servicio(s)</TableCell>
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
