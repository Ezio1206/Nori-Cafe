import { useEffect, useMemo, useState } from 'react';
import { subscribeToDrinks } from '../../firebase/firestore';
import DrinkCard from '../../components/customer/DrinkCard';
import CategoryFilter from '../../components/customer/CategoryFilter';
import SearchBar from '../../components/customer/SearchBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function Home() {
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToDrinks((data) => {
      setDrinks(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const filtered = useMemo(() => {
    return drinks.filter((d) => {
      const matchesCategory = category === 'All' || d.category === category;
      const matchesSearch = d.name?.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [drinks, category, search]);

  return (
    <div>
      <Hero />

      <section className="container" style={{ padding: '48px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
          <CategoryFilter active={category} onChange={setCategory} />
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {loading ? (
          <LoadingSpinner label="Brewing the menu…" />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No drinks found"
            message={drinks.length === 0 ? 'The menu is empty right now — check back soon.' : 'Try a different search or category.'}
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 22 }}>
            {filtered.map((drink) => (
              <DrinkCard key={drink.id} drink={drink} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Hero() {
  return (
    <section style={{ background: 'linear-gradient(180deg, var(--nori-tan-soft), var(--nori-cream))', padding: '64px 24px 56px' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: 640 }}>
        <span className="nori-eyebrow">Every sip carries a story. Every story begins here.</span>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: 14 }}>
          Welcome! to Nori Coffee.
        </h1>
        <p style={{ color: 'var(--nori-coffee-mid)', fontSize: '1.02rem', marginBottom: 6 }}>
          Start your day with Nori Coffee.
        </p>
      </div>
    </section>
  );
}
