import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Home, LogOut, LayoutDashboard, User, UtensilsCrossed, CreditCard, History, Calendar, MessageSquare, Bell } from 'lucide-react';
import PaymentForm from '../components/PaymentForm';
import '../index.css';

const API_BASE = 'http://localhost:5000';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

function FoodImage({ imageUrl }) {
  if (!imageUrl) return <span className="text-5xl">🍽️</span>;
  if (imageUrl.startsWith('/'))
    return <img src={`${API_BASE}${imageUrl}`} alt="" className="w-full h-full object-cover" />;
  return <span className="text-5xl">{imageUrl}</span>;
}

const MEAL_TIMES = [
  { id: 'breakfast', label: '🌅 Breakfast', icon: '🍳', time: '7:00 AM - 9:00 AM' },
  { id: 'lunch', label: '☀️ Lunch', icon: '🍛', time: '12:00 PM - 2:00 PM' },
  { id: 'dinner', label: '🌙 Dinner', icon: '🍲', time: '7:00 PM - 9:00 PM' },
  { id: 'tea', label: '🍵 Tea Time', icon: '☕', time: '4:00 PM - 6:00 PM' },
];

// Sample menu data
const SAMPLE_MENU = {
  breakfast: [
    { id: 'b1', name: 'Plain Tea + Bread', description: '2 slices of bread with butter', price: 150, category: 'breakfast', imageUrl: '🍞', isVegetarian: true },
    { id: 'b2', name: 'Chicken Roll + Tea', description: 'Chicken roll with vegetable salad', price: 200, category: 'breakfast', imageUrl: '🌯', isVegetarian: false },
    { id: 'b3', name: 'Egg Kottu', description: 'Sri Lankan style kottu with egg', price: 250, category: 'breakfast', imageUrl: '🍳', isVegetarian: true },
    { id: 'b4', name: 'Fish Paste Bun + Tea', description: '2 buns with fish paste', price: 180, category: 'breakfast', imageUrl: '🥐', isVegetarian: false },
    { id: 'b5', name: 'Chicken Sandwich', description: 'Grilled chicken sandwich with cheese', price: 300, category: 'breakfast', imageUrl: '🥪', isVegetarian: false },
  ],
  lunch: [
    { id: 'l1', name: 'Rice & Curry (Veg)', description: 'Rice with 2 vegetable curries', price: 250, category: 'lunch', imageUrl: '🍛', isVegetarian: true },
    { id: 'l2', name: 'Rice & Curry (Chicken)', description: 'Rice with chicken curry + veg', price: 350, category: 'lunch', imageUrl: '🍗', isVegetarian: false },
    { id: 'l3', name: 'Chicken Fried Rice', description: 'Chicken fried rice with egg', price: 400, category: 'lunch', imageUrl: '🍚', isVegetarian: false },
    { id: 'l4', name: 'Chicken Kottu', description: 'Chicken kottu rotti with gravy', price: 380, category: 'lunch', imageUrl: '🍲', isVegetarian: false },
    { id: 'l5', name: 'Noodles (Chicken)', description: 'Chicken noodles with vegetables', price: 320, category: 'lunch', imageUrl: '🍜', isVegetarian: false },
  ],
  dinner: [
    { id: 'd1', name: 'Rice & Curry (Fish)', description: 'Rice with fish curry + veg', price: 300, category: 'dinner', imageUrl: '🐟', isVegetarian: false },
    { id: 'd2', name: 'String Hoppers', description: '4 string hoppers with curry', price: 250, category: 'dinner', imageUrl: '🍝', isVegetarian: true },
    { id: 'd3', name: 'Pittu (Chicken)', description: 'Pittu with chicken curry', price: 320, category: 'dinner', imageUrl: '🍚', isVegetarian: false },
    { id: 'd4', name: 'Seeni Sambol Buns', description: '2 buns with seeni sambol', price: 200, category: 'dinner', imageUrl: '🥟', isVegetarian: true },
    { id: 'd5', name: 'Hoppers with Egg', description: '2 egg hoppers with lunumiris', price: 280, category: 'dinner', imageUrl: '🥞', isVegetarian: true },
  ],
  tea: [
    { id: 't1', name: 'Plain Tea', description: 'Hot cup of Ceylon tea', price: 80, category: 'tea', imageUrl: '☕', isVegetarian: true },
    { id: 't2', name: 'Milk Tea', description: 'Creamy milk tea', price: 100, category: 'tea', imageUrl: '🥛', isVegetarian: true },
    { id: 't3', name: 'Samosa (2pcs)', description: '2 vegetable samosas', price: 120, category: 'tea', imageUrl: '🥟', isVegetarian: true },
    { id: 't4', name: 'Fish Patty', description: 'Fish patty with tea', price: 150, category: 'tea', imageUrl: '🥧', isVegetarian: false },
    { id: 't5', name: 'Chicken Roll', description: 'Chicken roll with sauce', price: 180, category: 'tea', imageUrl: '🌯', isVegetarian: false },
  ],
};

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [studentDetails] = useState({
    regNumber: storedUser.studentId || storedUser.regNumber || 'STU001',
    name: storedUser.name || 'Student',
    hostelRoom: storedUser.hostelRoom || storedUser.address || 'N/A',
    email: storedUser.email || '',
    phone: storedUser.contactNumber || storedUser.studentPhone || '',
    faculty: storedUser.faculty || 'N/A',
    year: storedUser.year || 'N/A'
  });

  const [backendStatus, setBackendStatus] = useState('Checking backend...');
  const [mealTime, setMealTime] = useState('breakfast');
  const [menu, setMenu] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuError, setMenuError] = useState('');
  const [cart, setCart] = useState([]);

  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVegetarian, setFilterVegetarian] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [foodView, setFoodView] = useState('menu');
  const [orderHistory, setOrderHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const MEAL_LABELS = { breakfast: '🌅 Breakfast', lunch: '☀️ Lunch', dinner: '🌙 Dinner', tea: '🍵 Tea' };

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    fetch('http://localhost:5000/api/food/health')
      .then(async (res) => {
        if (!res.ok) throw new Error('Backend error');
        const data = await res.json();
        setBackendStatus(`✅ Connected to Hostel Management System`);
      })
      .catch(() => {
        setBackendStatus('⚠️ Running in demo mode');
        setMenu(SAMPLE_MENU.breakfast);
      });
  }, []);

  useEffect(() => {
    setMenuLoading(true);
    setMenuError('');
    
    if (backendStatus.includes('Connected')) {
      fetch(`http://localhost:5000/api/food/menu?mealTime=${mealTime}`)
        .then(async (res) => {
          if (!res.ok) throw new Error('Menu load failed');
          const data = await res.json();
          setMenu(data);
        })
        .catch(() => {
          setMenuError('Failed to load menu. Using sample data.');
          setMenu(SAMPLE_MENU[mealTime] || []);
        })
        .finally(() => {
          setMenuLoading(false);
        });
    } else {
      setTimeout(() => {
        setMenu(SAMPLE_MENU[mealTime] || []);
        setMenuLoading(false);
      }, 500);
    }
  }, [mealTime, backendStatus]);

  useEffect(() => {
    if (foodView === 'history' && token) {
      setHistoryLoading(true);
      fetch('http://localhost:5000/api/food/orders/my', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setOrderHistory(Array.isArray(data) ? data : []))
        .catch(() => setOrderHistory([]))
        .finally(() => setHistoryLoading(false));
    }
  }, [foodView, token]);

  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesVeg = filterVegetarian ? item.isVegetarian : true;
      return matchesSearch && matchesVeg;
    });
  }, [menu, searchTerm, filterVegetarian]);

  const totalAmount = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const getItemKey = (item) => item._id || item.id;
  const addToCart = (food) => {
    setCart((prev) => {
      const key = getItemKey(food);
      const existing = prev.find((i) => getItemKey(i) === key);
      if (existing) {
        return prev.map((i) =>
          getItemKey(i) === key ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...food, quantity: 1 }];
    });
  };

  const updateQuantity = (itemKey, quantity) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => getItemKey(i) !== itemKey));
    } else {
      setCart((prev) =>
        prev.map((i) => (getItemKey(i) === itemKey ? { ...i, quantity } : i))
      );
    }
  };

  const handleProceedToConfirmation = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setOrderMessage('Please add items to your cart');
      return;
    }
    setConfirmError('');
    setOrderMessage('');
    setShowConfirmation(true);
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const isValidMongoId = (id) => /^[a-f0-9]{24}$/i.test(String(id || ''));
  const cartHasRealIds = cart.every((c) => isValidMongoId(c._id || c.id));

  const handleConfirmOrder = async () => {
    setOrderSubmitting(true);
    setConfirmError('');
    
    try {
      const body = {
        regNumber: studentDetails.regNumber,
        name: studentDetails.name,
        hostelRoom: studentDetails.hostelRoom,
        mealTime,
        items: cart.map((c) => ({
          foodItemId: c._id || c.id,
          quantity: c.quantity,
        })),
      };

      if (backendStatus.includes('Connected') && cartHasRealIds) {
        const res = await fetch('http://localhost:5000/api/food/order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(body),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data.message || 'Failed to place order');
        }

        setCurrentOrder(data.order);
        setShowConfirmation(false);
        setShowPayment(true);
      } else {
        const demoOrder = {
          _id: 'demo_' + Date.now(),
          ...body,
          totalAmount,
        };
        setCurrentOrder(demoOrder);
        setShowConfirmation(false);
        setShowPayment(true);
      }
    } catch (err) {
      setConfirmError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setOrderSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setCart([]);
    setOrderDetails({
      id: currentOrder._id,
      regNumber: studentDetails.regNumber,
      name: studentDetails.name,
      hostelRoom: studentDetails.hostelRoom,
      mealTime,
      totalAmount,
      orderDate: new Date().toLocaleString(),
      estimatedTime: '20-30 minutes'
    });
  };

  const handlePaymentClose = () => {
    setShowPayment(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <Elements stripe={stripePromise}>
      <div
        className="min-h-screen flex font-sans p-4 sm:p-6 lg:p-8 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: "linear-gradient(to bottom right, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9)), url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000&auto=format&fit=crop')" }}
      >
        <div className="bg-slate-50 w-full max-w-[1400px] mx-auto rounded-3xl overflow-hidden shadow-2xl flex relative">
          {/* Top Header Bar */}
          <div className="absolute top-0 left-0 right-0 h-[70px] bg-[#FEF08A] text-slate-800 flex justify-between items-center px-8 z-20 rounded-t-3xl border-b border-yellow-300">
            <div className="font-black text-4xl tracking-tight flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/student-dashboard')}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12l10 10 10-10L12 2zm0 14a4 4 0 110-8 4 4 0 010 8z" /></svg>
              <span><span className="text-slate-700">Stay</span><span className="text-[#4BB580]">Sphere</span></span>
            </div>
            <div className="flex items-center space-x-6 text-sm font-bold">
              <span>
                Welcome, {studentDetails.name} (Student ID: {studentDetails.regNumber})
              </span>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-64 bg-white border-r border-slate-100 flex flex-col pt-24 pb-6 px-6 relative z-10 hidden md:flex">
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between px-4 py-3 bg-teal-50 text-black rounded-lg cursor-pointer font-bold mb-4">
                <span>Food Order</span>
                <span className="text-xs text-slate-500 font-bold">Menu</span>
              </div>
              <div onClick={() => navigate('/student-dashboard')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </div>
              <div onClick={() => navigate('/student-profile')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
                <User size={20} />
                <span>Profile</span>
              </div>
              <div onClick={() => navigate('/student-attendance')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
                <Calendar size={20} />
                <span>Attendance</span>
              </div>
              <div onClick={() => navigate('/student-rooms')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
                <Home size={20} />
                <span>Room Details</span>
              </div>
              <div onClick={() => navigate('/student-complaints')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
                <MessageSquare size={20} />
                <span>Complaints</span>
              </div>
              <div onClick={() => navigate('/student-payments')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
                <CreditCard size={20} />
                <span>Payments</span>
              </div>
              <div onClick={() => navigate('/student-notices')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
                <Bell size={20} />
                <span>Notices</span>
              </div>
                            <div className="flex items-center space-x-3 px-4 py-3 bg-teal-50 text-teal-700 font-bold rounded-lg cursor-pointer transition-colors">
                <UtensilsCrossed size={20} />
                <span>Food Order</span>
              </div>
            </div>
            <div className="mt-8">
              <div onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors font-medium">
                <LogOut size={20} />
                <span>Logout</span>
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="flex-1 pt-24 px-8 pb-8 overflow-y-auto min-w-0">
            <h1 className="text-5xl font-bold font-outfit text-[#5D4037] mb-8">
              Food Order <span className="text-emerald-700">Menu</span>
            </h1>
          {/* View Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFoodView('menu')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${foodView === 'menu' ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50'}`}
            >
              <UtensilsCrossed size={20} />
              Order Menu
            </button>
            <button
              onClick={() => setFoodView('history')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${foodView === 'history' ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50'}`}
            >
              <History size={20} />
              Order History
            </button>
          </div>

          {foodView === 'history' ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <h2 className="text-lg font-bold text-slate-800 p-4 border-b border-slate-100">My Order History</h2>
              {historyLoading ? (
                <div className="p-12 text-center">
                  <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto" />
                  <p className="mt-3 text-slate-600">Loading orders...</p>
                </div>
              ) : orderHistory.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <History size={48} className="mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No orders yet</p>
                  <p className="text-sm">Your food orders will appear here</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
                        <th className="p-4 font-semibold">Order ID</th>
                        <th className="p-4 font-semibold">Meal</th>
                        <th className="p-4 font-semibold">Items</th>
                        <th className="p-4 font-semibold">Amount</th>
                        <th className="p-4 font-semibold">Payment</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderHistory.map((o) => (
                        <tr key={o._id} className="border-t border-slate-100 hover:bg-slate-50">
                          <td className="p-4 font-mono text-sm">#{o._id?.slice(-8)}</td>
                          <td className="p-4">{MEAL_LABELS[o.mealTime] || o.mealTime}</td>
                          <td className="p-4 text-sm">
                            {o.items?.map((i, idx) => (
                              <div key={idx}>{i.foodItem?.name || 'Item'} x{i.quantity}</div>
                            ))}
                          </td>
                          <td className="p-4 font-semibold">Rs. {o.totalAmount}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${o.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {o.paymentStatus === 'paid' ? 'Paid ✓' : 'Unpaid'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              o.status === 'served' ? 'bg-emerald-100 text-emerald-700' :
                              o.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              o.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-slate-600">
                            {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
          <>
          {/* Meal Selector */}
          <div className="flex flex-wrap gap-3 mb-6">
            {MEAL_TIMES.map((m) => (
              <button
                key={m.id}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl font-medium transition-all ${m.id === mealTime
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-200'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50'}`}
                onClick={() => setMealTime(m.id)}
              >
                <span className="text-2xl">{m.icon}</span>
                <div className="text-left">
                  <span className="block font-semibold">{m.label}</span>
                  <span className="text-xs opacity-80">{m.time}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
            {/* Menu Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-800 font-outfit">Today's Menu — {MEAL_TIMES.find(m => m.id === mealTime)?.label}</h2>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-slate-200 rounded-lg focus:border-emerald-500 outline-none w-full sm:w-48"
                  />
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-600">
                    <input
                      type="checkbox"
                      checked={filterVegetarian}
                      onChange={(e) => setFilterVegetarian(e.target.checked)}
                      className="rounded text-emerald-500"
                    />
                    <span>🌱 Vegetarian</span>
                  </label>
                </div>
              </div>

              {menuLoading && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
                  <p className="mt-4 text-slate-600">Loading menu...</p>
                </div>
              )}

              {menuError && <p className="text-amber-600 text-center py-2">{menuError}</p>}

              {!menuLoading && !menuError && filteredMenu.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
                  <span className="text-6xl block mb-4">🍽️</span>
                  <p className="text-slate-700 font-medium">No items found</p>
                  <span className="text-slate-500 text-sm">Try adjusting your filters</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {!menuLoading && filteredMenu.map((item) => (
                  <div key={item.id || item._id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    <div className="relative h-40 bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center overflow-hidden">
                      <FoodImage imageUrl={item.imageUrl} />
                      {item.isVegetarian && (
                        <span className="absolute top-2 right-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">🌱 Veg</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-slate-800 text-lg mb-1">{item.name}</h3>
                      <p className="text-slate-500 text-sm mb-4 line-clamp-2">{item.description || 'Delicious meal'}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-600">Rs. {item.price}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Section */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-fit sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-800 font-outfit">Your Order</h2>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-sm font-semibold rounded-full">{totalItems} items</span>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-5xl block mb-3">🛒</span>
                  <p className="text-slate-500 font-medium">Your cart is empty</p>
                  <small className="text-slate-400 text-sm">Add items from the menu</small>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={getItemKey(item)} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                        <div>
                          <span className="font-medium text-slate-800">{item.name}</span>
                          <span className="block text-sm text-slate-500">Rs. {item.price} each</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(getItemKey(item), parseInt(e.target.value) || 1)}
                            className="w-14 py-1 px-2 border border-slate-200 rounded text-center text-sm"
                          />
                          <button
                            onClick={() => updateQuantity(getItemKey(item), 0)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-2 pt-4 border-t border-slate-100">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span>Rs. {totalAmount}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-800 text-lg">
                      <span>Total</span>
                      <span className="text-emerald-600">Rs. {totalAmount}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleProceedToConfirmation}
                    className="w-full mt-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors"
                  >
                    Proceed to Payment
                  </button>
                </>
              )}
            </div>
          </div>
          </>
          )}

          {/* Order Message */}
          {orderMessage && (
            <div className={`order-message ${orderMessage.includes('❌') ? 'error' : 'success'}`}>
              {orderMessage}
            </div>
          )}
          </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">📝 Confirm Your Order</h2>
              </div>
              
              <div className="p-6 space-y-6">
                {confirmError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                    ❌ {confirmError}
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Student Details</h3>
                  <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                    <p className="text-slate-700"><span className="font-semibold text-slate-600">Name:</span> {studentDetails.name}</p>
                    <p className="text-slate-700"><span className="font-semibold text-slate-600">Reg Number:</span> {studentDetails.regNumber}</p>
                    <p className="text-slate-700"><span className="font-semibold text-slate-600">Room:</span> {studentDetails.hostelRoom}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Order Summary</h3>
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <p className="text-slate-700"><span className="font-semibold text-slate-600">Meal Time:</span> {MEAL_TIMES.find(m => m.id === mealTime)?.label}</p>
                    <div className="border-t border-slate-200 pt-3 space-y-2">
                      {cart.map(item => (
                        <div key={getItemKey(item)} className="flex justify-between text-slate-700">
                          <span>{item.name} x{item.quantity}</span>
                          <span className="font-medium">Rs. {item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t-2 border-emerald-200 font-bold text-slate-800">
                      <span>Total Amount</span>
                      <span className="text-emerald-600 text-lg">Rs. {totalAmount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={handleCancelConfirmation}
                    type="button"
                    className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleConfirmOrder}
                    type="button"
                    disabled={orderSubmitting}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {orderSubmitting ? 'Processing...' : 'Proceed to Payment'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPayment && currentOrder && (
          <PaymentForm
            orderId={currentOrder._id}
            totalAmount={totalAmount}
            onPaymentSuccess={handlePaymentSuccess}
            onClose={handlePaymentClose}
          />
        )}

        {/* Order Success Modal */}
        {orderDetails && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-8 text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center text-4xl backdrop-blur-sm">
                  ✓
                </div>
                <h2 className="text-2xl font-bold text-white">Payment Successful!</h2>
                <p className="text-emerald-100 text-sm mt-1">Your order has been confirmed</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 space-y-2.5 text-slate-700">
                  <div className="flex justify-between"><span className="font-semibold text-slate-600">Order ID</span><span className="font-mono text-sm">#{String(orderDetails.id).slice(-8)}</span></div>
                  <div className="flex justify-between"><span className="font-semibold text-slate-600">Student</span><span>{orderDetails.name}</span></div>
                  <div className="flex justify-between"><span className="font-semibold text-slate-600">Room</span><span>{orderDetails.hostelRoom}</span></div>
                  <div className="flex justify-between"><span className="font-semibold text-slate-600">Meal Time</span><span>{MEAL_TIMES.find(m => m.id === orderDetails.mealTime)?.label}</span></div>
                  <div className="flex justify-between pt-2 border-t border-slate-200"><span className="font-semibold text-slate-600">Total Amount</span><span className="font-bold text-emerald-600">Rs. {orderDetails.totalAmount}</span></div>
                  <div className="flex justify-between"><span className="font-semibold text-slate-600">Order Time</span><span className="text-sm">{orderDetails.orderDate}</span></div>
                  <div className="flex justify-between"><span className="font-semibold text-slate-600">Estimated Ready</span><span>{orderDetails.estimatedTime}</span></div>
                  <div className="flex justify-between pt-2 border-t border-slate-200">
                    <span className="font-semibold text-slate-600">Payment Status</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 font-semibold rounded-full text-sm">Paid ✓</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <span className="text-2xl">🍽️</span>
                  <p className="text-sm text-amber-800 font-medium">Show this confirmation at the counter to collect your food</p>
                </div>

                <button 
                  onClick={() => setOrderDetails(null)}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-200 transition-all mt-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </Elements>
  );
}

export default App;