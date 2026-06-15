import type { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  children?: ReactNode;
}

export function DashboardCard({ title, value, subtitle, icon, className = '', children }: DashboardCardProps) {
  return (
    <div className={`group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/20 hover:shadow-lg dark:border-white/[0.06] dark:bg-white/[0.025] ${className}`}>
      {/* Background glow */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-500/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-600 dark:text-white/40 uppercase tracking-wider mb-1.5">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-white/30 mt-1.5">{subtitle}</p>
          )}
        </div>
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-emerald-500/15 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
          {icon}
        </div>
      </div>
      
      {children && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/[0.04] flex-1 flex flex-col justify-end">
          {children}
        </div>
      )}
    </div>
  );
}
