'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/auth.service';
import {
  Calendar,
  Users,
  UserCheck,
  Package,
  FileText,
  FileCheck,
  FilePlus,
  Mail,
  Folder,
  Bot,
  Clock,
  Stethoscope,
  LogOut,
} from 'lucide-react';

const menuItems = [
  { href: '/citas', label: 'Citas', icon: Calendar },
  { href: '/servicios', label: 'Servicios', icon: Stethoscope },
  { href: '/productos', label: 'Productos', icon: Package },
  { href: '/usuarios', label: 'Usuarios', icon: Users },
  { href: '/clientes', label: 'Clientes', icon: UserCheck },
  { href: '/remitentes', label: 'Remitentes', icon: Mail },
  { href: '/historicos', label: 'Históricos', icon: FileText },
  { href: '/configuracion-bot-ia', label: 'Config. Bot IA', icon: Bot },
  { href: '/files', label: 'Archivos', icon: Folder },
  { href: '/facturas-2', label: 'Facturas 2.0', icon: FileCheck },
  { href: '/generador-factura', label: 'Generar Factura', icon: FilePlus },
  { href: '/proximamente', label: 'Próximamente', icon: Clock },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
      <div className="flex h-full flex-col">
        <div className="border-b p-6">
          <h1 className="text-xl font-bold">Gestión APP</h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t p-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </div>
    </aside>
  );
}
