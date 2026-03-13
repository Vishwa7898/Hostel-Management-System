// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import App from './App'
import './index.css'

// Stripe publishable key එක load කරන්න
const stripePromise = loadStripe('pk_test_your_stripe_publishable_key')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </React.StrictMode>,
)