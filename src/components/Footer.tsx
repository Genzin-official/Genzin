import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone border-t border-gray-100 pt-24 pb-12">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-16 mb-20">
          <div className="md:col-span-2">
            <h2 className="text-5xl font-display tracking-tight mb-8">Genzin</h2>
            <p className="max-w-sm text-sm text-gray-500 leading-relaxed">
              Your global destination for premium tech, fashion, and home essentials. Quality guaranteed, style redefined.
            </p>
          </div>
          
          <div>
            <h3 className="text-[10px] font-bold tracking-[0.2em] mb-8 uppercase text-gray-400">Explore</h3>
            <ul className="space-y-4 text-xs font-bold uppercase text-ink">
              <li><Link to="/shop" className="hover:text-accent transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=ELECTRONICS" className="hover:text-accent transition-colors">Gadgets & Tech</Link></li>
              <li><Link to="/shop?category=WATCHES" className="hover:text-accent transition-colors">Luxury Watches</Link></li>
              <li><Link to="/shop?category=JEWELRY" className="hover:text-accent transition-colors">Fine Jewelry</Link></li>
              <li><Link to="/shop?category=ACCESSORIES" className="hover:text-accent transition-colors">Accessories</Link></li>
              <li className="pt-2 border-t border-gray-200 mt-2"><Link to="/wishlist" className="text-accent hover:underline">My Wishlist</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-bold tracking-[0.2em] mb-8 uppercase text-gray-400">Support</h3>
            <ul className="space-y-4 text-xs font-bold uppercase text-ink">
              <li><a href="#" className="hover:text-accent transition-colors">Shipping</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-bold tracking-[0.2em] mb-8 uppercase text-gray-400">Join Us</h3>
            <div className="flex space-x-4 mb-8">
              <a href="#" className="hover:text-accent text-ink transition-colors"><Instagram size={18} /></a>
              <a href="#" className="hover:text-accent text-ink transition-colors"><Twitter size={18} /></a>
              <a href="#" className="hover:text-accent text-ink transition-colors"><Youtube size={18} /></a>
            </div>
            <form className="flex border-b border-gray-200 pb-2">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="bg-transparent text-[10px] text-ink w-full focus:outline-none tracking-widest uppercase font-bold"
              />
              <button type="submit" className="text-ink hover:text-accent p-2">
                <ArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-12 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold tracking-widest uppercase text-gray-400">
          <p>© 2026 Genzin // All Rights Reserved</p>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <a href="#" className="hover:text-ink transition-colors">Privacy</a>
            <a href="#" className="hover:text-ink transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
