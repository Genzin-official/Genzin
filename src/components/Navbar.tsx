import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Heart, User as UserIcon, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle, logout } from '../lib/firebase';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const { user, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="flex justify-between items-center h-20 sm:h-[100px]">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-stone transition-colors sm:hidden text-ink"
            >
              <Menu size={20} />
            </button>
            <Link to="/" className="text-4xl font-display tracking-tight text-ink lowercase first-letter:uppercase">
              Genzin
            </Link>
            
            <div className="hidden sm:flex items-center gap-10 ml-8 md:ml-16">
              <Link to="/shop" className="text-[12px] font-bold tracking-widest text-gray-500 hover:text-accent transition-all uppercase">
                Shop
              </Link>
              <Link to="/shop?category=ELECTRONICS" className="text-[12px] font-bold tracking-widest text-gray-500 hover:text-accent transition-all uppercase">
                Tech
              </Link>
              <Link to="/shop?category=FASHION" className="text-[12px] font-bold tracking-widest text-gray-500 hover:text-accent transition-all uppercase">
                Fashion
              </Link>
              <Link to="/shop?category=WATCHES" className="text-[12px] font-bold tracking-widest text-gray-500 hover:text-accent transition-all uppercase">
                Watches
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center border border-gray-100 rounded-full px-4 py-2 bg-stone focus-within:bg-white focus-within:border-accent/30 transition-all">
              <Search size={14} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="bg-transparent border-none focus:ring-0 text-xs ml-2 w-48 font-medium"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <button 
                  onClick={() => user ? setShowUserMenu(!showUserMenu) : signInWithGoogle()}
                  className="p-3 hover:bg-stone rounded-full transition-all group flex items-center gap-2"
                >
                  {user ? (
                    <img src={user.photoURL || ''} alt="avatar" className="w-5 h-5 rounded-full" />
                  ) : (
                    <UserIcon size={20} className="text-ink" />
                  )}
                  {user && <span className="hidden md:block text-[10px] font-bold tracking-widest uppercase">{user.displayName?.split(' ')[0]}</span>}
                </button>

                <AnimatePresence>
                  {showUserMenu && user && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-2xl border border-gray-100 py-2 z-50"
                    >
                      {isAdmin && (
                        <Link 
                          to="/admin" 
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-6 py-3 text-xs font-bold hover:bg-stone transition-colors text-ink"
                        >
                          <Settings size={14} />
                          Admin Panel
                        </Link>
                      )}
                      <button 
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="flex items-center gap-3 px-6 py-3 text-xs font-bold hover:bg-stone transition-colors text-red-500 w-full text-left"
                      >
                        <LogOut size={14} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/wishlist" className="relative p-3 hover:bg-stone rounded-full transition-all group">
              <Heart size={20} className="text-ink" fill={wishlist.length > 0 ? "currentColor" : "none"} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-accent text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative p-3 hover:bg-stone rounded-full transition-all group">
              <ShoppingBag size={20} className="text-ink" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-accent text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="sm:hidden absolute top-0 left-0 w-full bg-paper border-b border-ink"
          >
            <div className="p-4 flex justify-between items-center border-b border-ink/10">
              <span className="font-display text-xl">MENU</span>
              <button onClick={() => setIsOpen(false)}><X size={24} /></button>
            </div>
            <div className="flex flex-col p-6 space-y-6">
              <Link to="/shop" onClick={() => setIsOpen(false)} className="text-3xl font-display uppercase tracking-tight">SHOP ALL</Link>
              <Link to="/shop?category=ELECTRONICS" onClick={() => setIsOpen(false)} className="text-3xl font-display uppercase tracking-tight text-accent">TECH</Link>
              <Link to="/shop?category=FASHION" onClick={() => setIsOpen(false)} className="text-3xl font-display uppercase tracking-tight">FASHION</Link>
              <Link to="/shop?category=WATCHES" onClick={() => setIsOpen(false)} className="text-3xl font-display uppercase tracking-tight">WATCHES</Link>
              <Link to="/wishlist" onClick={() => setIsOpen(false)} className="text-3xl font-display uppercase tracking-tight">MY WISHLIST ({wishlist.length})</Link>
              <Link to="/cart" onClick={() => setIsOpen(false)} className="text-3xl font-display uppercase tracking-tight">MY BAG ({totalItems})</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
