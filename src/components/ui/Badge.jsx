import styles from './Badge.module.css';
import { STATUS_CONFIG } from '../../utils/helpers';

export default function Badge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, color: 'pending' };
  return (
    <span className={`${styles.badge} ${styles[config.color]}`}>
      {config.label}
    </span>
  );
}
