export default function Alert({ type = 'error', children }) {
  if (!children) return null;
  return <div className={`nori-alert nori-alert-${type}`}>{children}</div>;
}
