import React, { useState, useMemo, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { Filter as FilterIcon, X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'ELECTRONICS' | 'FASHION' | 'WATCHES' | 'JEWELRY' | 'ACCESSORIES' | 'HOME'>('ALL');
  const [activeSizes, setActiveSizes] = useState<string[]>([]);
  const [activeColors, setActiveColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories: ('ALL' | 'ELECTRONICS' | 'FASHION' | 'WATCHES' | 'JEWELRY' | 'ACCESSORIES' | 'HOME')[] = [
    'ALL', 'ELECTRONICS', 'FASHION', 'WATCHES', 'JEWELRY', 'ACCESSORIES', 'HOME'
  ];

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(fetchedProducts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const allSizes = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach(p => p.sizes?.forEach(s => sizes.add(s)));
    return Array.from(sizes).sort();
  }, [products]);

  const allColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach(p => p.colors?.forEach(c => colors.add(c)));
    return Array.from(colors).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const categoryMatch = activeCategory === 'ALL' || product.category === activeCategory;
      const sizeMatch = activeSizes.length === 0 || product.sizes?.some(s => activeSizes.includes(s));
      const colorMatch = activeColors.length === 0 || product.colors?.some(c => activeColors.includes(c));
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return categoryMatch && sizeMatch && colorMatch && priceMatch;
    });
  }, [products, activeCategory, activeSizes, activeColors, priceRange]);

  const toggleSize = (size: string) => {
    setActiveSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setActiveColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const resetFilters = () => {
    setActiveCategory('ALL');
    setActiveSizes([]);
    setActiveColors([]);
    setPriceRange([0, 2000]);
  };

  return (
    <div className="pt-32 sm:pt-48 min-h-screen px-6 max-w-screen-2xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 pb-12 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-4">
             <span className="w-8 h-[1px] bg-accent"></span>
             <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">OUR COLLECTION</span>
          </div>
          <h1 className="text-6xl sm:text-[10vw] font-display tracking-tight text-ink italic">Market<span className="text-accent">.</span></h1>
        </div>
        
        <div className="flex items-center gap-4">
          <p className="hidden md:block text-[10px] font-bold text-gray-400 mr-4">SHOWING {filteredProducts.length} PRODUCTS</p>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] px-8 py-4 border transition-all rounded-full ${isFilterOpen ? 'bg-ink text-white border-ink' : 'bg-white text-ink border-gray-200 hover:border-accent'}`}
          >
            {isFilterOpen ? <X size={14} /> : <FilterIcon size={14} />}
            {isFilterOpen ? 'CLOSE' : 'FILTERS'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Filters Sidebar */}
        <AnimatePresence mode="wait">
          {isFilterOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-3 space-y-10 bg-white p-8 rounded-2xl border border-gray-100 h-fit sticky top-32 z-10 shadow-sm"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-6">
                <h3 className="text-xl font-display italic">Refine</h3>
                <button onClick={resetFilters} className="text-[10px] font-bold text-accent hover:underline">RESET ALL</button>
              </div>

              {/* Category */}
              <div>
                <h4 className="text-[10px] font-bold tracking-widest uppercase mb-6 text-gray-400">Department</h4>
                <div className="flex flex-col space-y-1">
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`text-left px-4 py-3 text-xs font-bold tracking-wider transition-all rounded-lg ${activeCategory === cat ? 'bg-accent/10 text-accent' : 'text-gray-500 hover:bg-stone'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <h4 className="text-[10px] font-bold tracking-widest uppercase mb-6 text-gray-400">Size</h4>
                <div className="grid grid-cols-3 gap-2">
                  {allSizes.map(size => (
                    <button 
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`py-3 text-[10px] font-bold border rounded-lg transition-all ${activeSizes.includes(size) ? 'bg-ink text-white border-ink' : 'bg-white border-gray-100 text-gray-400 hover:border-accent'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <h4 className="text-[10px] font-bold tracking-widest uppercase mb-6 text-gray-400">Color</h4>
                <div className="flex flex-wrap gap-2">
                  {allColors.map(color => (
                    <button 
                      key={color}
                      onClick={() => toggleColor(color)}
                      className={`px-4 py-2 text-[10px] font-bold border rounded-lg transition-all uppercase ${activeColors.includes(color) ? 'bg-ink text-white border-ink' : 'bg-white border-gray-100 text-gray-400 hover:border-accent'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="text-[10px] font-bold tracking-widest uppercase mb-6 text-gray-400">Price Range</h4>
                <div className="space-y-6">
                  <div className="flex justify-between text-xs font-bold text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="2000" 
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className={`${isFilterOpen ? 'lg:col-span-9' : 'lg:col-span-12'}`}>
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProducts.length === 0 && (
            <div className="py-32 text-center bg-stone rounded-3xl border border-gray-100">
              <p className="text-xl font-display italic text-gray-400">No matches found in this department.</p>
              <button 
                onClick={resetFilters}
                className="mt-8 bg-accent text-white px-10 py-4 text-xs font-bold tracking-widest uppercase rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
