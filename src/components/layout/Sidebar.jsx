import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Shield, Receipt, Gift,
  CreditCard, FileText, Settings, ScrollText, Grid3X3,
} from 'lucide-react';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Teams', icon: Users, to: '/teams' },
  { label: 'Roles', icon: Shield, to: '/roles' },
  { label: 'Expense', icon: Receipt, to: '/expenses/all', base: '/expenses' },
  { label: 'Rewards', icon: Gift, to: '/rewards' },
  { label: 'Smart Cards', icon: CreditCard, to: '/smart-cards' },
  { label: 'Reports', icon: FileText, to: '/reports' },
];

const BOTTOM_ITEMS = [
  { label: 'Settings', icon: Settings, to: '/settings' },
  { label: 'Terms & Conditions', icon: ScrollText, to: '/terms' },
];

export default function Sidebar() {
  const location = useLocation();
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="2.5" fill="none" />
            <circle cx="12" cy="12" r="3" fill="white" />
          </svg>
        </div>
        <span className={styles.logoText}>OptiFii</span>
        <Grid3X3 size={16} className={styles.gridIcon} />
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ label, icon: Icon, to, base }) => (
          <NavLink
            key={label}
            to={to}
            className={() => {
              const isActive = base
                ? location.pathname.startsWith(base)
                : location.pathname === to;
              return `${styles.navItem}${isActive ? ` ${styles.active}` : ''}`;
            }}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}

        <div className={styles.divider} />

        {BOTTOM_ITEMS.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `${styles.navItem}${isActive ? ` ${styles.active}` : ''}`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.footerAvatar} />
        <div className={styles.footerInfo}>
          <div className={styles.footerName}>Giftryt Ventures Pvt. Ltd.</div>
          <div className={styles.footerEmail}>team@giftryt.com</div>
        </div>
      </div>
    </aside>
  );
}
