export default function SearchBar({ value, onChange, placeholder = 'Search drinks…' }) {
  return (
    <div style={{ position: 'relative', maxWidth: 320, width: '100%' }}>
      <input
        className="nori-input"
        style={{ paddingLeft: 38 }}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search drinks"
      />
      <svg
        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--nori-coffee-mid)" strokeWidth="2"
        style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" strokeLinecap="round" />
      </svg>
    </div>
  );
}
