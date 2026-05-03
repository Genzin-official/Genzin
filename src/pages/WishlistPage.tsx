import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const WishlistPage: React.FC = () => {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="pt-40 pb-20 px-4 text-center min-h-[80vh] flex flex-col items-center justify-center">
        <Heart size={80} className="text-gray-100 mb-8" />
        <h1 className="text-4xl font-display tracking-tight text-ink italic mb-6">Your Wishlist is Empty</h1>
        <p className="text-[10px] tracking-[0.3em] font-bold text-gray-400 mb-12 uppercase">Save items you love to view them here later</p>
        <Link to="/shop" className="bg-accent text-white px-12 py-6 font-bold tracking-widest text-sm hover:shadow-xl transition-all uppercase rounded-full">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 sm:pt-48 px-6 max-w-7xl mx-auto min-h-screen pb-20">
      <div className="mb-12">
        <h1 className="text-5xl sm:text-7xl font-display tracking-tight text-ink italic mb-2">My Wishlist</h1>
        <p className="text-[10px] tracking-[0.2em] font-bold text-gray-400 uppercase">You have {wishlist.length} items saved</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
