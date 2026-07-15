import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from '@/components/Layout/Header';
import { Button } from '@/components/common/Button';

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

  // Clear search queries when dropdowns are closed
  useEffect(() => {
    if (!showResults) {
      setQuery('');
      setDebouncedQuery('');
    }
  }, [showResults]);

  useEffect(() => {
    if (!showHeaderResults) {
      setHeaderQuery('');
      setDebouncedHeaderQuery('');
    }
  }, [showHeaderResults]);

  const results = useMemo(() => {
    if (query.trim().length === 0) return [];
    return centerProducts;
  }, [query, centerProducts]);

  const filteredHeaderProducts = useMemo(() => {
    if (headerQuery.trim().length === 0) return [];
    return headerProducts;
  }, [headerQuery, headerProducts]);

  const handleToggleProduct = (p: Product) => {
    if (p.id === '__clear_all__') {
      setSelectedProducts([]);
      return;
    }
    setSelectedProducts((prev) => {
      const exists = prev.some((sp) => sp.id === p.id);
      if (exists) {
        return prev.filter((sp) => sp.id !== p.id);
      } else {
        return [...prev, p];
      }
    });
  };


  const handleCreateListing = () => {
    if (selectedProducts.length === 0) return;
    const ids = selectedProducts.map((sp) => sp.id).join(',');
    navigate(`/listing?productIds=${ids}&template=${template}&market=${market}&language=${language}`);
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
          setShowHeaderResults(true);
        }}
        results={filteredHeaderProducts}
        showResults={showHeaderResults}
        onSelect={handleToggleProduct}
        onFocus={() => setShowHeaderResults(true)}
        onCloseResults={() => setShowHeaderResults(false)}
        showSearch={false}
        selectedProducts={selectedProducts}
      />
      <TemplateSelector
        initialTemplate={template}
        initialMarket={market}
        initialLanguage={language}
        onTemplateChange={handleTemplateChange}
      />
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-10">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Create a new product listing</h1>
          <p className="text-gray-500 mb-8">Select your template, market and language above, then search for products to add.</p>
          
          <div ref={searchRef} className="relative">
            <div 
              className="w-full bg-white border border-gray-300 rounded-lg shadow-sm flex flex-wrap items-center gap-2 pl-4 pr-14 py-3 min-h-[58px] focus-within:ring-2 focus-within:ring-[var(--forest-500)] focus-within:border-transparent transition cursor-text relative"
              onClick={() => {
                const inputEl = document.getElementById('center-search-input');
                inputEl?.focus();
              }}
            >
              {/* Render selected product chips inside the search container */}
              {selectedProducts.map(p => (
                <span 
                  key={p.id} 
                  className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-3 py-1 rounded border border-emerald-200 text-xs font-semibold select-none max-w-[200px]"
                >
                  <span className="truncate" title={p.name}>{p.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleProduct(p);
                    }}
                    className="text-emerald-600 hover:text-emerald-950 font-bold ml-1 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              ))}

              <input
                id="center-search-input"
                type="text"
                value={query}
                onChange={(e) => {
                  const val = e.target.value;
                  setQuery(val);
                  setShowResults(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && query.length === 0 && selectedProducts.length > 0) {
                    handleToggleProduct(selectedProducts[selectedProducts.length - 1]);
                  }
                }}
                onFocus={() => setShowResults(true)}
                placeholder={selectedProducts.length === 0 ? "Search product name, SKU, or model number..." : ""}
                className="border-none outline-none flex-1 min-w-[150px] bg-transparent text-sm py-1 text-gray-800 placeholder-gray-400"
              />

              {selectedProducts.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProducts([]);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-red-500 transition px-2 select-none py-1"
                >
                  Clear
                </button>
              )}
            </div>

            {showResults && results.length > 0 && (
              <div className="absolute z-10 w-full mt-1.5 bg-white border border-gray-200 rounded-lg shadow-xl max-h-72 overflow-auto anim-in text-left">
                <ul>
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
              </div>
            )}
          </div>

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

          </div>
        </div>
      </div>
    </div>
  );
};