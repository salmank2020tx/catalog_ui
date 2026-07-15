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
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Center search states
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Header search states
  const [headerQuery, setHeaderQuery] = useState('');
  const [debouncedHeaderQuery, setDebouncedHeaderQuery] = useState('');
  const [showHeaderResults, setShowHeaderResults] = useState(false);

  const [template, setTemplate] = useState('Amazon');
  const [market, setMarket] = useState('UK');
  const [language, setLanguage] = useState('English');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  // Debounce center query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);
    return () => clearTimeout(handler);
  }, [query]);

  // Debounce header query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedHeaderQuery(headerQuery);
    }, 200);
    return () => clearTimeout(handler);
  }, [headerQuery]);

  // Load center search results
  const { data: centerProducts = [] } = useProductsQuery(
    debouncedQuery.length >= 2 ? debouncedQuery : undefined
  );

  // Load header search results
  const { data: headerProducts = [] } = useProductsQuery(
    debouncedHeaderQuery.length >= 2 ? debouncedHeaderQuery : undefined
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    return centerProducts;
  }, [query, centerProducts]);

  const handleToggleProduct = (p: Product) => {
    setSelectedProducts((prev) => {
      const exists = prev.some((sp) => sp.id === p.id);
      if (exists) {
        return prev.filter((sp) => sp.id !== p.id);
      } else {
        return [...prev, p];
      }
    });
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((sp) => sp.id !== productId));
  };

  const handleCreateListing = () => {
    if (selectedProducts.length === 0) return;
    const ids = selectedProducts.map((sp) => sp.id).join(',');
    navigate(`/listing?productIds=${ids}&template=${template}&market=${market}&language=${language}`);
  };

  const handleViewDemo = () => {
    const demoBatch = centerProducts.length >= 2 ? centerProducts.slice(0, 2) : (productsDemoList().slice(0, 2));
    const demoIds = demoBatch.map(p => p.id).join(',') || 'c5308c4d-b6c8-47fb-8671-bc01db5452f4,a1208c4d-b6c8-47fb-8671-bc01db5452f5';
    navigate(`/listing?productIds=${demoIds}&template=${template}&market=${market}&language=${language}`);
  };

  const productsDemoList = () => {
    return [
      { id: 'c5308c4d-b6c8-47fb-8671-bc01db5452f4', name: 'Castrol EDGE 5W-30 Advanced Full Synthetic Motor Oil, 5 Quarts', product_key: 'CAS-EDG-5W30-5Q', brand: 'Castrol' },
      { id: 'a1208c4d-b6c8-47fb-8671-bc01db5452f5', name: 'Castrol GTX 15W-40 Diesel Engine Oil, 5L', product_key: 'CAS-GTX-15W40-5L', brand: 'Castrol' }
    ];
  };

  const handleTemplateChange = (t: string, m: string, l: string) => {
    setTemplate(t);
    setMarket(m);
    setLanguage(l);
  };

  return (
    <div className="font-sans">
      <Header
        query={headerQuery}
        onQueryChange={(val) => {
          setHeaderQuery(val);
          setShowHeaderResults(val.length >= 2);
        }}
        results={headerProducts}
        showResults={showHeaderResults}
        onSelect={handleToggleProduct}
        onFocus={() => setShowHeaderResults(headerQuery.length >= 2)}
        onCloseResults={() => setShowHeaderResults(false)}
      />
      <TemplateSelector
        initialTemplate={template}
        initialMarket={market}
        initialLanguage={language}
        onTemplateChange={handleTemplateChange}
      />
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-10">
        <div className="max-w-2xl w-full text-center">
          <div className="w-14 h-14 rounded-2xl bg-[var(--forest-700)] mx-auto flex items-center justify-center mb-5 shadow-lg">
            <SparkIcon className="w-7 h-7 text-[var(--lime-400)]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Create a new product listing</h1>
          <p className="text-gray-500 mb-8">Select your template, market and language above, then search for products to add.</p>
          
          <div ref={searchRef} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                const val = e.target.value;
                setQuery(val);
                setShowResults(val.length >= 2);
              }}
              onFocus={() => setShowResults(query.length >= 2)}
              placeholder="Search product name, SKU, or model number..."
              className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[var(--forest-500)] focus:border-transparent outline-none transition bg-white text-gray-800"
            />
            {showResults && results.length > 0 && (
              <ul className="absolute z-10 w-full mt-1.5 bg-white border border-gray-200 rounded-lg shadow-xl max-h-72 overflow-auto anim-in text-left">
                {results.map(p => {
                  const isChecked = selectedProducts.some(sp => sp.id === p.id);
                  return (
                    <li
                      key={p.id}
                      onClick={() => handleToggleProduct(p)}
                      className="px-4 py-3 hover:bg-emerald-50 cursor-pointer flex items-center justify-between border-b border-gray-100 last:border-0"
                    >
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

          {/* Selected Products Chips display */}
          {selectedProducts.length > 0 && (
            <div className="mt-8 text-left bg-white p-5 rounded-xl border border-gray-200 shadow-sm anim-in">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Selected Products ({selectedProducts.length})</span>
                <button
                  onClick={() => setSelectedProducts([])}
                  className="text-xs font-bold text-red-500 hover:text-red-700 transition"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedProducts.map(p => (
                  <div
                    key={p.id}
                    className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200 text-sm font-medium"
                  >
                    <div className="max-w-[240px] truncate" title={p.name}>
                      {p.name}
                    </div>
                    <span className="text-xs text-emerald-600 font-mono font-semibold shrink-0">({p.product_key})</span>
                    <button
                      onClick={() => handleRemoveProduct(p.id)}
                      className="text-emerald-600 hover:text-emerald-950 font-extrabold focus:outline-none ml-1 text-sm leading-none shrink-0"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <Button
              variant="primary"
              onClick={handleCreateListing}
              disabled={selectedProducts.length === 0}
              className="px-6 py-3 text-base font-bold shadow-md hover:shadow-lg disabled:shadow-none"
            >
              Create Listing for Selected Products ({selectedProducts.length})
            </Button>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">or</span>
              <Button variant="outline" onClick={handleViewDemo} className="font-semibold">View Demo Batch Listing →</Button>
            </div>
            <p className="text-xs text-gray-400">Try typing "Castrol" in the search bar above to select multiple items.</p>
          </div>
        </div>
      </div>
    </div>
  );
};