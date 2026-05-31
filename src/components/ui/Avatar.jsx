import styles from './Avatar.module.css';

export default function Avatar({ initials = '?', size = 'sm' }) {
  return (
    <span className={`${styles.avatar} ${styles[size]}`}>
      {initials.slice(0, 2).toUpperCase()}
    </span>
  );
}
