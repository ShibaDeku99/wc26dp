import type { Group } from '@/types/football';
import { ArrowUpRight, Users } from 'lucide-react';
import { getGroupColor } from '@/lib/group-colors';
import { cn } from '@/lib/utils';

interface GroupCardProps {
  group: Group;
}

export function GroupCard({ group }: GroupCardProps) {
  const colors = getGroupColor(group.name);

  return (
    <article
      className={cn(
        'group relative isolate overflow-hidden rounded-[22px] border bg-white/85 shadow-[0_16px_45px_-30px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-all duration-300',
        'dark:bg-[#0b0717]/90 dark:shadow-[0_22px_70px_-35px_rgba(0,0,0,0.9)]',
        colors.border,
        colors.hoverBorder,
        colors.shadow
      )}
    >
      <div className={cn('pointer-events-none absolute inset-x-12 -top-16 h-28 rounded-full blur-3xl opacity-40', colors.bg)} />

      <header className="relative flex min-h-16 items-center justify-between border-b border-slate-200/80 px-5 dark:border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl border border-current/10', colors.bg, colors.text)}>
            <Users className="h-4 w-4" />
          </div>
          <div>
            <h3 className={cn('text-base font-extrabold tracking-tight', colors.text)}>{group.name}</h3>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400 dark:text-white/25">
              Vòng bảng
            </p>
          </div>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-100/80 px-2.5 py-1 text-[10px] font-semibold text-slate-500 dark:border-white/[0.07] dark:bg-white/[0.04] dark:text-white/35">
          {group.teams.length} đội
        </span>
      </header>

      <div className="relative divide-y divide-slate-200/70 dark:divide-white/[0.045]">
        {group.teams.map((team, index) => (
          <div
            key={team.id}
            className="flex min-h-14 items-center gap-3 px-5 py-2.5 transition-colors hover:bg-slate-100/80 dark:hover:bg-white/[0.045]"
          >
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-extrabold tabular-nums text-slate-500 dark:bg-white/[0.05] dark:text-white/35">
              {index + 1}
            </span>

            <div className="flex h-7 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm dark:border-white/10">
              {team.flag.startsWith('http') || team.flag.startsWith('/') ? (
                <img
                  src={team.flag}
                  alt={`${team.name} flag`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-lg" role="img" aria-label={team.name}>
                  {team.flag}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-bold text-slate-900 dark:text-white/90">
                {team.name}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-400 dark:text-white/25">
                FIFA World Cup 2026
              </p>
            </div>

            <span className={cn(
              'rounded-lg border px-2 py-1 text-[10px] font-extrabold tracking-[0.12em]',
              colors.border,
              colors.bg,
              colors.text
            )}>
              {team.code}
            </span>
          </div>
        ))}
      </div>

      <footer className="relative flex items-center justify-between border-t border-slate-200/80 bg-slate-50/50 px-5 py-3 dark:border-white/[0.06] dark:bg-black/10">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-white/40">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.55)]" />
            Hai đội đầu bảng đi tiếp
          </span>
          <span className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-white/40">
            <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.55)]" />
            Hạng ba có thể đi tiếp
          </span>
        </div>
        <ArrowUpRight className={cn('h-4 w-4 opacity-30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-80', colors.text)} />
      </footer>
    </article>
  );
}
