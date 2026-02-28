# Factura App React

Sistema de gestión médica para la Dra. Johana Marcano, migrado de Angular a React + Next.js con shadcn/ui.

## Tecnologías

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **HTTP Client:** Axios con interceptors
- **Forms:** React Hook Form + Zod validation
- **Date Handling:** date-fns
- **Notifications:** Sonner (toast notifications)
- **Icons:** lucide-react
- **PDF Generation:** jsPDF + html2canvas

## API Backend

- **Base URL:** https://api.drajohanamarcano.com
- **Auth:** Token-based (Django REST Framework)
- **Token Header:** `Authorization: Token <token>`

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/geanfrancovolpe/factura-app-react.git
cd factura-app-react

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales

# Ejecutar en desarrollo
npm run dev
```

## Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=https://api.drajohanamarcano.com
```

## Estructura del Proyecto

```
factura-app-react/
├── app/                    # App Router pages
│   ├── login/             # Página de login
│   ├── usuarios/          # CRUD de usuarios
│   ├── clientes/          # CRUD de clientes
│   ├── citas/             # CRUD de citas
│   ├── servicios/         # CRUD de servicios
│   ├── productos/         # CRUD de productos
│   ├── historicos/        # CRUD de historiales médicos
│   ├── facturas-2/        # CRUD de facturas
│   ├── generador-factura/ # Generador de facturas con PDF
│   ├── remitentes/        # CRUD de remitentes
│   ├── files/             # CRUD de archivos
│   ├── configuracion-bot-ia/ # Config. Bot IA
│   └── proximamente/      # Página "Coming Soon"
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components (Sidebar, etc.)
│   └── loading/           # Loading skeletons
├── services/              # API services
├── types/                 # TypeScript types
└── lib/                   # Utility functions
```

## Módulos Implementados

### ✅ Completados
1. **Login** - Autenticación con token
2. **Layout** - Sidebar con navegación responsive
3. **Usuarios** - CRUD completo (list, create, detail, edit)
4. **Clientes** - CRUD completo con búsqueda
5. **Citas** - Lista con estados y fechas
6. **Servicios** - Lista de tratamientos
7. **Productos** - Lista de productos
8. **Históricos** - Registros médicos
9. **Facturas 2.0** - Gestión de facturas
10. **Generador Factura** - ⭐ Página compleja con generación de PDF
11. **Remitentes** - Lista de remitentes
12. **Files** - Gestión de archivos
13. **Config. Bot IA** - Configuración de bot
14. **Próximamente** - Página placeholder

### 🚧 Pendiente (Formularios CRUD completos)
Los módulos tienen las páginas de lista funcionando. Faltan por completar:
- Create, Detail, Edit pages para: Servicios, Productos, Citas, Históricos, Facturas, Remitentes, Files, Bot Config
- Estos siguen el mismo patrón que Usuarios y Clientes

## Scripts

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar producción
npm start

# Linter
npm run lint
```

## Autenticación

El sistema usa tokens de Django REST Framework:

1. Login en `/login` con usuario y contraseña
2. El token se guarda en `localStorage`
3. Todas las peticiones incluyen el header `Authorization: Token <token>`
4. Si el token expira, se redirige automáticamente a `/login`

## Rutas Protegidas

Todas las rutas excepto `/login` están protegidas por autenticación. El componente `ProtectedLayout` verifica el token en cada navegación.

## Generador de Facturas

La página `/generador-factura` incluye:
- Formulario completo con datos de emisor, cliente y servicios
- Cálculos automáticos de IVA, IRPF y totales
- Vista previa en tiempo real
- Generación de PDF con html2canvas + jsPDF
- Soporte para precios con/sin IVA incluido

## Deployment

El proyecto está preparado para ser desplegado en:
- **Actual (Angular):** S3 bucket `drajohanamarcano-factura-app` + CloudFront `E1K07DETT3IHFM`
- **Futuro (React):** Puede desplegarse en Vercel, Netlify, o reemplazar el bucket S3 actual

### Deploy a Vercel (recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy a S3 + CloudFront (manual)

```bash
# Build
npm run build

# Export static
npm run export  # Si se configura en next.config.js

# Subir a S3
aws s3 sync out/ s3://drajohanamarcano-factura-app/

# Invalidar CloudFront cache
aws cloudfront create-invalidation --distribution-id E1K07DETT3IHFM --paths "/*"
```

## Mejoras Futuras

- [ ] Completar formularios CRUD de los módulos restantes
- [ ] Paginación en las tablas
- [ ] Filtros avanzados
- [ ] Export a Excel
- [ ] Dashboard con estadísticas
- [ ] Notificaciones en tiempo real
- [ ] Modo oscuro
- [ ] Tests unitarios e integración

## Diferencias con Angular App

- **UI más moderna:** shadcn/ui vs Bootstrap
- **Mejor TypeScript:** Strict mode, tipos completos
- **Validación de formularios:** Zod + React Hook Form
- **Loading states:** Skeletons en vez de spinners
- **Confirmaciones:** Alert dialogs vs browser alerts
- **Notificaciones:** Toast notifications (Sonner)
- **Rendimiento:** Next.js App Router con RSC

## Soporte

Para issues o preguntas, contactar a:
- **Desarrollador:** Gean Franco Volpe
- **Cliente:** Dra. Johana Marcano (dra.johanamarcano@gmail.com)

## Licencia

Propietario - Uso privado para Dra. Johana Marcano
