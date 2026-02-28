'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    
    if (!token && pathname !== '/login') {
      router.push('/login');
      setIsChecking(false);
    } else {
      setIsAuthenticated(!!token);
      setIsChecking(false);
    }
  }, [pathname, router]);

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // Don't show sidebar on login page
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // Don't render protected content if not authenticated
  if (!isAuthenticated && pathname !== '/login') {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
