'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { citasService } from '@/services/citas.service';
import { Cita } from '@/types';
import { TableSkeleton } from '@/components/loading/Skeletons';
import { Plus, Eye, Pencil, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function CitasPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCitas = async () => {
      try {
        setError(null);
        const data = await citasService.getAll();
        setCitas(data);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Error al cargar citas';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Error loading citas:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCitas();
  }, []);

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
        <div className="rounded-lg border border-destructive bg-destructive/10 p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error al cargar las citas</h3>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </div>
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

      {citas.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No hay citas registradas</p>
          <Link href="/citas/create">
            <Button className="mt-4"><Plus className="mr-2 h-4 w-4" />Crear Primera Cita</Button>
          </Link>
        </div>
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
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/citas/${cita.id}`}>
                        <Button variant="outline" size="sm"><Eye className="h-4 w-4" /></Button>
                      </Link>
                      <Link href={`/citas/${cita.id}/edit`}>
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
