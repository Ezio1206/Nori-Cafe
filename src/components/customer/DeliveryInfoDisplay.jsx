export default function DeliveryInfoDisplay({ info, compact = false }) {
  if (!info) return null;

  return (
    <div style={{ color: 'var(--nori-coffee-mid)', fontSize: compact ? '0.88rem' : '0.92rem', lineHeight: 1.7 }}>
      <div>
        <strong style={{ color: 'var(--nori-coffee-deep)' }}>{info.fullName}</strong> · {info.phone}
      </div>
      <div>{info.city}</div>
      <div>{info.address}</div>
      {info.googleMapsUrl && (
        <a
          href={info.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="nori-btn nori-btn-secondary"
          style={{ display: 'inline-flex', marginTop: 8, padding: '6px 14px', fontSize: '0.82rem' }}
        >
          Open in Google Maps ↗
        </a>
      )}
      {info.deliveryNote && (
        <div style={{ marginTop: 8 }}>
          <strong style={{ color: 'var(--nori-coffee-deep)' }}>Delivery note:</strong> {info.deliveryNote}
        </div>
      )}
    </div>
  );
}
