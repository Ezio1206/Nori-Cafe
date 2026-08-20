import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder, updateUserDelivery } from '../../firebase/firestore';
import DeliveryLocationForm from '../../components/customer/DeliveryLocationForm';
import DeliveryInfoDisplay from '../../components/customer/DeliveryInfoDisplay';
import PaymentReceiptUpload from '../../components/customer/PaymentReceiptUpload';
import Alert from '../../components/common/Alert';
import EmptyState from '../../components/common/EmptyState';
import { formatPrice } from '../../utils/formatPrice';
import { PAYMENT_STATUSES } from '../../utils/constants';
import qrCode from '../../assets/qr-code.png';

const REQUIRED_FIELDS = ['fullName', 'phone', 'city', 'address', 'googleMapsUrl'];

function isDeliveryComplete(delivery) {
  return Boolean(delivery) && REQUIRED_FIELDS.every((field) => delivery[field]?.trim());
}

/** Auto-fill delivery name/phone from the account profile whenever the
 * customer hasn't already saved their own delivery-specific values — so
 * they're never asked to retype information the account already has. */
function getInitialDeliveryValues(profile) {
  const delivery = profile?.delivery || {};
  return {
    ...delivery,
    fullName: delivery.fullName || profile?.name || '',
    phone: delivery.phone || profile?.phone || '',
  };
}

export default function Checkout() {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const deliveryComplete = isDeliveryComplete(profile?.delivery);
  const [editingDelivery, setEditingDelivery] = useState(!deliveryComplete);
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);
  const [savingDelivery, setSavingDelivery] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState(null); // 'Cash' | 'Online Payment'
  const [paymentReceipt, setPaymentReceipt] = useState(''); // data URL of the uploaded receipt

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '56px 24px' }}>
        <EmptyState
          title="Your cart is empty"
          message="Add drinks to your cart before checking out."
          action={<Link to="/" className="nori-btn nori-btn-primary">Browse Drinks</Link>}
        />
      </div>
    );
  }

  async function handleSaveDelivery(form) {
    setSavingDelivery(true);
    setError('');
    try {
      await updateUserDelivery(user.uid, form);
      await refreshProfile();
      setEditingDelivery(false);
    } catch (err) {
      setError('We couldn\u2019t save your delivery information. Please try again.');
    } finally {
      setSavingDelivery(false);
    }
  }

  function selectPaymentMethod(method) {
    setPaymentMethod(method);
    setPaymentReceipt('');
    setError('');
  }

  async function handleConfirmOrder() {
    if (!isDeliveryComplete(profile.delivery)) {
      setError('Please add your full name, phone, city/area, address, and Google Maps URL before placing your order.');
      setEditingDelivery(true);
      return;
    }
    if (!paymentMethod) {
      setError('Please choose a payment method.');
      return;
    }
    if (paymentMethod === 'Online Payment' && !paymentReceipt) {
      setError('Please upload your payment receipt before placing your order.');
      return;
    }

    setPlacing(true);
    setError('');
    try {
      // Copy the customer's current delivery info into the order as a fixed
      // snapshot — later changes to their Account delivery info must never
      // affect this order.
      const deliverySnapshot = { ...profile.delivery };

      const paymentStatus =
        paymentMethod === 'Cash' ? PAYMENT_STATUSES.CASH : PAYMENT_STATUSES.ONLINE_AWAITING;

      const orderId = await createOrder({
        userId: user.uid,
        items: items.map((i) => ({
          drinkId: i.drinkId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          imageUrl: i.imageUrl || '',
          size: i.size || '',
          sugarLevel: i.sugarLevel || '',
          note: i.note || '',
        })),
        subtotal,
        deliveryFee,
        total,
        deliveryInfo: deliverySnapshot,
        paymentMethod,
        paymentStatus,
        paymentReceiptUrl: paymentMethod === 'Online Payment' ? paymentReceipt : '',
      });
      clearCart();
      navigate(`/history/${orderId}`, { replace: true });
    } catch (err) {
      setError('We couldn\u2019t place your order. Please try again.');
    } finally {
      setPlacing(false);
    }
  }

  const readyToConfirm =
    !editingDelivery && paymentMethod && (paymentMethod === 'Cash' || Boolean(paymentReceipt));

  return (
    <div className="container" style={{ padding: '48px 24px', maxWidth: 720 }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: 24 }}>Checkout</h1>
      <Alert type="error">{error}</Alert>

      <section className="nori-card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: editingDelivery ? 18 : 0 }}>
          <h2 style={{ fontSize: '1.1rem' }}>Delivery Information</h2>
          {!editingDelivery && (
            <button className="nori-btn nori-btn-ghost" onClick={() => setEditingDelivery(true)}>Edit Delivery Information</button>
          )}
        </div>

        {editingDelivery ? (
          <DeliveryLocationForm
            initialValues={getInitialDeliveryValues(profile)}
            onSave={handleSaveDelivery}
            onCancel={deliveryComplete ? () => setEditingDelivery(false) : undefined}
            saving={savingDelivery}
          />
        ) : (
          <DeliveryInfoDisplay info={profile.delivery} />
        )}
      </section>

      {!editingDelivery && (
        <>
          <section className="nori-card" style={{ padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: 14 }}>Order Summary</h2>
            {items.map((item) => (
              <div key={item.lineKey} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', fontSize: '0.92rem', flexWrap: 'wrap' }}>
                <span>
                  {item.name} × {item.quantity}
                  <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--nori-coffee-mid)' }}>
                    Size {item.size} · Sugar {item.sugarLevel}
                  </span>
                  {item.note && (
                    <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--nori-coffee-mid)', fontStyle: 'italic' }}>
                      “{item.note}”
                    </span>
                  )}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--nori-border)', margin: '12px 0' }} />
            <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />
            <SummaryRow label="Delivery fee" value={formatPrice(deliveryFee)} />
            <SummaryRow label="Total" value={formatPrice(total)} bold />
          </section>

          <section className="nori-card" style={{ padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: 14 }}>Payment Method</h2>
            <div className="payment-method-row">
              <button
                type="button"
                className={`payment-method-card${paymentMethod === 'Cash' ? ' is-selected' : ''}`}
                onClick={() => selectPaymentMethod('Cash')}
              >
                <strong style={{ color: 'var(--nori-coffee-deep)' }}>Cash</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--nori-coffee-mid)' }}>
                  Pay in cash when your order is delivered.
                </span>
              </button>
              <button
                type="button"
                className={`payment-method-card${paymentMethod === 'Online Payment' ? ' is-selected' : ''}`}
                onClick={() => selectPaymentMethod('Online Payment')}
              >
                <strong style={{ color: 'var(--nori-coffee-deep)' }}>Online Payment</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--nori-coffee-mid)' }}>
                  Scan a QR code to pay before your order is placed.
                </span>
              </button>
            </div>

            {paymentMethod === 'Online Payment' && (
              <div style={{ textAlign: 'center', marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--nori-border)' }}>
                <img src={qrCode} alt="Payment QR code" style={{ width: 200, height: 200, margin: '0 auto', borderRadius: 12 }} />
                <p style={{ color: 'var(--nori-coffee-mid)', marginTop: 12, fontSize: '0.92rem' }}>
                  Scan the QR code with your banking app to pay {formatPrice(total)}.
                </p>

                <PaymentReceiptUpload value={paymentReceipt} onChange={setPaymentReceipt} />

                <p style={{ fontSize: '0.76rem', color: 'var(--nori-coffee-mid)', marginTop: 12, textAlign: 'left' }}>
                  Your order will show as "Awaiting Confirmation" until our team verifies your uploaded receipt.
                </p>
              </div>
            )}
          </section>

          <button
            className="nori-btn nori-btn-primary"
            style={{ width: '100%', padding: 16, fontSize: '1rem' }}
            onClick={handleConfirmOrder}
            disabled={placing || !readyToConfirm}
          >
            {placing ? 'Placing your order…' : 'Confirm Order'}
          </button>
          <p style={{ textAlign: 'center', color: 'var(--nori-coffee-mid)', fontSize: '0.8rem', marginTop: 10 }}>
            Once confirmed, your order details are locked in and can no longer be changed.
          </p>
        </>
      )}
    </div>
  );
}

function SummaryRow({ label, value, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontWeight: bold ? 700 : 500, fontSize: bold ? '1.05rem' : '0.92rem', color: bold ? 'var(--nori-coffee-deep)' : 'var(--nori-coffee-mid)' }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
