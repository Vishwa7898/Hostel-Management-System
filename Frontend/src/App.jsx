import { useEffect, useMemo, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './components/PaymentForm';

// Initialize Stripe
const stripePromise = loadStripe('pk_test_your_stripe_publishable_key');

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
  const [backendStatus, setBackendStatus] = useState('Checking backend...');
  const [mealTime, setMealTime] = useState('breakfast');
  const [menu, setMenu] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuError, setMenuError] = useState('');
  const [cart, setCart] = useState([]);
  
  const [studentDetails] = useState({
    regNumber: 'IT20201234',
    name: 'Kamal Perera',
    hostelRoom: 'B-204',
    email: 'kamal.p@university.lk',
    phone: '0771234567',
    faculty: 'Information Technology',
    year: '3rd Year'
  });

  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVegetarian, setFilterVegetarian] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Check backend health
  useEffect(() => {
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

  // Load menu for selected meal time
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

  const addToCart = (food) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === food.id);
      if (existing) {
        return prev.map((i) =>
          i.id === food.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...food, quantity: 1 }];
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== id));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity } : i))
      );
    }
  };

  const handleProceedToConfirmation = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setOrderMessage('Please add items to your cart');
      return;
    }
    setShowConfirmation(true);
    setOrderMessage('');
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleConfirmOrder = async () => {
    setOrderSubmitting(true);
    
    try {
      const body = {
        regNumber: studentDetails.regNumber,
        name: studentDetails.name,
        hostelRoom: studentDetails.hostelRoom,
        mealTime,
        items: cart.map((c) => ({
          foodItemId: c.id,
          quantity: c.quantity,
        })),
      };

      if (backendStatus.includes('Connected')) {
        const res = await fetch('http://localhost:5000/api/food/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Failed to place order');
        }

        const data = await res.json();
        setCurrentOrder(data.order);
        setShowConfirmation(false);
        setShowPayment(true);
      } else {
        const demoOrder = {
          _id: 'ORD' + Math.floor(Math.random() * 10000),
          ...body,
          totalAmount,
        };
        setCurrentOrder(demoOrder);
        setShowConfirmation(false);
        setShowPayment(true);
      }
    } catch (err) {
      setOrderMessage(`❌ ${err.message}`);
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

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white py-4 sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold">🏛️ University Hostel</h1>
              <p className="text-sm opacity-90">Food Ordering System</p>
            </div>
            <div className="flex items-center gap-4 bg-white/20 px-4 sm:px-6 py-2 rounded-full backdrop-blur">
              <span className="text-2xl sm:text-3xl">👨‍🎓</span>
              <div className="flex flex-col">
                <span className="font-semibold text-sm sm:text-base">{studentDetails.name}</span>
                <span className="text-xs opacity-90">{studentDetails.regNumber}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Status Bar */}
          <div className={`bg-white p-4 rounded-xl mb-8 flex items-center gap-4 shadow-md border-l-4 ${
            backendStatus.includes('demo') ? 'border-yellow-400' : 'border-green-500'
          }`}>
            <span className="text-xl">{backendStatus.includes('Connected') ? '🟢' : '🟡'}</span>
            <span className="text-sm sm:text-base">{backendStatus}</span>
          </div>

          {/* Student Card */}
          <div className="bg-white rounded-2xl p-6 mb-8 shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">📋 Student Information</h2>
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">Auto-filled</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 uppercase tracking-wider">Registration Number</label>
                <p className="text-base font-medium text-gray-800">{studentDetails.regNumber}</p>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 uppercase tracking-wider">Full Name</label>
                <p className="text-base font-medium text-gray-800">{studentDetails.name}</p>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 uppercase tracking-wider">Hostel Room</label>
                <p className="text-base font-medium text-gray-800">{studentDetails.hostelRoom}</p>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 uppercase tracking-wider">Faculty</label>
                <p className="text-base font-medium text-gray-800">{studentDetails.faculty}</p>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 uppercase tracking-wider">Email</label>
                <p className="text-base font-medium text-gray-800">{studentDetails.email}</p>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 uppercase tracking-wider">Phone</label>
                <p className="text-base font-medium text-gray-800">{studentDetails.phone}</p>
              </div>
            </div>
          </div>

          {/* Meal Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {MEAL_TIMES.map((m) => (
              <button
                key={m.id}
                className={`bg-white border-2 p-4 rounded-xl cursor-pointer flex flex-col items-center gap-1 transition-all duration-300 shadow-md hover:-translate-y-1 hover:shadow-lg ${
                  m.id === mealTime 
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50' 
                    : 'border-transparent'
                }`}
                onClick={() => setMealTime(m.id)}
              >
                <span className="text-3xl">{m.icon}</span>
                <span className="font-semibold text-gray-800">{m.label}</span>
                <span className="text-xs text-gray-500">{m.time}</span>
              </button>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
            {/* Menu Section */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  🍽️ Today's Menu - {MEAL_TIMES.find(m => m.id === mealTime)?.label}
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="🔍 Search items..."
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-full sm:w-48"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filterVegetarian}
                      onChange={(e) => setFilterVegetarian(e.target.checked)}
                      className="rounded text-blue-500"
                    />
                    <span>🌱 Vegetarian only</span>
                  </label>
                </div>
              </div>

              {menuLoading && (
                <div className="text-center py-12">
                  <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading delicious food...</p>
                </div>
              )}

              {menuError && <p className="text-red-500 text-center">{menuError}</p>}

              {!menuLoading && !menuError && filteredMenu.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-800 text-lg mb-2">🍽️ No items found</p>
                  <span className="text-gray-500 text-sm">Try adjusting your filters</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMenu.map((item) => (
                  <div key={item.id || item._id} className="bg-gray-50 rounded-xl overflow-hidden transition-all duration-300 border border-gray-200 hover:-translate-y-1 hover:shadow-lg">
                    <div className="h-32 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative">
                      <span className="text-4xl">{item.imageUrl}</span>
                      {item.isVegetarian && (
                        <span className="absolute top-2 right-2 bg-green-500 text-white px-1.5 py-0.5 rounded text-xs" title="Vegetarian">🌱</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-semibold mb-1 text-gray-800">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2 leading-relaxed">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-orange-500 text-lg">Rs. {item.price}</span>
                        <button 
                          className="bg-blue-500 text-white border-none px-4 py-1.5 rounded-md text-sm cursor-pointer transition-all duration-300 hover:bg-blue-600 hover:scale-105"
                          onClick={() => addToCart(item)}
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
            <div className="bg-white rounded-2xl p-6 shadow-md sticky top-24 h-fit">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">🛒 Your Order</h2>
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">{totalItems} items</span>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-5xl block mb-4 opacity-50">🛍️</span>
                  <p className="text-gray-500 mb-2">Your cart is empty</p>
                  <small className="text-gray-400">Add items from the menu</small>
                </div>
              ) : (
                <>
                  <div className="max-h-96 overflow-y-auto mb-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-200">
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{item.name}</span>
                          <span className="text-xs text-gray-500">Rs. {item.price}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 p-1.5 border border-gray-200 rounded text-center text-sm"
                          />
                          <button
                            className="bg-transparent border-none text-red-500 text-base cursor-pointer px-2 py-1 rounded hover:bg-red-500 hover:text-white transition-colors"
                            onClick={() => updateQuantity(item.id, 0)}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl my-4">
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Subtotal:</span>
                      <span>Rs. {totalAmount}</span>
                    </div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Service Fee:</span>
                      <span>Rs. 0</span>
                    </div>
                    <div className="flex justify-between mt-2 pt-2 border-t-2 border-dashed border-gray-200 font-semibold text-lg">
                      <span>Total:</span>
                      <span>Rs. {totalAmount}</span>
                    </div>
                  </div>

                  <button 
                    className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-none py-4 rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-200"
                    onClick={handleProceedToConfirmation}
                  >
                    Proceed to Payment
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Order Message */}
          {orderMessage && (
            <div className={`fixed bottom-8 right-8 px-8 py-4 rounded-xl bg-white shadow-lg z-50 animate-[slideIn_0.3s_ease-out] ${
              orderMessage.includes('❌') ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'
            }`}>
              {orderMessage}
            </div>
          )}
        </main>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-[90%] max-h-[90vh] overflow-y-auto shadow-2xl">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">📝 Confirm Your Order</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-sm text-blue-500 font-medium mb-4">Student Details</h3>
                  <p className="mb-2"><strong>Name:</strong> {studentDetails.name}</p>
                  <p className="mb-2"><strong>Reg Number:</strong> {studentDetails.regNumber}</p>
                  <p><strong>Room:</strong> {studentDetails.hostelRoom}</p>
                </div>

                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-sm text-blue-500 font-medium mb-4">Order Summary</h3>
                  <p className="mb-2"><strong>Meal Time:</strong> {MEAL_TIMES.find(m => m.id === mealTime)?.label}</p>
                  <div className="max-h-48 overflow-y-auto my-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between py-2 border-b border-dashed border-gray-200">
                        <span>{item.name} x{item.quantity}</span>
                        <span>Rs. {item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 pt-4 border-t-2 border-gray-200">
                    <strong>Total Amount:</strong>
                    <strong className="text-orange-500">Rs. {totalAmount}</strong>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button 
                    className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-300 hover:bg-gray-200"
                    onClick={handleCancelConfirmation}
                  >
                    Cancel
                  </button>
                  <button 
                    className="flex-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white py-3 rounded-lg font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleConfirmOrder}
                    disabled={orderSubmitting}
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-[90%] text-center shadow-2xl">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Payment Successful!</h2>
              
              <div className="bg-gray-50 p-6 rounded-xl my-6 text-left">
                <p className="mb-2"><strong>Order ID:</strong> #{orderDetails.id}</p>
                <p className="mb-2"><strong>Student:</strong> {orderDetails.name}</p>
                <p className="mb-2"><strong>Room:</strong> {orderDetails.hostelRoom}</p>
                <p className="mb-2"><strong>Meal Time:</strong> {MEAL_TIMES.find(m => m.id === orderDetails.mealTime)?.label}</p>
                <p className="mb-2"><strong>Total Amount:</strong> Rs. {orderDetails.totalAmount}</p>
                <p className="mb-2"><strong>Order Time:</strong> {orderDetails.orderDate}</p>
                <p className="mb-2"><strong>Estimated Ready:</strong> {orderDetails.estimatedTime}</p>
                <p><strong>Payment Status:</strong> <span className="text-green-600">Paid ✓</span></p>
              </div>

              <div className="bg-orange-50 text-orange-500 p-4 rounded-lg my-4 font-medium">
                <p>🍽️ Show this confirmation at the counter to collect your food</p>
              </div>

              <button 
                className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white py-3 rounded-lg font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                onClick={() => setOrderDetails(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Elements>
  );
}

export default App;