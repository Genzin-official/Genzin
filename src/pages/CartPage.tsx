import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db, signInWithGoogle } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, CheckCircle2, User, MapPin, Phone, CreditCard } from 'lucide-react';
import { BillingInfo } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({ ...prev, [name]: value }));
  };

  const isBillingValid = () => {
    return Object.values(billingInfo).every(val => typeof val === 'string' && val.trim().length > 0);
  };

  const handleCheckout = async () => {
    if (!user) {
      signInWithGoogle();
      return;
    }

    if (!isBillingValid()) {
      alert("Please fill in all billing details.");
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total: totalPrice,
        status: 'pending' as const,
        billingInfo,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      
      // Sync to Google Sheets via backend API
      try {
        await fetch('/api/sync-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...orderData, id: docRef.id })
        });
      } catch (error) {
        console.warn("Sheets sync failed but order was placed:", error);
      }

      setIsSuccess(true);
      clearCart();
      setTimeout(() => {
        navigate('/shop');
      }, 3000);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("There was an error processing your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="pt-40 pb-20 px-4 text-center min-h-[80vh] flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12 }}
        >
          <CheckCircle2 size={100} className="text-green-500 mb-8" />
        </motion.div>
        <h1 className="text-5xl font-display tracking-tight italic mb-6">Order Placed!</h1>
        <p className="text-[10px] tracking-[0.3em] font-bold text-gray-400 mb-12 uppercase">Thank you for your purchase. Redirecting you home...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-20 px-4 text-center min-h-[80vh] flex flex-col items-center justify-center">
        <ShoppingBag size={80} className="text-gray-100 mb-8" />
        <h1 className="text-4xl font-display tracking-tight text-ink italic mb-6 uppercase">YOUR BAG IS EMPTY</h1>
        <p className="text-[10px] tracking-[0.3em] font-bold text-gray-400 mb-12 uppercase">ADD ITEMS TO YOUR BAG TO CONTINUE SHOPPING</p>
        <Link to="/shop" className="bg-accent text-white px-12 py-6 font-bold tracking-widest text-sm hover:shadow-xl transition-all uppercase rounded-full">
          EXPLORE PRODUCTS
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 sm:pt-48 px-6 max-w-7xl mx-auto min-h-screen pb-20">
      <div className="mb-12">
        <h1 className="text-5xl sm:text-7xl font-display tracking-tight text-ink italic mb-2">My Bag</h1>
        <p className="text-[10px] tracking-[0.2em] font-bold text-gray-400 uppercase">You have {totalItems} items in your collection</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-12">
          {/* Billing Form */}
          <section className="bg-white rounded-[40px] p-8 sm:p-12 border border-gray-100 premium-shadow">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-stone rounded-full flex items-center justify-center">
                <MapPin size={20} className="text-accent" />
              </div>
              <h2 className="text-2xl font-display italic">Billing Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={billingInfo.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  className="w-full bg-stone border-none rounded-2xl px-6 py-4 text-xs font-bold tracking-widest focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={billingInfo.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  className="w-full bg-stone border-none rounded-2xl px-6 py-4 text-xs font-bold tracking-widest focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Address</label>
                <input 
                  type="text" 
                  name="address"
                  value={billingInfo.address}
                  onChange={handleInputChange}
                  placeholder="Street Address"
                  className="w-full bg-stone border-none rounded-2xl px-6 py-4 text-xs font-bold tracking-widest focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">City</label>
                <input 
                  type="text" 
                  name="city"
                  value={billingInfo.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="w-full bg-stone border-none rounded-2xl px-6 py-4 text-xs font-bold tracking-widest focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Zip Code</label>
                <input 
                  type="text" 
                  name="zipCode"
                  value={billingInfo.zipCode}
                  onChange={handleInputChange}
                  placeholder="12345"
                  className="w-full bg-stone border-none rounded-2xl px-6 py-4 text-xs font-bold tracking-widest focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={billingInfo.phone}
                  onChange={handleInputChange}
                  placeholder="+1 234 567 890"
                  className="w-full bg-stone border-none rounded-2xl px-6 py-4 text-xs font-bold tracking-widest focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </div>
          </section>

          <div className="space-y-10">
            <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div 
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                key={item.id} 
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 border-b border-gray-100 pb-10 group"
              >
                <div className="w-full sm:w-32 aspect-[3/4] bg-stone overflow-hidden rounded-xl border border-gray-50">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                </div>
                <div className="flex-grow flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base font-bold tracking-tight text-ink uppercase">{item.name}</h3>
                      <p className="font-bold text-ink">${item.price}</p>
                    </div>
                    <p className="text-[10px] text-gray-400 tracking-widest uppercase mb-6 font-bold">{item.category}</p>
                    
                    <div className="flex items-center space-x-8">
                      <div className="flex items-center space-x-6 bg-stone p-1 rounded-full px-4">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-sm font-bold text-gray-400 hover:text-accent transition-colors">-</button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-sm font-bold text-gray-400 hover:text-accent transition-colors">+</button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-8">
          <div className="bg-white p-10 space-y-8 premium-shadow rounded-3xl border border-gray-50">
            <h2 className="text-2xl font-display italic tracking-tight border-b border-gray-100 pb-4">Summary</h2>
            
            <div className="space-y-4 text-xs font-bold tracking-widest uppercase">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>${totalPrice}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-accent">FREE</span>
              </div>
              <div className="flex justify-between text-ink text-sm font-bold pt-4 border-t border-gray-100">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-accent text-white py-6 font-bold tracking-widest text-xs hover:shadow-xl transition-all uppercase flex items-center justify-center space-x-4 rounded-full disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>Checkout Now</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
          
          <div className="p-8 border border-gray-100 rounded-2xl text-[10px] tracking-widest leading-relaxed uppercase opacity-40 font-bold">
            Secure checkout guaranteed. all major credit cards and digital wallets accepted.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
