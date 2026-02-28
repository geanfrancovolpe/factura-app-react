import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  createLink?: string;
  createLabel?: string;
}

export function EmptyState({ message, createLink, createLabel }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed p-8 text-center">
      <p className="text-muted-foreground mb-4">{message}</p>
      {createLink && createLabel && (
        <Link href={createLink}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {createLabel}
          </Button>
        </Link>
      )}
    </div>
  );
}
