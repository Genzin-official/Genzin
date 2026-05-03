import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Terminal, Zap } from 'lucide-react';
import { motion } from 'motion/react';

const Home: React.FC = () => {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      const q = query(collection(db, 'products'), limit(3));
      const querySnapshot = await getDocs(q);
      const fetchedProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as any)
      })) as Product[];
      setFeatured(fetchedProducts);
    };

    fetchFeatured();
  }, []);

  return (
    <div className="bg-paper min-h-screen">
      {/* Refinement Hero */}
      <section className="relative h-[85vh] bg-stone overflow-hidden">
        {/* Background Image - Refined look */}
        <div className="absolute inset-0 grayscale-[0.5] contrast-100 brightness-90">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000" 
            alt="Retail" 
            className="w-full h-full object-cover" 
            referrerPolicy="no-referrer" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/30 via-transparent to-transparent"></div>
        </div>
        
        {/* Huge Background Title - Modern Serif */}
        <div className="absolute inset-0 flex flex-col justify-center items-center z-10 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center"
          >
            <h1 className="text-[12vw] leading-none font-display text-white tracking-tight italic">
              Global Market
            </h1>
            <p className="text-white/80 text-xl font-light tracking-[0.2em] uppercase mt-4">
              Premium Selection & Daily Arrivals
            </p>
          </motion.div>
        </div>

        {/* Floating Info Box - Minimalist */}
        <div className="absolute bottom-12 left-12 z-30 max-w-sm hidden md:block">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="bg-white/90 backdrop-blur-sm p-8 premium-shadow border border-white/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-mono text-accent tracking-[0.2em] font-bold uppercase">
                CURATED COLLECTIONS
              </span>
            </div>
            <p className="text-sm font-medium leading-relaxed text-ink/80 mb-6">
              Discover a meticulously selected range of technology, fashion, and home essentials designed for modern living.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/shop" className="text-[10px] font-bold tracking-widest text-ink hover:text-accent transition-colors border-b border-ink/20 pb-1">
                EXPLORE ALL
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom Right CTA */}
        <div className="absolute bottom-0 right-0 z-30">
          <Link to="/shop" className="group flex flex-col items-center">
            <div className="bg-accent w-64 h-24 flex items-center justify-center relative overflow-hidden transition-all group-hover:h-32">
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-4 text-ink font-black tracking-[0.3em] text-[10px] relative z-10">
                SHOP NOW <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </div>
              {/* Scanlines on button */}
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px]"></div>
            </div>
          </Link>
        </div>

        {/* Pagination Indicators as per screenshot */}
        <div className="absolute top-12 left-12 z-30 flex gap-2">
          {[ '01', '02', '03' ].map((n, i) => (
            <div key={n} className={`w-10 h-10 rounded-full border flex items-center justify-center text-[9px] font-mono ${i === 0 ? 'bg-accent border-accent text-ink' : 'border-white/20 text-white/40'}`}>
              {n}
            </div>
          ))}
          <div className="ml-4 h-10 flex items-center">
             <span className="text-[8px] font-mono text-white/30 tracking-[0.5em] uppercase">SYSTEM READY</span>
          </div>
        </div>
      </section>

      {/* Grid Collections */}
      <section className="py-24 px-4 bg-white relative overflow-hidden">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex justify-between items-end mb-16 border-b border-gray-100 pb-8">
            <h2 className="text-5xl font-display tracking-tight italic">DEPARTMENTS</h2>
            <div className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.4em] hidden md:block">QUALITY ASURED</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             <div className="lg:col-span-2 bg-stone p-12 flex flex-col justify-between aspect-video relative group overflow-hidden border border-gray-100 transition-all hover:border-accent/20">
                <div className="relative z-10">
                  <h2 className="text-7xl font-display tracking-tighter mb-4 italic">Tech & Gadgets</h2>
                  <p className="text-gray-500 max-w-xs text-sm">Next-generation hardware and software for the modern professional.</p>
                </div>
                <Link to="/shop?category=ELECTRONICS" className="relative z-10 text-[10px] font-bold tracking-widest border-b border-accent text-accent uppercase w-fit pb-1">Shop Electronics</Link>
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Zap size={120} />
                </div>
             </div>
             
             <div className="bg-white p-12 border border-gray-100 flex flex-col items-center justify-center text-center transition-all hover:bg-stone">
                <span className="text-7xl font-display mb-2">Luxury</span>
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400">Watches & Jewelry</p>
                <Link to="/shop?category=WATCHES" className="mt-8 text-[10px] font-bold tracking-widest border-b border-ink uppercase">Explore Luxury</Link>
             </div>

             <div className="bg-white border border-gray-100 relative group overflow-hidden">
                <div className="p-8 pb-4">
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400">Essential Pieces</span>
                </div>
                <div className="px-8 pb-8">
                  <img 
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400" 
                    alt="trending" 
                    className="w-full h-48 object-cover grayscale brightness-110 mb-4 transition-all group-hover:grayscale-0" 
                  />
                  <Link to="/shop?category=WATCHES" className="text-xs font-bold uppercase tracking-widest text-center block hover:text-accent">Timed Perfection</Link>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Featured units */}
      <section className="py-32 px-4 max-w-screen-2xl mx-auto">
        <h2 className="text-6xl font-display uppercase tracking-tighter leading-none italic mb-16">EDITOR'S CHOICE</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
