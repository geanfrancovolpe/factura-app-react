'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { usuariosService } from '@/services/usuarios.service';
import { User } from '@/types';
import { FormSkeleton } from '@/components/loading/Skeletons';
import { ArrowLeft, Pencil } from 'lucide-react';

export default function UsuarioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [usuario, setUsuario] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUsuario = async () => {
      try {
        const data = await usuariosService.getById(Number(params.id));
        setUsuario(data);
      } catch (error) {
        toast.error('Error al cargar usuario');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      loadUsuario();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Detalle de Usuario</h1>
        </div>
        <FormSkeleton />
      </div>
    );
  }

  if (!usuario) {
    return (
      <div>
        <p>Usuario no encontrado</p>
        <Link href="/usuarios">
          <Button>Volver</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/usuarios">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Detalle de Usuario</h1>
          <Link href={`/usuarios/${usuario.id}/edit`}>
            <Button>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Información del Usuario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">ID</p>
            <p className="text-lg font-medium">{usuario.id}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Usuario</p>
            <p className="text-lg font-medium">{usuario.username}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-lg font-medium">{usuario.email || '-'}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Nombre completo</p>
            <p className="text-lg font-medium">
              {usuario.first_name} {usuario.last_name || '-'}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Estado</p>
            {usuario.is_active ? (
              <Badge variant="default">Activo</Badge>
            ) : (
              <Badge variant="secondary">Inactivo</Badge>
            )}
          </div>

          {usuario.created_at && (
            <div>
              <p className="text-sm text-muted-foreground">Fecha de creación</p>
              <p className="text-lg font-medium">
                {new Date(usuario.created_at).toLocaleDateString('es-ES')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
