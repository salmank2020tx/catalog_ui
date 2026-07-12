import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LightningIcon } from '@/components/common/Icons';
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
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) { /* keep open? we rely on parent */ } };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-30" style={{ background: 'linear-gradient(135deg, var(--forest-900), var(--forest-700))' }}>
      <div className="max-w-[1400px] mx-auto pl-2 pr-6 py-4 grid grid-cols-[280px_1fr_280px] items-center gap-4">
        {/* Left: Logo and title */}
        <div className="flex items-start gap-3 shrink-0 cursor-pointer select-none" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-[var(--lime-400)] flex items-center justify-center shadow-sm mt-0.5">
            <LightningIcon className="w-5 h-5 text-[var(--forest-900)]" />
          </div>
          <div>
            <div className="text-white font-serif font-bold text-[17px] leading-tight tracking-tight">Product Information<br/>Management Tool</div>
            <div className="text-[11px] text-white/60 font-medium mt-1">User Journey · Create New Listing</div>
          </div>
        </div>

        {/* Center: Search input wrapper centered in grid */}
        <div className="flex justify-center relative w-full" ref={ref}>
          <div className="w-full max-w-[580px] relative">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"/></svg>
              <input
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                onFocus={onFocus}
                placeholder="Search product name, SKU, or model number..."
                className="w-full bg-white rounded-lg pl-11 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none ring-0 focus:ring-2 focus:ring-[var(--lime-400)] shadow-sm"
              />
            </div>
            {showResults && results.length > 0 && (
              <ul className="absolute z-40 w-full mt-1.5 bg-white border border-gray-200 rounded-lg shadow-xl max-h-72 overflow-auto anim-in">
                {results.map(p => (
                  <li key={p.id} onClick={() => onSelect(p)} className="px-4 py-3 hover:bg-emerald-50 cursor-pointer flex items-center justify-between border-b border-gray-100 last:border-0">
                    <div>
                      <div className="text-sm font-medium text-gray-800">{p.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{p.brand}</div>
                    </div>
                    <span className="text-xs font-mono text-gray-400">{p.product_key}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right: Profile */}
        <div className="justify-self-end flex items-center gap-3 shrink-0 select-none">
          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white/90 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-white text-sm font-bold leading-tight">Alice</div>
            <div className="text-[11px] text-white/60 leading-tight mt-0.5">Catalog Ops</div>
          </div>
        </div>
      </div>
    </header>
  );
};