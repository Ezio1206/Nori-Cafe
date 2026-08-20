import { useEffect, useState } from 'react';
import {
  subscribeToDrinks, createDrink, updateDrink, deleteDrink,
} from '../../firebase/firestore';
import DrinkFormModal from '../../components/admin/DrinkFormModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { formatPrice } from '../../utils/formatPrice';
import { getDrinkPriceRange } from '../../utils/pricing';
import placeholder from '../../assets/drinks/placeholder.svg';

export default function ManageDrinks() {
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDrink, setEditingDrink] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToDrinks((data) => {
      setDrinks(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  function openAddModal() {
    setEditingDrink(null);
    setModalOpen(true);
  }

  function openEditModal(drink) {
    setEditingDrink(drink);
    setModalOpen(true);
  }

  async function handleSave(form) {
    setSaving(true);
    setError('');
    try {
      if (editingDrink) {
        await updateDrink(editingDrink.id, form);
      } else {
        await createDrink(form);
      }
      setModalOpen(false);
    } catch (err) {
      setError('We couldn\u2019t save this drink. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteDrink(deleteTarget.id);
    } catch (err) {
      setError('We couldn\u2019t delete this drink. Please try again.');
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.7rem' }}>Manage Drinks</h1>
        <button className="nori-btn nori-btn-primary" onClick={openAddModal}>+ Add Drink</button>
      </div>

      <Alert type="error">{error}</Alert>

      {loading ? (
        <LoadingSpinner label="Loading drinks…" />
      ) : drinks.length === 0 ? (
        <EmptyState title="No drinks yet" message="Add your first drink to get the menu started." />
      ) : (
        <div className="nori-card nori-table-wrap" style={{ overflow: 'hidden' }}>
          <table className="nori-table">
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--nori-border)', fontSize: '0.8rem', color: 'var(--nori-coffee-mid)' }}>
                <th style={{ padding: '14px 20px' }}>Drink</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th style={{ paddingRight: 20 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {drinks.map((drink) => {
                const { min, max, sameForAll } = getDrinkPriceRange(drink);
                return (
                  <tr key={drink.id} style={{ borderBottom: '1px solid var(--nori-border)' }}>
                    <td style={{ padding: '12px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="nori-thumb" style={{ width: 44, height: 44 }}>
                          <img src={drink.imageUrl || placeholder} alt={drink.name} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 600 }}>{drink.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--nori-coffee-mid)', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {drink.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td><span className="nori-tag">{drink.category}</span></td>
                    <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {sameForAll ? formatPrice(min) : `${formatPrice(min)}–${formatPrice(max)}`}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: drink.available === false ? 'var(--nori-error)' : 'var(--nori-success)' }}>
                        {drink.available === false ? 'Unavailable' : 'Available'}
                      </span>
                    </td>
                    <td style={{ paddingRight: 20 }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="nori-btn nori-btn-ghost" onClick={() => openEditModal(drink)}>Edit</button>
                        <button className="nori-btn nori-btn-ghost" style={{ color: 'var(--nori-error)' }} onClick={() => setDeleteTarget(drink)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <DrinkFormModal
        open={modalOpen}
        initialValues={editingDrink}
        onSave={handleSave}
        onCancel={() => setModalOpen(false)}
        saving={saving}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this drink?"
        message={`"${deleteTarget?.name}" will be permanently removed from the menu.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
