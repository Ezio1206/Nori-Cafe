export default function PrivacyPolicy() {
  return (
    <div className="container" style={{ padding: '56px 24px', maxWidth: 780 }}>
      <span className="nori-eyebrow">Legal</span>
      <h1 style={{ fontSize: '2rem', marginBottom: 18 }}>Privacy Policy</h1>

      <p style={{ color: 'var(--nori-coffee-mid)', lineHeight: 1.7, marginBottom: 28 }}>
        This is a placeholder Privacy Policy page for Nori Coffee. Replace the sections below
        with your actual policy covering what information is collected, how it's used, and how
        customers can contact you about their data.
      </p>

      <div className="nori-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Section
          title="Information we collect"
          body="[Placeholder] Describe what account, order, delivery, and payment-receipt information is collected when a customer places an order."
        />
        <Section
          title="How we use your information"
          body="[Placeholder] Describe how order and delivery details are used to fulfill orders and how contact details are used for support."
        />
        <Section
          title="Data storage"
          body="[Placeholder] Describe where customer data and uploaded payment receipts are stored and how long they're retained."
        />
        <Section
          title="Contact us"
          body="[Placeholder] Provide an email or contact method for privacy-related questions. See the footer's Contact Us section for current contact details."
        />
      </div>
    </div>
  );
}

function Section({ title, body }) {
  return (
    <div>
      <h2 style={{ fontSize: '1.1rem', marginBottom: 6 }}>{title}</h2>
      <p style={{ color: 'var(--nori-coffee-mid)', lineHeight: 1.7, margin: 0 }}>{body}</p>
    </div>
  );
}
