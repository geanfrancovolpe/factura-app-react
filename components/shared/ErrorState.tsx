import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-destructive bg-destructive/10 p-8 text-center">
      <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold mb-2">Error al cargar los datos</h3>
      <p className="text-sm text-muted-foreground mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry}>Reintentar</Button>
      )}
    </div>
  );
}
