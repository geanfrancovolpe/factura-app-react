'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { usuariosService } from '@/services/usuarios.service';
import { FormSkeleton } from '@/components/loading/Skeletons';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const usuarioSchema = z.object({
  username: z.string().min(1, 'El usuario es requerido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  is_active: z.boolean().optional(),
});

type UsuarioFormData = z.infer<typeof usuarioSchema>;

export default function EditUsuarioPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema),
  });

  const isActive = watch('is_active');

  useEffect(() => {
    const loadUsuario = async () => {
      try {
        const data = await usuariosService.getById(Number(params.id));
        reset({
          username: data.username,
          email: data.email || '',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          is_active: data.is_active,
        });
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
  }, [params.id, reset]);

  const onSubmit = async (data: UsuarioFormData) => {
    setIsSubmitting(true);
    try {
      await usuariosService.update(Number(params.id), data as any);
      toast.success('Usuario actualizado correctamente');
      router.push('/usuarios');
    } catch (error: any) {
      console.error('Error updating usuario:', error);
      const errorMessage = error.response?.data?.username?.[0] 
        || error.response?.data?.detail 
        || 'Error al actualizar usuario';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Editar Usuario</h1>
        </div>
        <FormSkeleton />
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
        <h1 className="text-3xl font-bold">Editar Usuario</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Información del Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario *</Label>
              <Input
                id="username"
                {...register('username')}
                disabled={isSubmitting}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Nombre</Label>
                <Input
                  id="first_name"
                  {...register('first_name')}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Apellidos</Label>
                <Input
                  id="last_name"
                  {...register('last_name')}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={isActive}
                onCheckedChange={(checked) => setValue('is_active', !!checked)}
                disabled={isSubmitting}
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Usuario activo
              </Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
              <Link href="/usuarios">
                <Button type="button" variant="outline" disabled={isSubmitting}>
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
