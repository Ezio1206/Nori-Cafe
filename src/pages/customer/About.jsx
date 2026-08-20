import aboutPlaceholder from '../../assets/about/CEO.jpg';

export default function About() {
  return (
    <div className="container" style={{ padding: '56px 24px', maxWidth: 860 }}>
      <span className="nori-eyebrow">Our story</span>
      <h1 style={{ fontSize: '2.2rem', marginBottom: 18 }}>About Nori Coffee</h1>
      <p style={{ color: 'var(--nori-coffee-mid)', lineHeight: 1.7, marginBottom: 40 }}>
        Nori Coffee started as a small neighborhood counter with one goal: make people's day a
        little warmer, one cup at a time. Every drink is made fresh to order, using beans we
        trust and recipes we've refined over years behind the counter. Today, we bring that same
        cup straight to your door.
      </p>

      <div className="nori-card" style={{ overflow: 'hidden', display: 'flex', flexWrap: 'wrap', marginBottom: 40 }}>
        <img src={aboutPlaceholder} alt="Nori Coffee's creator" style={{ width: 260, minHeight: 220, objectFit: 'cover', flex: '1 1 260px' }} />
        <div style={{ padding: 28, flex: '2 1 300px' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: 10 }}>Meet the creator</h2>
          <p style={{ color: 'var(--nori-coffee-mid)', lineHeight: 1.7 }}>
            I started Nori Coffee from my love of coffee and my dream of having my own business. As a university student, I wanted to create something that could fit around my studies while giving me real experience in business. I started small, learning how to make coffee, choose the right beans, set prices, and serve customers. Nori Coffee is my first step into entrepreneurship, and I hope to grow it into a bigger brand in the future.
          </p>
        </div>
      </div>

      <div className="nori-card" style={{ padding: 28 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 14 }}>Get in touch</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, color: 'var(--nori-coffee-mid)' }}>
          <li><strong style={{ color: 'var(--nori-coffee-deep)' }}>Email:</strong> sokchhonchim@gmail.com</li>
          <li><strong style={{ color: 'var(--nori-coffee-deep)' }}>Phone:</strong> (+855) 99 263 387</li>
          <li><strong style={{ color: 'var(--nori-coffee-deep)' }}>Hours:</strong> Mon–Sun, 7am – 4pm</li>
        </ul>
      </div>
    </div>
  );
}
