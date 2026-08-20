// All Firestore reads/writes for Nori Coffee live here, kept separate from UI
// components. Collections: `users`, `drinks`, `orders`.
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

/* ----------------------------- Drinks ----------------------------- */

const drinksRef = collection(db, 'drinks');

export async function createDrink(drink) {
  // Description is optional; Firestore rejects `undefined`, so default to ''.
  const docRef = await addDoc(drinksRef, {
    name: drink.name,
    description: drink.description || '',
    price: Number(drink.price),
    // Per-size prices (S/M/L). Falls back to `price` anywhere it's missing —
    // see utils/pricing.js — so older drinks/orders keep working unchanged.
    sizePricing: drink.sizePricing || null,
    category: drink.category,
    imageUrl: drink.imageUrl,
    available: drink.available !== undefined ? drink.available : true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateDrink(drinkId, updates) {
  const cleaned = { ...updates };
  if (cleaned.price !== undefined) cleaned.price = Number(cleaned.price);
  if (cleaned.description === undefined) delete cleaned.description;
  else cleaned.description = cleaned.description || '';
  if (cleaned.sizePricing === undefined) delete cleaned.sizePricing;

  await updateDoc(doc(db, 'drinks', drinkId), {
    ...cleaned,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDrink(drinkId) {
  await deleteDoc(doc(db, 'drinks', drinkId));
}

export async function getAllDrinks() {
  const snap = await getDocs(drinksRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** Live subscription used on the Home page so new/edited drinks appear instantly. */
export function subscribeToDrinks(callback) {
  return onSnapshot(drinksRef, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

/* ----------------------------- Users ----------------------------- */

export async function getUserById(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateUserProfile(uid, updates) {
  await updateDoc(doc(db, 'users', uid), updates);
}

/**
 * Replace the customer's saved delivery info as a whole. Kept separate from
 * updateUserProfile so it's clear this only ever affects future orders —
 * past orders keep their own deliveryInfo snapshot (see createOrder below).
 */
export async function updateUserDelivery(uid, delivery) {
  await updateDoc(doc(db, 'users', uid), { delivery });
}

export async function getAllCustomers() {
  const q = query(collection(db, 'users'), where('role', '==', 'customer'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/* ----------------------------- Orders ----------------------------- */

const ordersRef = collection(db, 'orders');

export async function createOrder(order) {
  const docRef = await addDoc(ordersRef, {
    userId: order.userId,
    items: order.items, // [{ drinkId, name, price, quantity, imageUrl, size, sugarLevel, note }]
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    total: order.total,
    deliveryInfo: order.deliveryInfo, // { name, phone, address, city, deliveryNote }
    paymentMethod: order.paymentMethod, // 'Cash' | 'Online Payment'
    paymentStatus: order.paymentStatus, // see utils/constants PAYMENT_STATUSES
    // Uploaded receipt/screenshot for Online Payment orders, stored as a
    // data URL (Firebase Storage is intentionally not used — see
    // firebase/config.js). Empty string for Cash orders.
    paymentReceiptUrl: order.paymentReceiptUrl || '',
    status: 'Order Placed',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getOrderById(orderId) {
  const snap = await getDoc(doc(db, 'orders', orderId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getOrdersForUser(uid) {
  const q = query(
    collection(db, 'orders'),
    where('userId', '==', uid),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getAllOrders() {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateOrderStatus(orderId, status) {
  await updateDoc(doc(db, 'orders', orderId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

/** Admin-only: confirm/adjust the payment status of an order (e.g. mark an
 * Online Payment order as "Paid" once the QR payment has been verified). */
export async function updatePaymentStatus(orderId, paymentStatus) {
  await updateDoc(doc(db, 'orders', orderId), {
    paymentStatus,
    updatedAt: serverTimestamp(),
  });
}

/** Live subscription for a single order — powers real-time tracking on Order Details. */
export function subscribeToOrder(orderId, callback) {
  return onSnapshot(doc(db, 'orders', orderId), (snap) => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  });
}

/** Live subscription for a customer's full order history. */
export function subscribeToUserOrders(uid, callback) {
  const q = query(
    collection(db, 'orders'),
    where('userId', '==', uid),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

/** Live subscription for the admin Manage Orders page. */
export function subscribeToAllOrders(callback) {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}
