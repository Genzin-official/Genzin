import React from 'react';
import { motion } from 'motion/react';

const Editorial: React.FC = () => {
  const articles = [
    {
      id: '01',
      title: 'THE VOID',
      subtitle: 'VOL 1: ARCHITECTURAL FLUIDITY',
      image: 'https://picsum.photos/seed/editorial_v1/1000/1500',
      description: 'An exploration into the silent spaces of urban brutalism and how fashion inhabits them.'
    },
    {
      id: '02',
      title: 'NEON NOIR',
      subtitle: 'VOL 2: DIGITAL LIGHT',
      image: 'https://picsum.photos/seed/editorial_v2/1000/1500',
      description: 'The intersection of reactive textiles and cyberpunk aesthetics in the modern metropolis.'
    }
  ];

  return (
    <div className="pt-32 pb-20 px-4 max-w-screen-2xl mx-auto">
      <div className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
        <div>
          <span className="text-accent bg-ink px-3 py-1 text-[11px] font-black tracking-[0.5em] uppercase mb-6 inline-block">CHRONICLE</span>
          <h1 className="text-8xl sm:text-[14vw] font-display tracking-tight leading-[0.7] uppercase">THE<br />DRAFTS</h1>
        </div>
        <p className="text-xs font-mono font-bold leading-loose uppercase text-ink/40 max-w-sm mb-4">
          SYSTEMATIC EXPLORATION OF THE VISUAL TEXTURES INHABITING THE MODERN METROPOLIS.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-px bg-ink border-2 border-ink">
        {articles.map((article, index) => (
          <motion.div 
            key={article.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className={`grid grid-cols-1 lg:grid-cols-2 bg-paper items-stretch transition-colors hover:bg-accent group`}
          >
            <div className={`p-12 sm:p-20 flex flex-col justify-between ${index % 2 !== 0 ? 'lg:border-l-2 lg:border-ink' : 'lg:border-r-2 lg:border-ink'}`}>
               <div>
                  <span className="text-[10px] font-mono font-bold text-ink/40 mb-4 block group-hover:text-ink">{article.subtitle}</span>
                  <h2 className="text-7xl font-display uppercase tracking-tight mb-8 group-hover:skew-x-[-4deg] transition-transform">{article.title}</h2>
                  <p className="text-sm font-mono font-bold leading-relaxed max-w-sm">
                    {article.description}
                  </p>
               </div>
               <button className="w-fit bg-ink text-accent px-8 py-4 mt-12 text-[10px] font-black tracking-widest uppercase brutalist-shadow group-hover:bg-white group-hover:text-ink">
                  VIEW ARTICLE
               </button>
            </div>
            
            <div className="aspect-video lg:aspect-auto overflow-hidden bg-ink">
               <img 
                 src={article.image} 
                 alt={article.title} 
                 className="w-full h-full object-cover grayscale brightness-110 group-hover:grayscale-0 transition-all duration-700" 
                 referrerPolicy="no-referrer"
               />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-60 text-center py-40 border-t border-ink/5">
        <h3 className="text-4xl font-serif italic mb-8 italic">Stay Informed.</h3>
        <p className="text-[10px] tracking-[0.3em] uppercase max-w-xs mx-auto text-ink/40 leading-relaxed">
          JOIN OUR PRIVATE LIST FOR EARLY ACCESS TO LIMITED EDITORIAL DROPS AND UNDERGROUND EVENTS.
        </p>
      </div>
    </div>
  );
};

export default Editorial;
