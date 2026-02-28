'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { botService } from '@/services/bot.service';
import { BotConfig } from '@/types';
import { TableSkeleton } from '@/components/loading/Skeletons';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { useFetchData } from '@/lib/hooks/useFetchData';
import { Plus, Eye, Pencil } from 'lucide-react';

export default function ConfiguracionBotIAPage() {
  const { data: configs, isLoading, error, reload } = useFetchData<BotConfig[]>({
    fetchFn: () => botService.getAll(),
    errorMessage: 'Error al cargar configuraciones de bot'
  });

  if (isLoading) return <div><h1 className="text-3xl font-bold mb-6">Configuración Bot IA</h1><TableSkeleton /></div>;

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Configuración Bot IA</h1>
        <ErrorState message={error} onRetry={reload} />
      </div>
    );
  }

  const getEstadoBadge = (activo: boolean) => {
    return activo ? (
      <Badge variant="default">Activo</Badge>
    ) : (
      <Badge variant="secondary">Inactivo</Badge>
    );
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Configuración Bot IA</h1>
        <Link href="/configuracion-bot-ia/create">
          <Button><Plus className="mr-2 h-4 w-4" />Nueva Configuración</Button>
        </Link>
      </div>

      {!configs || configs.length === 0 ? (
        <EmptyState
          message="No hay configuraciones de bot registradas"
          createLink="/configuracion-bot-ia/create"
          createLabel="Crear Primera Configuración"
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configs.map((config) => (
                <TableRow key={config.id}>
                  <TableCell className="font-medium">{config.nombre || 'Sin nombre'}</TableCell>
                  <TableCell>{config.modelo || '-'}</TableCell>
                  <TableCell>{getEstadoBadge(config.activo || false)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/configuracion-bot-ia/${config.id}`}>
                        <Button variant="outline" size="sm"><Eye className="h-4 w-4" /></Button>
                      </Link>
                      <Link href={`/configuracion-bot-ia/${config.id}/edit`}>
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
