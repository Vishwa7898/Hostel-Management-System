<<<<<<< Updated upstream
import { useEffect, useMemo, useState } from 'react'
import './App.css'
=======
import { useEffect, useMemo, useState } from 'react';
import PaymentForm from './components/PaymentForm';
import './App.css';
>>>>>>> Stashed changes

const MEAL_TIMES = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
]

function App() {
<<<<<<< Updated upstream
  const [backendStatus, setBackendStatus] = useState('Checking backend...')
  const [mealTime, setMealTime] = useState('breakfast')
  const [menu, setMenu] = useState([])
  const [menuLoading, setMenuLoading] = useState(false)
  const [menuError, setMenuError] = useState('')
=======
  const [backendStatus, setBackendStatus] = useState('Checking backend...');
  const [mealTime, setMealTime] = useState('breakfast');
  const [menu, setMenu] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuError, setMenuError] = useState('');
  const [cart, setCart] = useState([]);
  
  // Student details - In real app, these come from auth/login
  const [studentDetails] = useState({
    regNumber: 'IT20201234',
    name: 'Kamal Perera',
    hostelRoom: 'B-204',
    email: 'kamal.p@university.lk',
    phone: '0771234567',
    faculty: 'Information Technology',
    year: '3rd Year'
  });
>>>>>>> Stashed changes

  const [cart, setCart] = useState([])
  const [regNumber, setRegNumber] = useState('')
  const [name, setName] = useState('')
  const [hostelRoom, setHostelRoom] = useState('')
  const [orderSubmitting, setOrderSubmitting] = useState(false)
  const [orderMessage, setOrderMessage] = useState('')

<<<<<<< Updated upstream
  // Check backend health once
=======
  // Payment related states
  const [showPayment, setShowPayment] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Check backend health
>>>>>>> Stashed changes
  useEffect(() => {
    fetch('http://localhost:5000/api/food/health')
      .then(async (res) => {
        if (!res.ok) throw new Error('Backend error')
        const data = await res.json()
        setBackendStatus(`✅ ${data.message}`)
      })
      .catch(() => {
        setBackendStatus('❌ Backend not reachable')
      })
  }, [])

  // Load menu for selected meal time
  useEffect(() => {
    setMenuLoading(true)
    setMenuError('')
    fetch(`http://localhost:5000/api/food/menu?mealTime=${mealTime}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Menu load failed')
        const data = await res.json()
        setMenu(data)
      })
      .catch(() => {
        setMenuError('Failed to load menu. Please try again.')
      })
      .finally(() => {
        setMenuLoading(false)
      })
  }, [mealTime])

  const totalAmount = useMemo(
    () =>
      cart.reduce((sum, item) => {
        return sum + item.price * item.quantity
      }, 0),
    [cart]
  )

  const addToCart = (food) => {
    setCart((prev) => {
<<<<<<< Updated upstream
      const existing = prev.find((i) => i._id === food._id)
      if (existing) {
        return prev.map((i) =>
          i._id === food._id ? { ...i, quantity: i.quantity + 1 } : i
        )
=======
      const existing = prev.find((i) => i.id === food.id);
      if (existing) {
        return prev.map((i) =>
          i.id === food.id ? { ...i, quantity: i.quantity + 1 } : i
        );
>>>>>>> Stashed changes
      }
      return [...prev, { ...food, quantity: 1 }]
    })
  }

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
<<<<<<< Updated upstream
      setCart((prev) => prev.filter((i) => i._id !== id))
    } else {
      setCart((prev) =>
        prev.map((i) => (i._id === id ? { ...i, quantity } : i))
      )
=======
      setCart((prev) => prev.filter((i) => i.id !== id));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity } : i))
      );
>>>>>>> Stashed changes
    }
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault()
    setOrderMessage('')

    if (!regNumber || !name || !hostelRoom) {
      setOrderMessage('Please fill student details.')
      return
    }
    if (cart.length === 0) {
      setOrderMessage('Your cart is empty.')
      return
    }

<<<<<<< Updated upstream
=======
  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleConfirmOrder = async () => {
    setOrderSubmitting(true);
    
>>>>>>> Stashed changes
    try {
      setOrderSubmitting(true)
      const body = {
        regNumber,
        name,
        hostelRoom,
        mealTime,
        items: cart.map((c) => ({
          foodItemId: c.id,
          quantity: c.quantity,
        })),
<<<<<<< Updated upstream
      }

      const res = await fetch('http://localhost:5000/api/food/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Failed to place order')
      }

      const data = await res.json()
      setOrderMessage(`Order placed successfully. Order ID: ${data.order._id}`)
      setCart([])
    } catch (err) {
      setOrderMessage(err.message)
    } finally {
      setOrderSubmitting(false)
    }
  }
=======
      };

      // If backend is reachable
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
        setShowPayment(true); // Show payment modal after order creation
      } else {
        // Demo mode - create fake order and show payment
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
>>>>>>> Stashed changes

  return (
    <div className="page">
      <header className="header">
        <h1>Hostel Management – Food Ordering</h1>
        <p>Student breakfast / lunch / dinner ordering</p>
      </header>

      <section className="card status-card">
        <h2>Backend Status</h2>
        <p>{backendStatus}</p>
      </section>

      <div className="layout">
        <section className="card">
          <div className="section-header">
            <h2>Menu</h2>
            <div className="meal-switcher">
              {MEAL_TIMES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={m.id === mealTime ? 'chip active' : 'chip'}
                  onClick={() => setMealTime(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {menuLoading && <p>Loading menu...</p>}
          {menuError && <p className="error">{menuError}</p>}

          {!menuLoading && !menuError && menu.length === 0 && (
            <p>No items for this meal time.</p>
          )}

          <div className="menu-grid">
            {menu.map((item) => (
              <div key={item._id} className="menu-item">
                <h3>{item.name}</h3>
                {item.description && (
                  <p className="menu-desc">{item.description}</p>
                )}
                <p className="menu-price">Rs. {item.price.toFixed(2)}</p>
                <button type="button" onClick={() => addToCart(item)}>
                  Add to cart
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h2>Student Details & Cart</h2>

          <form className="order-form" onSubmit={handleSubmitOrder}>
            <div className="form-row">
              <div className="field">
                <label>Register Number</label>
                <input
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  placeholder="eg: IT2020xxxxx"
                />
              </div>
              <div className="field">
                <label>Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Student name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label>Hostel Room</label>
                <input
                  value={hostelRoom}
                  onChange={(e) => setHostelRoom(e.target.value)}
                  placeholder="eg: A-203"
                />
              </div>
              <div className="field">
                <label>Meal Time</label>
                <input value={mealTime} disabled />
              </div>
            </div>

            <div className="cart">
              <h3>Cart</h3>
              {cart.length === 0 && <p>No items in cart.</p>}
              {cart.map((item) => (
                <div key={item._id} className="cart-row">
                  <div className="cart-main">
                    <span>{item.name}</span>
                    <span className="cart-price">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="cart-controls">
                    <input
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item._id, Number(e.target.value))
                      }
                    />
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => updateQuantity(item._id, 0)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
<<<<<<< Updated upstream
              ))}

              <div className="cart-total">
                <span>Total</span>
                <span>Rs. {totalAmount.toFixed(2)}</span>
=======
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map((item) => (
                      <div key={item.id} className="cart-item">
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
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="quantity-input"
                          />
                          <button
                            className="remove-btn"
                            onClick={() => updateQuantity(item.id, 0)}
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
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>📝 Confirm Your Order</h2>
            
            <div className="modal-content">
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
                    <div key={item.id} className="confirm-item">
                      <span>{item.name} x{item.quantity}</span>
                      <span>Rs. {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="confirm-total">
                  <strong>Total Amount:</strong>
                  <strong>Rs. {totalAmount}</strong>
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
>>>>>>> Stashed changes
              </div>
            </div>

<<<<<<< Updated upstream
            {orderMessage && <p className="order-message">{orderMessage}</p>}

            <button type="submit" disabled={orderSubmitting}>
              {orderSubmitting ? 'Placing order...' : 'Place Order (Unpaid)'}
=======
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
              <p><strong>Payment Status:</strong> <span style={{color: '#27ae60'}}>Paid ✓</span></p>
            </div>

            <div className="payment-note">
              <p>🍽️ Show this confirmation at the counter to collect your food</p>
            </div>

            <button 
              className="btn-primary"
              onClick={() => setOrderDetails(null)}
            >
              Close
>>>>>>> Stashed changes
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default App
