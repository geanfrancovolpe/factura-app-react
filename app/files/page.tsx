'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { filesService } from '@/services/files.service';
import { File } from '@/types';
import { TableSkeleton } from '@/components/loading/Skeletons';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { useFetchData } from '@/lib/hooks/useFetchData';
import { Plus, Eye, Pencil, Download } from 'lucide-react';

export default function FilesPage() {
  const { data: files, isLoading, error, reload } = useFetchData<File[]>({
    fetchFn: () => filesService.getAll(),
    errorMessage: 'Error al cargar archivos'
  });

  if (isLoading) return <div><h1 className="text-3xl font-bold mb-6">Archivos</h1><TableSkeleton /></div>;

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Archivos</h1>
        <ErrorState message={error} onRetry={reload} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Archivos</h1>
        <Link href="/files/create">
          <Button><Plus className="mr-2 h-4 w-4" />Subir Archivo</Button>
        </Link>
      </div>

      {!files || files.length === 0 ? (
        <EmptyState
          message="No hay archivos cargados"
          createLink="/files/create"
          createLabel="Subir Primer Archivo"
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Archivo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium">{file.nombre}</TableCell>
                  <TableCell>{file.descripcion || '-'}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {file.archivo && (
                        <a href={file.archivo} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm"><Download className="h-4 w-4" /></Button>
                        </a>
                      )}
                      <Link href={`/files/${file.id}`}>
                        <Button variant="outline" size="sm"><Eye className="h-4 w-4" /></Button>
                      </Link>
                      <Link href={`/files/${file.id}/edit`}>
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
