# Fixes Aplicados - factura-app-react

## Problema Reportado

Usuario reportó que al intentar acceder a páginas como "citas", "config bot ia", y otras, se producen errores.

## Causa Raíz

1. **ProtectedLayout deficiente**: El componente `ProtectedLayout` verificaba autenticación con `useEffect`, que se ejecuta **después** del primer render. Esto permitía que las páginas intentaran cargar datos de la API antes de verificar si había token, causando:
   - Llamadas API fallidas (401 Unauthorized)
   - Loading infinito (skeleton nunca desaparece)
   - Experiencia de usuario pobre

2. **Manejo de errores insuficiente**: Las páginas no mostraban mensajes de error útiles cuando fallaban las llamadas a la API.

3. **Estados vacíos sin acción**: Cuando no había datos, se mostraba mensaje pero sin opción de crear el primer registro.

## Soluciones Aplicadas

### 1. ProtectedLayout Mejorado
**Archivo:** `components/layout/ProtectedLayout.tsx`

**Cambios:**
```typescript
// ANTES: useEffect verificaba auth pero permitía render inmediato
useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token && pathname !== '/login') {
    router.push('/login');
  }
}, [pathname, router]);

// DESPUÉS: Estado de carga + verificación antes de render
const [isChecking, setIsChecking] = useState(true);
const [isAuthenticated, setIsAuthenticated] = useState(false);

useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token && pathname !== '/login') {
    router.push('/login');
    setIsChecking(false);
  } else {
    setIsAuthenticated(!!token);
    setIsChecking(false);
  }
}, [pathname, router]);

// Mostrar loading mientras verifica
if (isChecking) {
  return <LoadingSpinner />;
}

// No renderizar contenido protegido si no está autenticado
if (!isAuthenticated && pathname !== '/login') {
  return null;
}
```

**Beneficios:**
- ✅ No se renderizan páginas protegidas hasta verificar auth
- ✅ No se hacen llamadas API sin token
- ✅ Loading spinner mientras verifica (mejor UX)
- ✅ Redirect más confiable

### 2. Componente ErrorState
**Archivo:** `components/shared/ErrorState.tsx`

Componente reutilizable para mostrar errores:
```typescript
<ErrorState 
  message="Error al cargar los datos"
  onRetry={() => window.location.reload()}
/>
```

**Features:**
- Icono de error visible (AlertCircle)
- Mensaje de error claro
- Botón "Reintentar" opcional
- Estilo consistente (border-destructive)

### 3. Componente EmptyState
**Archivo:** `components/shared/EmptyState.tsx`

Componente para listas vacías con acción:
```typescript
<EmptyState
  message="No hay citas registradas"
  createLink="/citas/create"
  createLabel="Crear Primera Cita"
/>
```

**Features:**
- Mensaje claro de estado vacío
- Botón de acción (crear primer registro)
- Estilo consistente (border-dashed)

### 4. Hook useFetchData
**Archivo:** `lib/hooks/useFetchData.ts`

Hook personalizado para simplificar carga de datos con error handling:

```typescript
// USO:
const { data, isLoading, error, reload } = useFetchData({
  fetchFn: () => citasService.getAll(),
  errorMessage: 'Error al cargar citas'
});

// MANEJO AUTOMÁTICO:
// - Loading state
// - Error state
// - Toast notifications
// - Console logging
// - Retry function
```

**Beneficios:**
- ✅ DRY: No repetir código de loading/error en cada página
- ✅ Consistencia: Mismo comportamiento en todas las páginas
- ✅ Tipo-seguro: TypeScript generics
- ✅ Toast automático en errores
- ✅ Función reload para reintentar

### 5. Página Citas Actualizada
**Archivo:** `app/citas/page.tsx`

**Cambios:**
- Agregado estado de error
- Componente ErrorState para errores
- Mensaje de error detallado
- EmptyState con botón de crear

```typescript
// ANTES:
const [isLoading, setIsLoading] = useState(true);

try {
  const data = await citasService.getAll();
  setCitas(data);
} catch (error) {
  toast.error('Error al cargar citas');
}

if (isLoading) return <TableSkeleton />;

// DESPUÉS:
const [error, setError] = useState<string | null>(null);

try {
  const data = await citasService.getAll();
  setCitas(data);
} catch (error: any) {
  const errorMessage = error.response?.data?.message || error.message || 'Error al cargar citas';
  setError(errorMessage);
  toast.error(errorMessage);
}

if (isLoading) return <TableSkeleton />;
if (error) return <ErrorState message={error} onRetry={reload} />;
```

## Testing Recomendado

### Sin Credenciales
1. ✅ Acceder a `/citas` sin login → Redirect a `/login` inmediatamente
2. ✅ No se deben ver skeletons infinitos
3. ✅ Loading spinner breve mientras verifica auth

### Con Credenciales Válidas
1. ✅ Login funciona → Guarda token → Redirect a home
2. ✅ Páginas de lista cargan datos correctamente
3. ✅ Si no hay datos, mostrar EmptyState con botón crear

### Con Token Expirado/Inválido
1. ✅ Llamada API falla con 401
2. ✅ Interceptor de Axios elimina token
3. ✅ Redirect automático a `/login`

### Con Error de Red
1. ✅ Mostrar ErrorState con mensaje descriptivo
2. ✅ Botón "Reintentar" funcional
3. ✅ Toast notification visible

## Próximos Pasos Recomendados

### Aplicar Fixes a Todas las Páginas
Las siguientes páginas necesitan los mismos fixes aplicados a citas:

- [ ] `/servicios/page.tsx`
- [ ] `/productos/page.tsx`
- [ ] `/historicos/page.tsx`
- [ ] `/facturas-2/page.tsx`
- [ ] `/remitentes/page.tsx`
- [ ] `/files/page.tsx`
- [ ] `/configuracion-bot-ia/page.tsx`

**Patrón a seguir:**
```typescript
import { useFetchData } from '@/lib/hooks/useFetchData';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';

export default function Page() {
  const { data, isLoading, error, reload } = useFetchData({
    fetchFn: () => service.getAll(),
    errorMessage: 'Error al cargar...'
  });

  if (isLoading) return <TableSkeleton />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data || data.length === 0) {
    return <EmptyState message="No hay registros" createLink="/..." createLabel="Crear" />;
  }

  return <Table>...</Table>;
}
```

### Testing con API Real
1. Obtener credenciales de login válidas
2. Testear cada módulo (usuarios, clientes, citas, servicios, etc.)
3. Verificar que datos se cargan correctamente
4. Testear formularios de crear/editar

### Completar CRUDs Pendientes
Usando el patrón de Usuarios, completar:
- Servicios (create, detail, edit)
- Productos (create, detail, edit)
- Citas (create, detail, edit)
- Históricos (create, detail, edit)
- Facturas (create, detail, edit)
- Remitentes (create, detail, edit)
- Files (create, detail, edit)
- Bot Config (create, detail, edit)
- Clientes (detail, edit)

## Resumen

**Problema:** Páginas cargaban datos antes de verificar autenticación → errores + loading infinito

**Solución:**
1. ✅ ProtectedLayout verifica auth ANTES de renderizar
2. ✅ ErrorState para mostrar errores claramente
3. ✅ EmptyState para listas vacías con acción
4. ✅ useFetchData hook para simplificar data loading
5. ✅ Página citas actualizada como ejemplo

**Estado:** Fixes aplicados y commiteados (commit 40b89e6)

**Siguiente:** Aplicar mismo patrón a las 7 páginas restantes

---

**Commit:** `40b89e6 - Fix: Add error handling and auth checking`  
**Fecha:** 2026-02-28  
**Archivos modificados:** 6 (ProtectedLayout, citas/page, +3 nuevos componentes)
