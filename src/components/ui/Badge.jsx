import './Badge.css';
import { STATUS_CONFIG } from '../../utils/helpers';

export default function Badge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, color: 'pending' };
  return (
    <span className={`bdg-badge bdg-${config.color}`}>
      {config.label}
    </span>
  );
}
