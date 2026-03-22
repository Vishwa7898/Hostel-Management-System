// src/components/PaymentForm.jsx
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
      padding: '10px 12px',
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const PaymentForm = ({ orderId, totalAmount, onPaymentSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const isDemoOrder = String(orderId || '').startsWith('demo_');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (isDemoOrder) {
      const { error: pmError } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });
      if (pmError) {
        setError(pmError.message);
        setLoading(false);
        return;
      }
      await new Promise((r) => setTimeout(r, 800));
      onPaymentSuccess();
      setLoading(false);
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
      const response = await fetch('http://localhost:5000/api/payment/create-payment-intent', {
        method: 'POST',
        headers,
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create payment');
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {},
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
      } else if (paymentIntent?.status === 'succeeded') {
        const confirmResponse = await fetch('http://localhost:5000/api/payment/confirm-payment', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            orderId: orderId,
          }),
        });

        if (confirmResponse.ok) {
          onPaymentSuccess();
        } else {
          const errData = await confirmResponse.json().catch(() => ({}));
          setError(errData.message || 'Payment confirmed but update failed');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-modal">
      <div className="payment-modal-content">
        <h3>💳 Complete Payment</h3>
        <p className="payment-amount">Total Amount: Rs. {totalAmount}</p>
        {isDemoOrder && (
          <p className="text-sm text-slate-500 mb-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Demo order — card will be validated, no real charge
          </p>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="card-element-container">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>

          {error && <div className="payment-error">{error}</div>}

          <div className="payment-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={!stripe || loading}
            >
              {loading ? 'Processing...' : `Pay Rs. ${totalAmount}`}
            </button>
          </div>
        </form>

        <div className="test-card-info">
          <p><small>Test Card: 4242 4242 4242 4242 | Exp: 12/34 | CVC: 123</small></p>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;