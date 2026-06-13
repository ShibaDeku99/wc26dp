'use client';

import { useEffect, useState } from 'react';
import { Radio, AlertCircle } from 'lucide-react';

interface ScoreBatWidgetProps {
  league?: string;
}

export function ScoreBatWidget({ league = 'world-cup' }: ScoreBatWidgetProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const scriptId = 'scorebat-widget-script';

    // Prevent duplicate script injection
    if (document.getElementById(scriptId)) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://www.scorebat.com/embed/embed.js?v=arrv';
    script.async = true;

    script.onload = () => setLoaded(true);
    script.onerror = () => setError(true);

    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount if needed
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Widget container */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-300 dark:border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-white/[0.01] min-h-[400px]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 flex items-center justify-center">
              <Radio className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live Scores</h3>
              <p className="text-[10px] text-slate-500 dark:text-white/30">Powered by ScoreBat</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">LIVE</span>
          </div>
        </div>

        {/* Widget content */}
        <div className="p-4">
          {error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 rounded-full bg-amber-500/10 p-3">
                <AlertCircle className="h-8 w-8 text-amber-700 dark:text-amber-400" />
              </div>
              <p className="text-sm text-slate-700 dark:text-white/60 mb-1">Widget could not be loaded</p>
              <p className="text-xs text-slate-500 dark:text-white/30">Please check your internet connection or try again later</p>
            </div>
          ) : (
            <div
              className="scorebatEmbeddedContent"
              data-league={league}
              style={{ minHeight: '300px' }}
            />
          )}
        </div>
      </div>

      {/* Info box */}
      <div className="rounded-xl bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 border border-emerald-500/10 p-4">
        <div className="flex items-start gap-3">
          <Radio className="h-5 w-5 text-emerald-700 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">Live Score Updates</p>
            <p className="text-[11px] text-slate-600 dark:text-white/40 leading-relaxed">
              Live scores are powered by ScoreBat widget, which updates automatically.
              This approach saves API quota by not polling API-Football for real-time data.
              The widget shows live scores, recent results, and upcoming matches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
