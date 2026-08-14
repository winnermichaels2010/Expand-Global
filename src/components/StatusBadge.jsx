/* eslint-disable react/prop-types */
export default function StatusBadge({ status, size = 'text-[10px]' }) {
  const styles = {
    Pending: { background: 'hsl(247 12% 50% / 0.12)', color: 'var(--color-accent)' },
    'In Progress': { background: 'hsl(217 91% 60% / 0.12)', color: '#2563eb' },
    Accepted: { background: 'hsl(160 84% 39% / 0.12)', color: '#059669' },
    Completed: { background: 'hsl(160 84% 39% / 0.12)', color: '#059669' },
    Rejected: { background: 'hsl(0 84% 60% / 0.12)', color: '#dc2626' },
  };
  const badge = styles[status] || styles.Pending;
  return (
    <span
      className={`px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${size}`}
      style={badge}
    >
      {status}
    </span>
  );
}
