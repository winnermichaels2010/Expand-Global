import { UserRound } from 'lucide-react';

// eslint-disable-next-line react/prop-types
export default function ProfileAvatar({ src, alt, size = 36, className = '', style, iconSize }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || 'Profile'}
        className={`rounded-full object-cover flex-shrink-0 ${className}`}
        style={{ width: size, height: size, ...style }}
      />
    );
  }
  return (
    <div
      className={`rounded-full flex items-center justify-center flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        background: 'var(--color-accent-light)',
        color: 'var(--color-accent)',
        ...style,
      }}
    >
      <UserRound size={iconSize || Math.round(size / 2)} />
    </div>
  );
}
