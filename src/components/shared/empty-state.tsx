import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'Chưa có dữ liệu',
  description = 'Hiện chưa có dữ liệu để hiển thị. Vui lòng quay lại sau.',
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="mb-4 rounded-full bg-slate-100 dark:bg-white/5 p-4">
        {icon || <Inbox className="h-10 w-10 text-muted-foreground/50" />}
      </div>
      <h3 className="text-lg font-semibold text-foreground/80 mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md">{description}</p>
    </div>
  );
}
