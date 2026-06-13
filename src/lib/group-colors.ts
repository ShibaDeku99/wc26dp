export function getGroupColor(groupName: string) {
  const letter = groupName.replace('Group ', '').trim();
  switch (letter) {
    case 'A': return { border: 'border-emerald-500/30', hoverBorder: 'hover:border-emerald-500/60', bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', shadow: 'hover:shadow-emerald-500/20' };
    case 'B': return { border: 'border-cyan-500/30', hoverBorder: 'hover:border-cyan-500/60', bg: 'bg-cyan-500/10', text: 'text-cyan-700 dark:text-cyan-400', shadow: 'hover:shadow-cyan-500/20' };
    case 'C': return { border: 'border-sky-500/30', hoverBorder: 'hover:border-sky-500/60', bg: 'bg-sky-500/10', text: 'text-sky-400', shadow: 'hover:shadow-sky-500/20' };
    case 'D': return { border: 'border-blue-500/30', hoverBorder: 'hover:border-blue-500/60', bg: 'bg-blue-500/10', text: 'text-blue-400', shadow: 'hover:shadow-blue-500/20' };
    case 'E': return { border: 'border-indigo-500/30', hoverBorder: 'hover:border-indigo-500/60', bg: 'bg-indigo-500/10', text: 'text-indigo-400', shadow: 'hover:shadow-indigo-500/20' };
    case 'F': return { border: 'border-violet-500/30', hoverBorder: 'hover:border-violet-500/60', bg: 'bg-violet-500/10', text: 'text-violet-400', shadow: 'hover:shadow-violet-500/20' };
    case 'G': return { border: 'border-purple-500/30', hoverBorder: 'hover:border-purple-500/60', bg: 'bg-purple-500/10', text: 'text-purple-700 dark:text-purple-400', shadow: 'hover:shadow-purple-500/20' };
    case 'H': return { border: 'border-fuchsia-500/30', hoverBorder: 'hover:border-fuchsia-500/60', bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-700 dark:text-fuchsia-400', shadow: 'hover:shadow-fuchsia-500/20' };
    case 'I': return { border: 'border-pink-500/30', hoverBorder: 'hover:border-pink-500/60', bg: 'bg-pink-500/10', text: 'text-pink-400', shadow: 'hover:shadow-pink-500/20' };
    case 'J': return { border: 'border-rose-500/30', hoverBorder: 'hover:border-rose-500/60', bg: 'bg-rose-500/10', text: 'text-rose-700 dark:text-rose-400', shadow: 'hover:shadow-rose-500/20' };
    case 'K': return { border: 'border-red-500/30', hoverBorder: 'hover:border-red-500/60', bg: 'bg-red-500/10', text: 'text-red-400', shadow: 'hover:shadow-red-500/20' };
    case 'L': return { border: 'border-orange-500/30', hoverBorder: 'hover:border-orange-500/60', bg: 'bg-orange-500/10', text: 'text-orange-400', shadow: 'hover:shadow-orange-500/20' };
    default: return { border: 'border-slate-200 dark:border-white/10', hoverBorder: 'hover:border-slate-300 dark:border-white/20', bg: 'bg-slate-100 dark:bg-white/5', text: 'text-slate-700 dark:text-white/60', shadow: 'hover:shadow-white/5' };
  }
}
