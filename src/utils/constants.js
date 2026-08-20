export const ORDER_STATUSES = ['Order Placed', 'Preparing', 'Out for Delivery', 'Delivered'];

export const DRINK_CATEGORIES = ['All', 'Coffee', 'Tea', 'Iced', 'Specialty'];

export const DELIVERY_FEE = 1.5;

/* ------------------------- Drink customization ------------------------- */

export const SIZES = ['S', 'M', 'L'];
export const SIZE_LABELS = { S: 'Small', M: 'Medium', L: 'Large' };
export const DEFAULT_SIZE = 'M';

export const SUGAR_LEVELS = ['0%', '25%', '50%', '75%', '100%'];
export const DEFAULT_SUGAR_LEVEL = '50%';

/* ----------------------------- Payment ----------------------------- */

export const PAYMENT_METHODS = ['Cash', 'Online Payment'];

// Payment status values. Online orders start "Awaiting Confirmation" and are
// only ever moved to "Paid" by an admin who has verified the QR payment —
// we never auto-mark an order as paid just because the customer said so.
export const PAYMENT_STATUSES = {
  CASH: 'Unpaid (Cash on Delivery)',
  ONLINE_AWAITING: 'Awaiting Confirmation',
  ONLINE_PAID: 'Paid',
};
