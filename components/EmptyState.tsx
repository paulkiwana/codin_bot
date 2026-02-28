import { Plus, TrendingUp } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText?: string;
  onAction?: () => void;
  icon?: 'plus' | 'trending';
}

export default function EmptyState({
  title,
  description,
  buttonText = 'Add Cryptocurrency',
  onAction,
  icon = 'plus',
}: EmptyStateProps) {
  const IconComponent = icon === 'plus' ? Plus : TrendingUp;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-4 border border-primary/30">
        <IconComponent className="text-primary" size={32} />
      </div>
      <h2 className="text-lg font-semibold mb-2 text-foreground">{title}</h2>
      <p className="text-sm text-foreground/60 mb-6 max-w-xs">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-background font-semibold rounded-lg transition-all"
        >
          <Plus size={18} />
          {buttonText}
        </button>
      )}
    </div>
  );
}
