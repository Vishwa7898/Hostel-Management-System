import { useEffect, useMemo, useState } from 'react'
import './App.css'

const MEAL_TIMES = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
]

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking backend...')
  const [mealTime, setMealTime] = useState('breakfast')
  const [menu, setMenu] = useState([])
  const [menuLoading, setMenuLoading] = useState(false)
  const [menuError, setMenuError] = useState('')

  const [cart, setCart] = useState([])
  const [regNumber, setRegNumber] = useState('')
  const [name, setName] = useState('')
  const [hostelRoom, setHostelRoom] = useState('')
  const [orderSubmitting, setOrderSubmitting] = useState(false)
  const [orderMessage, setOrderMessage] = useState('')

  // Check backend health once
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
      const existing = prev.find((i) => i._id === food._id)
      if (existing) {
        return prev.map((i) =>
          i._id === food._id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...food, quantity: 1 }]
    })
  }

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => i._id !== id))
    } else {
      setCart((prev) =>
        prev.map((i) => (i._id === id ? { ...i, quantity } : i))
      )
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

    try {
      setOrderSubmitting(true)
      const body = {
        regNumber,
        name,
        hostelRoom,
        mealTime,
        items: cart.map((c) => ({
          foodItemId: c._id,
          quantity: c.quantity,
        })),
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
              ))}

              <div className="cart-total">
                <span>Total</span>
                <span>Rs. {totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {orderMessage && <p className="order-message">{orderMessage}</p>}

            <button type="submit" disabled={orderSubmitting}>
              {orderSubmitting ? 'Placing order...' : 'Place Order (Unpaid)'}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default App
