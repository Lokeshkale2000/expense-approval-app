import './Avatar.css';

export default function Avatar({ initials = '?', size = 'sm' }) {
  return (
    <span className={`avatar ${size}`}>
      {initials.slice(0, 2).toUpperCase()}
    </span>
  );
}
