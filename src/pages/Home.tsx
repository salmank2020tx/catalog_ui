import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from '@/components/Layout/Header';
import { Button } from '@/components/common/Button';
import { SparkIcon } from '@/components/common/Icons';
import { TemplateSelector } from '@/components/common/TemplateSelector';
import { useProductsQuery } from '@/hooks/useProductsQuery';
import type { Product } from '@/types';

export const Home = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState('Amazon');
  const [market, setMarket] = useState('UK');
  const [language, setLanguage] = useState('English');

  // Debounce the query to prevent aggressive API calling
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);
    return () => clearTimeout(handler);
  }, [query]);

  // Load products list on application load (debouncedQuery is empty initially)
  const { data: products = [] } = useProductsQuery(
    debouncedQuery.length >= 2 ? debouncedQuery : undefined
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowResults(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    return products;
  }, [query, products]);

  const handleSelect = (p: Product) => {
    navigate(`/listing?productId=${p.id}&template=${template}&market=${market}&language=${language}`);
  };

  const handleViewDemo = () => {
    const demoId = products[0]?.id || 'c5308c4d-b6c8-47fb-8671-bc01db5452f4';
    navigate(`/listing?productId=${demoId}&template=${template}&market=${market}&language=${language}`);
  };

  const handleTemplateChange = (t: string, m: string, l: string) => {
    setTemplate(t);
    setMarket(m);
    setLanguage(l);
  };

  return (
    <div>
      <Header
        query={query}
        onQueryChange={setQuery}
        results={results}
        showResults={showResults}
        onSelect={handleSelect}
        onFocus={() => setShowResults(query.length >= 2)}
      />
      <TemplateSelector
        initialTemplate={template}
        initialMarket={market}
        initialLanguage={language}
        onTemplateChange={handleTemplateChange}
      />
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
        <div className="max-w-xl w-full text-center">
          <div className="w-14 h-14 rounded-2xl bg-[var(--forest-700)] mx-auto flex items-center justify-center mb-5 shadow-lg">
            <SparkIcon className="w-7 h-7 text-[var(--lime-400)]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Create a new product listing</h1>
          <p className="text-gray-500 mb-8">Select your template, market and language above, then search for a product.</p>
          <div ref={searchRef} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowResults(query.length >= 2)}
              placeholder="Search product name, SKU, or model number..."
              className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[var(--forest-500)] focus:border-transparent outline-none transition"
            />
            {showResults && results.length > 0 && (
              <ul className="absolute z-10 w-full mt-1.5 bg-white border border-gray-200 rounded-lg shadow-xl max-h-72 overflow-auto anim-in">
                {results.map(p => (
                  <li key={p.id} onClick={() => handleSelect(p)} className="px-4 py-3 hover:bg-emerald-50 cursor-pointer flex items-center justify-between border-b border-gray-100 last:border-0">
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
          <div className="mt-4 flex items-center justify-center gap-4">
            <span className="text-sm text-gray-400">or</span>
            <Button variant="outline" onClick={handleViewDemo}>View Demo Listing →</Button>
          </div>
          <p className="mt-2 text-xs text-gray-400">Try typing "Castrol" in the search bar above</p>
        </div>
      </div>
    </div>
  );
};