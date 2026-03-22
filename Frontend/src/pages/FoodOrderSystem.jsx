import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../components/PaymentForm';
import '../index.css';

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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVegetarian, setFilterVegetarian] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

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
          foodItemId: c._id || c.id,
          quantity: c.quantity,
        })),
      };

      if (backendStatus.includes('Connected')) {
        const res = await fetch('http://localhost:5000/api/food/order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
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
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 sticky top-0 z-50 shadow-lg">
          <div className="container-custom flex flex-col sm:flex-row justify-between items-center gap-4">
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

        <main className="container-custom py-8">
          {/* Status Bar */}
          <div className={`status-bar ${backendStatus.includes('demo') ? 'demo' : 'success'}`}>
            <span className="text-xl">{backendStatus.includes('Connected') ? '🟢' : '🟡'}</span>
            <span className="text-sm sm:text-base">{backendStatus}</span>
          </div>

          {/* Student Card */}
          <div className="student-card">
            <div className="student-card-header">
              <h2>📋 Student Information</h2>
              <span className="badge">Auto-filled</span>
            </div>
            <div className="student-details-grid">
              <div className="detail-item">
                <label>Registration Number</label>
                <p>{studentDetails.regNumber}</p>
              </div>
              <div className="detail-item">
                <label>Full Name</label>
                <p>{studentDetails.name}</p>
              </div>
              <div className="detail-item">
                <label>Hostel Room</label>
                <p>{studentDetails.hostelRoom}</p>
              </div>
              <div className="detail-item">
                <label>Faculty</label>
                <p>{studentDetails.faculty}</p>
              </div>
              <div className="detail-item">
                <label>Email</label>
                <p>{studentDetails.email}</p>
              </div>
              <div className="detail-item">
                <label>Phone</label>
                <p>{studentDetails.phone}</p>
              </div>
            </div>
          </div>

          {/* Meal Selector */}
          <div className="meal-selector">
            {MEAL_TIMES.map((m) => (
              <button
                key={m.id}
                className={`meal-chip ${m.id === mealTime ? 'active' : ''}`}
                onClick={() => setMealTime(m.id)}
              >
                <span className="meal-icon">{m.icon}</span>
                <span className="meal-label">{m.label}</span>
                <span className="meal-time">{m.time}</span>
              </button>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
            {/* Menu Section */}
            <div className="menu-section">
              <div className="menu-header">
                <h2>🍽️ Today's Menu - {MEAL_TIMES.find(m => m.id === mealTime)?.label}</h2>
                <div className="menu-filters">
                  <input
                    type="text"
                    placeholder="🔍 Search items..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <label className="veg-filter">
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
                <div className="loading">
                  <div className="loader"></div>
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

              <div className="menu-grid">
                {filteredMenu.map((item) => (
                  <div key={item.id || item._id} className="food-card">
                    <div className="food-image">
                      <span className="food-emoji">{item.imageUrl}</span>
                      {item.isVegetarian && (
                        <span className="veg-badge" title="Vegetarian">🌱</span>
                      )}
                    </div>
                    <div className="food-details">
                      <h3>{item.name}</h3>
                      <p className="food-description">{item.description}</p>
                      <div className="food-footer">
                        <span className="food-price">Rs. {item.price}</span>
                        <button 
                          className="add-btn"
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
            <div className="cart-section">
              <div className="cart-header">
                <h2>🛒 Your Order</h2>
                <span className="cart-count">{totalItems} items</span>
              </div>

              {cart.length === 0 ? (
                <div className="empty-cart">
                  <span className="empty-cart-icon">🛍️</span>
                  <p className="text-gray-500 mb-2">Your cart is empty</p>
                  <small className="text-gray-400">Add items from the menu</small>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map((item) => (
                      <div key={getItemKey(item)} className="cart-item">
                        <div className="cart-item-info">
                          <span className="cart-item-name">{item.name}</span>
                          <span className="cart-item-price">Rs. {item.price}</span>
                        </div>
                        <div className="cart-item-controls">
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(getItemKey(item), parseInt(e.target.value) || 1)}
                            className="quantity-input"
                          />
                          <button
                            className="remove-btn"
                            onClick={() => updateQuantity(getItemKey(item), 0)}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="cart-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>Rs. {totalAmount}</span>
                    </div>
                    <div className="summary-row">
                      <span>Service Fee:</span>
                      <span>Rs. 0</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>Rs. {totalAmount}</span>
                    </div>
                  </div>

                  <button 
                    className="checkout-btn"
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
            <div className={`order-message ${orderMessage.includes('❌') ? 'error' : 'success'}`}>
              {orderMessage}
            </div>
          )}
        </main>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>📝 Confirm Your Order</h2>
              
              <div className="space-y-6">
                <div className="confirm-section">
                  <h3>Student Details</h3>
                  <p><strong>Name:</strong> {studentDetails.name}</p>
                  <p><strong>Reg Number:</strong> {studentDetails.regNumber}</p>
                  <p><strong>Room:</strong> {studentDetails.hostelRoom}</p>
                </div>

                <div className="confirm-section">
                  <h3>Order Summary</h3>
                  <p><strong>Meal Time:</strong> {MEAL_TIMES.find(m => m.id === mealTime)?.label}</p>
                  <div className="confirm-items">
                    {cart.map(item => (
                      <div key={getItemKey(item)} className="confirm-item">
                        <span>{item.name} x{item.quantity}</span>
                        <span>Rs. {item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="confirm-total">
                    <strong>Total Amount:</strong>
                    <strong className="text-orange-500">Rs. {totalAmount}</strong>
                  </div>
                </div>

                <div className="confirm-actions">
                  <button 
                    className="btn-secondary"
                    onClick={handleCancelConfirmation}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn-primary"
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
          <div className="modal-overlay">
            <div className="modal success-modal">
              <div className="success-icon">✅</div>
              <h2>Payment Successful!</h2>
              
              <div className="order-details">
                <p><strong>Order ID:</strong> #{orderDetails.id}</p>
                <p><strong>Student:</strong> {orderDetails.name}</p>
                <p><strong>Room:</strong> {orderDetails.hostelRoom}</p>
                <p><strong>Meal Time:</strong> {MEAL_TIMES.find(m => m.id === orderDetails.mealTime)?.label}</p>
                <p><strong>Total Amount:</strong> Rs. {orderDetails.totalAmount}</p>
                <p><strong>Order Time:</strong> {orderDetails.orderDate}</p>
                <p><strong>Estimated Ready:</strong> {orderDetails.estimatedTime}</p>
                <p><strong>Payment Status:</strong> <span className="text-green-600">Paid ✓</span></p>
              </div>

              <div className="payment-note">
                <p>🍽️ Show this confirmation at the counter to collect your food</p>
              </div>

              <button 
                className="btn-primary w-full"
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