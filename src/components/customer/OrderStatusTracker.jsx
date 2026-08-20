import { ORDER_STATUSES } from '../../utils/constants';

export default function OrderStatusTracker({ status }) {
  const currentIndex = ORDER_STATUSES.indexOf(status);

  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      {ORDER_STATUSES.map((step, i) => {
        const done = i <= currentIndex;
        const isLast = i === ORDER_STATUSES.length - 1;
        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center', flex: isLast ? 'initial' : 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: done ? 'var(--nori-coffee)' : 'var(--nori-tan-soft)',
                  color: done ? '#fff' : 'var(--nori-coffee-mid)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
                }}
              >
                {done ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: '0.72rem', textAlign: 'center', maxWidth: 78, color: done ? 'var(--nori-coffee-deep)' : 'var(--nori-coffee-mid)', fontWeight: done ? 700 : 500 }}>
                {step}
              </span>
            </div>
            {!isLast && (
              <div style={{ flex: 1, height: 3, margin: '0 6px', marginBottom: 20, background: i < currentIndex ? 'var(--nori-coffee)' : 'var(--nori-tan-soft)', borderRadius: 2 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
