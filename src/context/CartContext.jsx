import { createContext, useContext, useEffect, useState } from 'react';
import { getSizePrice } from '../utils/pricing';
import { DEFAULT_SIZE, DEFAULT_SUGAR_LEVEL } from '../utils/constants';

const CartContext = createContext(null);
const STORAGE_KEY = 'nori-coffee-cart';

/** Two cart lines are "the same" only if drink + size + sugar level + note all
 * match — a different note (e.g. "no whipped cream") makes it a distinct
 * order line so special instructions are never silently merged away. */
function makeLineKey(drinkId, size, sugarLevel, note) {
  return `${drinkId}__${size}__${sugarLevel}__${note || ''}`;
}

// The cart is a working draft the customer builds before checkout, so it's
// kept in localStorage for a smooth refresh experience. Once an order is
// confirmed it's written permanently to Firestore (see firebase/firestore.js).
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addToCart(drink, quantity = 1, options = {}) {
    const size = options.size || DEFAULT_SIZE;
    const sugarLevel = options.sugarLevel || DEFAULT_SUGAR_LEVEL;
    const note = options.note?.trim() || '';
    const unitPrice = getSizePrice(drink, size);
    const lineKey = makeLineKey(drink.id, size, sugarLevel, note);

    setItems((prev) => {
      const existing = prev.find((i) => i.lineKey === lineKey);
      if (existing) {
        return prev.map((i) =>
          i.lineKey === lineKey ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          lineKey,
          drinkId: drink.id,
          name: drink.name,
          price: unitPrice,
          imageUrl: drink.imageUrl,
          size,
          sugarLevel,
          note,
          quantity,
        },
      ];
    });
  }

  function increaseQuantity(lineKey) {
    setItems((prev) =>
      prev.map((i) => (i.lineKey === lineKey ? { ...i, quantity: i.quantity + 1 } : i))
    );
  }

  function decreaseQuantity(lineKey) {
    setItems((prev) =>
      prev
        .map((i) => (i.lineKey === lineKey ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  }

  function removeFromCart(lineKey) {
    setItems((prev) => prev.filter((i) => i.lineKey !== lineKey));
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = items.length > 0 ? 1.5 : 0;
  const total = subtotal + deliveryFee;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const value = {
    items,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    total,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
