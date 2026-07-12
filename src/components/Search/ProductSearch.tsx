import { useState, useEffect, useRef } from 'react';
import { Spinner } from '@/components/common/Spinner';

interface ProductSearchProps { onSelect: (productId: number) => void; isLoading?: boolean; }

const mockProducts = [
  { id: 1, name: 'Castrol EDGE 5W-30 Advanced Full Synthetic Motor Oil, 5 Quarts', product_key: 'CAS-EDG-5W30-5Q' },
  { id: 2, name: 'Castrol GTX 15W40 Diesel Engine Oil 5L', product_key: 'CAS-GTX-15W40-5L' },
  { id: 3, name: 'Castrol MAGNATEC 5W-30 C3', product_key: 'CAS-MAG-5W30' },
];

export const ProductSearch = ({ onSelect, isLoading }: ProductSearchProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<typeof mockProducts>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        setProducts(mockProducts.filter(p =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.product_key.toLowerCase().includes(query.toLowerCase())
        ));
        setIsOpen(true);
      } else setIsOpen(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (id: number) => { setIsOpen(false); setQuery(''); onSelect(id); };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={wrapperRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter Product Name or Model Number to start..."
          className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          disabled={isLoading}
        />
        {isLoading && <div className="absolute right-4 top-1/2 -translate-y-1/2"><Spinner size="sm" /></div>}
      </div>
      {isOpen && products.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {products.map((p) => (
            <li key={p.id} onClick={() => handleSelect(p.id)} className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between border-b border-gray-100 last:border-0">
              <span className="font-medium">{p.name}</span>
              <span className="text-sm text-gray-500">{p.product_key}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};