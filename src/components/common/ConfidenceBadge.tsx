import { cn } from '@/utils/helpers';

interface Props { score?: number; className?: string; }

export const ConfidenceBadge = ({ score, className }: Props) => {
  if (score === undefined || score === null) return <span className="text-xs text-gray-300 font-medium">—</span>;
  let tier: 'high' | 'medium' | 'low' | 'none';
  if (score >= 0.9) tier = 'high';
  else if (score >= 0.7) tier = 'medium';
  else tier = 'low';
  const styles = {
    high:   { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200' },
    medium: { bg: 'bg-amber-50',   text: 'text-amber-700',   ring: 'ring-amber-200' },
    low:    { bg: 'bg-red-50',     text: 'text-red-700',     ring: 'ring-red-200' },
    none:   { bg: 'bg-gray-50',    text: 'text-gray-400',    ring: 'ring-gray-200' },
  };
  const s = styles[tier];
  return (
    <span className={cn(`inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-bold ${s.bg} ${s.text} border border-current/10`, className)}>
      {Math.round(score * 100)}%
    </span>
  );
};