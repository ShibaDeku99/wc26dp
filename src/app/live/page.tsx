'use client';

import { Radio } from 'lucide-react';
import { ScoreBatWidget } from '@/components/dashboard/scorebat-widget';

export default function LivePage() {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="relative">
            <Radio className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Live Score</h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-white/40">
          Real-time live scores powered by ScoreBat • No API quota used
        </p>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border border-blue-500/10 p-4">
        <p className="text-xs text-blue-400/70 leading-relaxed">
          <strong className="text-blue-400">💡 How it works:</strong> Live scores on this page are
          provided by the ScoreBat widget, which updates automatically without using any of our
          API-Football quota. This hybrid approach ensures you always have real-time data while
          keeping API costs minimal.
        </p>
      </div>

      {/* ScoreBat Widget */}
      <ScoreBatWidget league="world-cup" />
    </div>
  );
}
