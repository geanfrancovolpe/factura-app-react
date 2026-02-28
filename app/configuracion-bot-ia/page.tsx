'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { botService } from '@/services/bot.service';
import { BotConfig } from '@/types';
import { TableSkeleton } from '@/components/loading/Skeletons';
import { Plus, Eye, Pencil } from 'lucide-react';

export default function ConfiguracionBotIAPage() {
  const [bots, setBots] = useState<BotConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBots = async () => {
      try {
        const data = await botService.getAll();
        setBots(data);
      } catch (error) {
        toast.error('Error al cargar configuraciones');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadBots();
  }, []);

  if (isLoading) return <div><h1 className="text-3xl font-bold mb-6">Config. Bot IA</h1><TableSkeleton /></div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Configuración Bot IA</h1>
        <Link href="/configuracion-bot-ia/create">
          <Button><Plus className="mr-2 h-4 w-4" />Nueva Configuración</Button>
        </Link>
      </div>

      {bots.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No hay configuraciones de bot</p>
        </div>
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
              {bots.map((bot) => (
                <TableRow key={bot.id}>
                  <TableCell className="font-medium">{bot.nombre}</TableCell>
                  <TableCell>{bot.modelo || '-'}</TableCell>
                  <TableCell>
                    {bot.activo ? (
                      <Badge variant="default">Activo</Badge>
                    ) : (
                      <Badge variant="secondary">Inactivo</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/configuracion-bot-ia/${bot.id}`}>
                        <Button variant="outline" size="sm"><Eye className="h-4 w-4" /></Button>
                      </Link>
                      <Link href={`/configuracion-bot-ia/${bot.id}/edit`}>
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
