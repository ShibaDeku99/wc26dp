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
    <div className={`group relative overflow-hidden flex flex-col rounded-2xl border border-slate-300 dark:border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-5 transition-all duration-300 hover:border-slate-400 dark:border-white/[0.12] hover:shadow-lg hover:shadow-fuchsia-500/5 ${className}`}>
      {/* Background glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-fuchsia-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-violet-500/10 flex items-center justify-center text-fuchsia-700 dark:text-fuchsia-400">
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
