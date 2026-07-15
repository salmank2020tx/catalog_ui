import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CastrolLogoIcon } from '@/components/common/Icons';
import { Product } from '@/types';

interface Props {
  query: string;
  onQueryChange: (v: string) => void;
  results: Product[];
  showResults: boolean;
  onSelect: (p: Product) => void;
  onFocus: () => void;
  onCloseResults?: () => void;
  showSearch?: boolean;
  selectedProducts?: Product[];
}

const REGIONS: Record<string, string> = {
  uk: 'UK',
  germany: 'Germany',
  france: 'France',
  us: 'US',
  india: 'India',
  australia: 'Australia',
  japan: 'Japan',
  china: 'China',
  brazil: 'Brazil',
  mexico: 'Mexico',
};

export const Header = ({ query, onQueryChange, results, showResults, onSelect, onFocus, onCloseResults, showSearch = true, selectedProducts = [] }: Props) => {
  const navigate = useNavigate();
  const selectedProductIds = selectedProducts.map(sp => sp.id);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [username, setUsername] = useState(() => localStorage.getItem('user_profile_username') || 'salman');
  const [role, setRole] = useState(() => localStorage.getItem('user_profile_role') || 'normal');
  const [region, setRegion] = useState(() => localStorage.getItem('user_profile_region') || 'uk');
  const [switcherOpen, setSwitcherOpen] = useState(false);

  useEffect(() => {
    const handleStorage = () => {
      setUsername(localStorage.getItem('user_profile_username') || 'salman');
      setRole(localStorage.getItem('user_profile_role') || 'normal');
      setRegion(localStorage.getItem('user_profile_region') || 'uk');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        onCloseResults?.();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onCloseResults]);

  const getProfileDisplayName = () => {
    if (role === 'admin' || role === 'super_admin') {
      return 'user-admin-all';
    }
    return `${username}-${region.toLowerCase()}`;
  };

  const getProfileSubtitle = () => {
    const roleLabel = {
      normal: 'Normal User',
      admin: 'Admin',
      super_admin: 'Super Admin',
    }[role] || 'User';

    if (role === 'admin' || role === 'super_admin') {
      return `${roleLabel} · All Regions`;
    }
    const regionName = REGIONS[region] || region.toUpperCase();
    return `${roleLabel} · ${regionName}`;
  };

  return (
    <header className="sticky top-0 z-30" style={{ background: 'linear-gradient(135deg, var(--forest-900), var(--forest-700))' }}>
      <div className="max-w-[1400px] mx-auto pl-2 pr-6 py-4 grid grid-cols-[280px_1fr_280px] items-center gap-4">
        {/* Left: Logo and title */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer select-none" onClick={() => navigate('/')}>
          <div className="w-14 h-14 flex items-center justify-center shrink-0">
            <CastrolLogoIcon className="w-14 h-14" />
          </div>
          <div>
            <div className="text-white font-serif font-bold text-[17px] leading-tight tracking-tight">Product Information<br/>Management Tool</div>
            <div className="text-[11px] text-white/60 font-medium mt-1">User Journey · Create New Listing</div>
          </div>
        </div>

        {showSearch ? (
          <div className="flex justify-center relative w-full" ref={searchRef}>
            <div className="w-full max-w-[580px] relative">
              <div 
                className="w-full bg-white rounded-lg flex flex-wrap items-center gap-1.5 pl-3 pr-12 py-1.5 min-h-[38px] shadow-sm border border-transparent focus-within:ring-2 focus-within:ring-[var(--lime-400)] transition cursor-text relative"
                onClick={() => {
                  const inputEl = document.getElementById('header-search-input');
                  inputEl?.focus();
                }}
              >
                {/* Render selected product chips inside the header selectbox */}
                {selectedProducts.map(p => (
                  <span 
                    key={p.id} 
                    className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-100 text-[11px] font-semibold select-none max-w-[140px]"
                  >
                    <span className="truncate" title={p.name}>{p.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(p);
                      }}
                      className="text-emerald-600 hover:text-emerald-950 font-bold ml-0.5 focus:outline-none"
                    >
                      ×
                    </button>
                  </span>
                ))}

                <input
                  id="header-search-input"
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && query.length === 0 && selectedProducts.length > 0) {
                      onSelect(selectedProducts[selectedProducts.length - 1]);
                    }
                  }}
                  onFocus={onFocus}
                  placeholder={selectedProducts.length === 0 ? "Search product name, SKU, or model number..." : ""}
                  className="border-none outline-none flex-1 min-w-[120px] bg-transparent text-xs py-0.5 text-gray-800 placeholder-gray-400"
                />

                {selectedProducts.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect({ id: '__clear_all__' } as any);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 hover:text-red-500 transition px-1 select-none py-0.5"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              {showResults && results.length > 0 && (
                <ul className="absolute z-40 w-full mt-1.5 bg-white border border-gray-200 rounded-lg shadow-xl max-h-72 overflow-auto anim-in text-left">
                  {results.map(p => {
                    const isChecked = selectedProductIds.includes(p.id);
                    return (
                      <li key={p.id} onClick={() => onSelect(p)} className="px-4 py-3 hover:bg-emerald-50 cursor-pointer flex items-center justify-between border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // handled by click
                            className="w-4 h-4 text-[var(--forest-600)] border-gray-300 rounded focus:ring-[var(--forest-500)] cursor-pointer"
                          />
                          <div>
                            <div className="text-sm font-semibold text-gray-800 leading-tight">{p.name}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{p.brand}</div>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-gray-400 shrink-0 ml-4">{p.product_key}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <div />
        )}

        {/* Right: Profile */}
        <div className="justify-self-end relative" ref={profileRef}>
          <div
            onClick={() => setSwitcherOpen(!switcherOpen)}
            className="flex items-center gap-3 shrink-0 select-none cursor-pointer hover:bg-white/10 p-1.5 rounded-lg transition"
          >
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white/90 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <div className="hidden sm:block text-left font-sans">
              <div className="text-white text-sm font-bold leading-tight">{getProfileDisplayName()}</div>
              <div className="text-[11px] text-white/60 leading-tight mt-0.5">{getProfileSubtitle()}</div>
            </div>
          </div>

          {switcherOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-2xl p-4 z-50 text-left text-gray-800 anim-in font-sans">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Profile Configuration</div>
              
              <div className="mb-3">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    const val = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
                    setUsername(val);
                    localStorage.setItem('user_profile_username', val);
                    window.dispatchEvent(new Event('storage'));
                  }}
                  className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
                />
              </div>

              <div className="mb-3">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRole(val);
                    localStorage.setItem('user_profile_role', val);
                    window.dispatchEvent(new Event('storage'));
                  }}
                  className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
                >
                  <option value="normal">Normal User</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              {role === 'normal' && (
                <div className="mb-1">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Region</label>
                  <select
                    value={region}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRegion(val);
                      localStorage.setItem('user_profile_region', val);
                      window.dispatchEvent(new Event('storage'));
                    }}
                    className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
                  >
                    {Object.entries(REGIONS).map(([key, name]) => (
                      <option key={key} value={key}>{name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};