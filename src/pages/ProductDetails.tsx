import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Minus, Share2, Info, Heart } from 'lucide-react';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const toggleWishlist = () => {
    if (!product) return;
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-4xl font-display uppercase tracking-widest">PRODUCT_NOT_FOUND</h1>
      </div>
    );
  }

  return (
    <div className="pt-32 sm:pt-48 min-h-screen px-6 max-w-7xl mx-auto mb-20">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center space-x-4 text-[10px] font-bold tracking-[0.2em] text-gray-400 hover:text-accent transition-colors mb-12 uppercase group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" />
        <span>Back to Collection</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
        {/* Gallery */}
        <div className="lg:col-span-7 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="aspect-[3/4] bg-stone overflow-hidden rounded-[2.5rem] premium-shadow border border-gray-100 cursor-zoom-in relative"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
          >
            <motion.img 
              src={product.image} 
              alt={product.name}
              referrerPolicy="no-referrer"
              animate={{ 
                scale: isZooming ? 1.5 : 1,
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
              }}
              transition={{ 
                scale: { duration: 0.4 },
                transformOrigin: { duration: 0 } // Immediate tracking
              }}
              className="w-full h-full object-cover"
            />
            {/* Gloss Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/10 to-transparent mix-blend-overlay" />
          </motion.div>
          <div className="grid grid-cols-2 gap-8">
             <div className="aspect-[4/5] bg-stone overflow-hidden rounded-2xl border border-gray-50">
                <img src={`https://picsum.photos/seed/${product.id}1/800/1000`} alt="detail" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
             </div>
             <div className="aspect-[4/5] bg-stone overflow-hidden rounded-2xl border border-gray-50">
                <img src={`https://picsum.photos/seed/${product.id}2/800/1000`} alt="detail" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
             </div>
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-5 h-fit space-y-10 lg:sticky lg:top-32">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <span className="w-8 h-[1px] bg-accent"></span>
               <span className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase italic">{product.category}</span>
            </div>
            <h1 className="text-5xl font-display tracking-tight text-ink italic leading-tight">{product.name}</h1>
            <div className="flex items-end justify-between border-b border-gray-100 pb-6">
               <p className="text-3xl font-bold text-gray-900">${product.price}</p>
               <span className="text-[10px] font-mono text-gray-300">ID: {product.id}</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed font-medium">
            {product.description}
          </p>

          <div className="space-y-10">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                <span>Select Size</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button key={size} className="text-[11px] font-bold px-5 h-12 flex items-center justify-center border rounded-xl hover:border-accent hover:text-accent transition-all">
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                <span>Color Way</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button key={color} className="text-[10px] font-bold tracking-widest px-6 py-3 border rounded-xl hover:border-accent hover:text-accent transition-all uppercase">
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-y border-gray-100 py-6">
              <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Quantity</span>
              <div className="flex items-center space-x-6 bg-stone p-1 rounded-full px-4">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-accent transition-colors"><Minus size={14} /></button>
                <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-accent transition-colors"><Plus size={14} /></button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => {
                for(let i=0; i<quantity; i++) addToCart(product);
              }}
              className="w-full bg-accent text-white py-6 font-bold tracking-widest text-xs hover:shadow-xl transition-all uppercase rounded-full shadow-lg flex items-center justify-center gap-4"
            >
              Add to Bag
              <Plus size={16} />
            </button>
            <div className="flex gap-4">
              <button 
                onClick={toggleWishlist}
                className={`flex-[0.5] border py-4 rounded-xl flex items-center justify-center space-x-2 text-[10px] font-bold tracking-widest transition-all uppercase ${isWishlisted ? 'bg-accent border-accent text-white' : 'border-gray-100 text-gray-500 hover:border-accent'}`}
              >
                <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
                <span>{isWishlisted ? 'Saved' : 'Save'}</span>
              </button>
              <button className="flex-1 border border-gray-100 py-4 rounded-xl flex items-center justify-center space-x-2 text-[10px] font-bold tracking-widest hover:border-accent transition-all uppercase text-gray-500">
                <Share2 size={14} />
                <span>Share</span>
              </button>
              <button className="flex-1 border border-gray-100 py-4 rounded-xl flex items-center justify-center space-x-2 text-[10px] font-bold tracking-widest hover:border-accent transition-all uppercase text-gray-500">
                <Info size={14} />
                <span>Guide</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
