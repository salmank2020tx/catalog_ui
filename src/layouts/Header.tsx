import { useRef, useEffect } from 'react';
import { SparkIcon } from '@/components/common/Icons';
import { Product } from '@/types';

interface Props {
  query: string;
  onQueryChange: (v: string) => void;
  results: Product[];
  showResults: boolean;
  onSelect: (p: Product) => void;
  onFocus: () => void;
}

export const Header = ({ query, onQueryChange, results, showResults, onSelect, onFocus }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) { /* keep open? we rely on parent */ } };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-30" style={{ background: 'linear-gradient(135deg, var(--forest-900), var(--forest-700))' }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[var(--lime-400)] flex items-center justify-center shadow-sm">
            <SparkIcon className="w-5 h-5 text-[var(--forest-900)]" />
          </div>
          <div className="hidden sm:block">
            <div className="text-white font-bold text-[14px] leading-tight tracking-tight">Product Information<br/>Management Tool</div>
            <div className="text-[10px] text-[var(--lime-400)]/90 font-medium mt-0.5">User Journey · Create New Listing</div>
          </div>
        </div>

        <div className="flex-1 relative" ref={ref}>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"/></svg>
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onFocus={onFocus}
              placeholder="Search product name, SKU, or model number..."
              className="w-full bg-white rounded-lg pl-9 pr-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none ring-0 focus:ring-2 focus:ring-[var(--lime-400)] shadow-sm"
            />
          </div>
          {showResults && results.length > 0 && (
            <ul className="absolute z-40 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-auto anim-in">
              {results.map(p => (
                <li key={p.id} onClick={() => onSelect(p)} className="px-3 py-2 hover:bg-emerald-50 cursor-pointer flex items-center justify-between border-b border-gray-100 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-gray-800">{p.name}</div>
                    <div className="text-xs text-gray-400">{p.brand}</div>
                  </div>
                  <span className="text-xs font-mono text-gray-400">{p.product_key}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white font-semibold text-sm">A</div>
          <div className="hidden sm:block text-right">
            <div className="text-white text-sm font-semibold leading-tight">Alice</div>
            <div className="text-[10px] text-white/60 leading-tight">Catalog Ops</div>
          </div>
        </div>
      </div>
    </header>
  );
};