import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Product, Order } from '../types';
import { Plus, Trash2, Edit2, X, Check, Package, DollarSign, Layout, Image as ImageIcon, ClipboardList, Download, ShoppingBag, Mail, Calendar, CreditCard, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type AdminTab = 'products' | 'orders';

const AdminPage: React.FC = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'FASHION',
    image: '',
    description: '',
    isNew: false
  });

  useEffect(() => {
    if (isAdmin) {
      if (activeTab === 'products') {
        fetchProducts();
      } else {
        fetchOrders();
      }
    }
  }, [isAdmin, activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedOrders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const exportOrdersToCSV = () => {
    const headers = ['Order ID', 'Email', 'Items', 'Total', 'Status', 'Date'];
    const rows = orders.map(order => [
      order.id,
      order.userEmail,
      order.items.map(item => `${item.name} (x${item.quantity})`).join('; '),
      `$${order.total}`,
      order.status,
      order.createdAt?.toDate?.() ? order.createdAt.toDate().toLocaleDateString() : 'N/A'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        updatedAt: serverTimestamp(),
        // Defaults for now
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'White']
      };

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: serverTimestamp()
        });
      }
      
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ name: '', price: '', category: 'FASHION', image: '', description: '', isNew: false });
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteConfirmationText('');
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete || deleteConfirmationText !== 'REMOVE PRODUCT') return;
    
    try {
      await deleteDoc(doc(db, 'products', productToDelete.id));
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      description: product.description,
      isNew: product.isNew || false
    });
    setIsModalOpen(true);
  };

  if (authLoading || loading) return (
    <div className="pt-40 flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
    </div>
  );

  if (!isAdmin) return (
    <div className="pt-40 text-center min-h-screen">
      <h1 className="text-4xl font-display italic text-red-500">Access Denied</h1>
      <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">You do not have administrative privileges.</p>
    </div>
  );

  return (
    <div className="pt-32 sm:pt-48 px-6 max-w-screen-2xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8 pb-8 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-4">
             <span className="w-8 h-[1px] bg-accent"></span>
             <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Control Center</span>
          </div>
          <h1 className="text-6xl sm:text-7xl font-display tracking-tight text-ink italic leading-tight">Admin<span className="text-accent">.</span></h1>
          
          <div className="flex gap-8 mt-12">
            <button 
              onClick={() => setActiveTab('products')}
              className={`text-[10px] font-bold tracking-[0.3em] uppercase pb-2 transition-all ${activeTab === 'products' ? 'text-accent border-b border-accent' : 'text-gray-400 hover:text-ink'}`}
            >
              Inventory
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`text-[10px] font-bold tracking-[0.3em] uppercase pb-2 transition-all ${activeTab === 'orders' ? 'text-accent border-b border-accent' : 'text-gray-400 hover:text-ink'}`}
            >
              Orders Tracking
            </button>
          </div>
        </div>
        
        {activeTab === 'products' ? (
          <button 
            onClick={() => {
              setEditingProduct(null);
              setFormData({ name: '', price: '', category: 'FASHION', image: '', description: '', isNew: false });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-3 bg-ink text-white px-8 py-4 rounded-full font-bold text-xs tracking-widest hover:shadow-xl transition-all"
          >
            <Plus size={16} />
            ADD PRODUCT
          </button>
        ) : (
          <button 
            onClick={exportOrdersToCSV}
            className="flex items-center gap-3 bg-stone text-ink border border-gray-100 px-8 py-4 rounded-full font-bold text-xs tracking-widest hover:shadow-xl transition-all"
          >
            <Download size={16} />
            EXPORT TO CSV
          </button>
        )}
      </div>

      {activeTab === 'products' ? (
        <div className="grid grid-cols-1 gap-4">
          {products.map(product => (
            <div key={product.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-6 hover:shadow-md transition-all group">
              <div className="w-20 h-24 bg-stone rounded-xl overflow-hidden flex-shrink-0">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-bold tracking-widest text-accent uppercase">{product.category}</span>
                  {product.isNew && <span className="text-[9px] font-bold bg-accent/10 text-accent px-2 py-0.5 rounded-full">NEW</span>}
                </div>
                <h3 className="font-bold text-ink uppercase text-sm mb-1">{product.name}</h3>
                <p className="text-xs font-bold text-gray-400">${product.price}</p>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openEditModal(product)}
                  className="p-3 hover:bg-stone rounded-full text-gray-500 hover:text-ink transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDeleteClick(product)}
                  className="p-3 hover:bg-stone rounded-full text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden overflow-x-auto premium-shadow">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-stone/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-bold tracking-widest text-gray-400 uppercase">Order Details</th>
                <th className="px-8 py-6 text-[10px] font-bold tracking-widest text-gray-400 uppercase">Customer</th>
                <th className="px-8 py-6 text-[10px] font-bold tracking-widest text-gray-400 uppercase">Items</th>
                <th className="px-8 py-6 text-[10px] font-bold tracking-widest text-gray-400 uppercase">Total Amount</th>
                <th className="px-8 py-6 text-[10px] font-bold tracking-widest text-gray-400 uppercase">Status</th>
                <th className="px-8 py-6 text-[10px] font-bold tracking-widest text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-stone/30 transition-colors">
                  <td className="px-8 py-8">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono font-bold text-ink">#{order.id.slice(-8).toUpperCase()}</span>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar size={10} />
                        <span className="text-[10px] font-bold">
                          {order.createdAt?.toDate?.() ? order.createdAt.toDate().toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-ink uppercase text-[11px] font-bold">
                        <Mail size={12} className="text-gray-400" />
                        {order.userEmail}
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">ID: {order.userId.slice(0, 12)}...</span>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex flex-col gap-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-stone overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-[10px] font-bold text-ink uppercase truncate max-w-[120px]">{item.name}</span>
                          <span className="text-[9px] font-mono text-gray-400">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-2 text-xs font-bold text-ink">
                      <CreditCard size={14} className="text-gray-400" />
                      ${order.total.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="relative group/status">
                      <span className={`
                        px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-tighter inline-flex items-center gap-2 cursor-pointer
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-600' : 
                          order.status === 'cancelled' ? 'bg-red-100 text-red-600' : 
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}
                      `}>
                        <span className={`w-1 h-1 rounded-full ${
                          order.status === 'delivered' ? 'bg-green-600' : 
                          order.status === 'cancelled' ? 'bg-red-600' : 
                          order.status === 'shipped' ? 'bg-blue-600' : 'bg-orange-600'
                        }`}></span>
                        {order.status}
                        <ChevronDown size={10} />
                      </span>
                      
                      <div className="absolute top-full left-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 hidden group-hover/status:block z-20 py-2">
                        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(order.id, status as any)}
                            className="w-full text-left px-4 py-2 text-[9px] font-bold uppercase tracking-widest hover:bg-stone transition-colors"
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <button 
                      onClick={() => {
                        if (window.confirm('Archive this order?')) {
                          console.log('Archiving order:', order.id);
                        }
                      }}
                      className="p-3 hover:bg-stone rounded-full text-gray-400 hover:text-ink transition-colors"
                    >
                      <ClipboardList size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-32 text-center">
                    <ShoppingBag size={48} className="mx-auto text-gray-100 mb-6" />
                    <p className="text-[10px] font-bold tracking-[0.3em] text-gray-300 uppercase">No orders found in the system</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-stone/30">
                <h2 className="text-2xl font-display italic">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-stone rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase flex items-center gap-2">
                      <Layout size={10} /> Product Name
                    </label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-stone border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase flex items-center gap-2">
                      <DollarSign size={10} /> Price
                    </label>
                    <input 
                      required
                      type="number" 
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-stone border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase flex items-center gap-2">
                    <Package size={10} /> Category
                  </label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-stone border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-accent/20"
                  >
                    <option value="FASHION">FASHION</option>
                    <option value="ELECTRONICS">ELECTRONICS</option>
                    <option value="WATCHES">WATCHES</option>
                    <option value="JEWELRY">JEWELRY</option>
                    <option value="ACCESSORIES">ACCESSORIES</option>
                    <option value="HOME">HOME</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase flex items-center gap-2">
                    <ImageIcon size={10} /> Image URL
                  </label>
                  <input 
                    required
                    type="url" 
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-stone border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase flex items-center gap-2">
                    Description
                  </label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-stone border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-accent/20"
                  ></textarea>
                </div>

                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="isNew"
                    checked={formData.isNew}
                    onChange={e => setFormData({ ...formData, isNew: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
                  />
                  <label htmlFor="isNew" className="text-xs font-bold text-gray-600 uppercase tracking-widest">Mark as New Arrival</label>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-accent text-white py-4 rounded-xl font-bold tracking-widest text-xs hover:shadow-xl transition-all shadow-lg flex items-center justify-center gap-3"
                >
                  <Check size={16} />
                  {editingProduct ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-ink/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-[40px] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-red-50/30">
                <h2 className="text-2xl font-display italic text-red-600">Delete Product?</h2>
                <button onClick={() => setIsDeleteModalOpen(false)} className="p-2 hover:bg-stone rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <p className="text-xs font-bold text-gray-500 leading-relaxed uppercase tracking-widest">
                  This action is irreversible. To confirm deletion of <span className="text-ink">"{productToDelete?.name}"</span>, please type <span className="text-red-500 italic">REMOVE PRODUCT</span> below.
                </p>

                <input 
                  type="text" 
                  value={deleteConfirmationText}
                  onChange={e => setDeleteConfirmationText(e.target.value)}
                  placeholder="Type here..."
                  className="w-full bg-stone border-none rounded-xl px-4 py-4 text-xs font-bold tracking-widest focus:ring-2 focus:ring-red-500/20 text-center uppercase"
                />

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={confirmDelete}
                    disabled={deleteConfirmationText !== 'REMOVE PRODUCT'}
                    className="w-full bg-red-500 text-white py-4 rounded-xl font-bold tracking-widest text-xs hover:shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    PERMANENTLY DELETE
                  </button>
                  <button 
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="w-full py-4 rounded-xl font-bold tracking-widest text-xs text-gray-400 hover:text-ink transition-colors"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPage;
